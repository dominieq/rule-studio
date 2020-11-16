import React, { Component } from "react";
import PropTypes from "prop-types";
import { downloadMatrix, fetchClassification } from "../../../Utils/utilFunctions/fetchFunctions";
import { parseFormData } from "../../../Utils/utilFunctions/fetchFunctions/parseFormData";
import { getItemName, parseClassifiedItems } from "../../../Utils/utilFunctions/parseItems";
import { parseClassifiedListItems } from "../../../Utils/utilFunctions/parseListItems";
import { parseClassificationParams } from "../../../Utils/utilFunctions/parseParams";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import MatrixButton from "../Utils/Buttons/MatrixButton";
import MatrixDownloadButton from "../Utils/Buttons/MatrixDownloadButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import DefaultClassificationResultSelector from "../Utils/Calculations/DefaultClassificationResultSelector";
import TypeOfClassifierSelector from "../Utils/Calculations/TypeOfClassifierSelector";
import CustomBox from "../../../Utils/Containers/CustomBox";
import CustomDrawer from "../../../Utils/Containers/CustomDrawer";
import { MatrixDialog } from "../../../Utils/DataDisplay/MatrixDialog";
import StyledDivider from "../../../Utils/DataDisplay/StyledDivider";
import CircleHelper from "../../../Utils/Feedback/CircleHelper";
import { CSVDialog } from "../../../Utils/Feedback/CSVDialog";
import { ClassifiedObjectDialog } from "../../../Utils/Feedback/DetailsDialog"
import StyledAlert from "../../../Utils/Feedback/StyledAlert";
import CustomButtonGroup from "../../../Utils/Inputs/CustomButtonGroup";
import CustomUpload from "../../../Utils/Inputs/CustomUpload";
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";
import {AttributesMenu} from "../../../Utils/Menus/AttributesMenu";

/**
 * The classification tab in RuLeStudio.
 * Presents the list of all object from information table with suggested classification based on generated rules.
 *
 * @class
 * @category Tabs
 * @subcategory Tabs
 * @param {Object} props
 * @param {function} props.onDateUploaded - Callback fired when tab receives information that new data was uploaded.
 * @param {function} props.onTabChange - Callback fired when a tab is changed and there are unsaved changes in this tab.
 * @param {Object} props.project - Current project.
 * @param {string} props.serverBase - The name of the host.
 * @param {function} props.showAlert - Callback fired when results in this tab are based on outdated information table.
 * @param {number} props.value - The id of a tab.
 * @returns {React.Component}
 */
class Classification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
            items: null,
            displayedItems: [],
            externalData: false,
            parameters: {
                defaultClassificationResult: "majorityDecisionClass",
                typeOfClassifier: "SimpleRuleClassifier",
            },
            parametersSaved: true,
            selected: {
                item: null,
                action: 0
            },
            open: {
                details: false,
                matrix: false,
                settings: false,
                csv: false
            },
            attributesMenuEl: null,
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    /**
     * Makes an API call on classification to receive current copy of classification from server.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf Classification
     */
    getClassification = () => {
        const { project, serverBase } = this.props;
        const pathParams = { projectId: project.id };
        const method = "GET";

        fetchClassification(
            pathParams, method, null, serverBase
        ).then(result => {
            if (this._isMounted && result != null && result.hasOwnProperty("Objects")
                && result.hasOwnProperty("objectNames")) {

                const items = parseClassifiedItems(result.Objects, result.objectNames);
                const resultParameters = result.hasOwnProperty("parameters") ?
                    parseClassificationParams(result.parameters) : { };

                this.setState(({parameters}) => ({
                    data: result,
                    items: items,
                    displayedItems: items,
                    parameters: { ...parameters, ...resultParameters }
                }));

                if (result.hasOwnProperty("isCurrentLearningData")) {
                    if (result.hasOwnProperty("isCurrentRuleSet")) {
                        this.props.showAlert(this.props.value, !(result.isCurrentLearningData && result.isCurrentRuleSet));
                    } else {
                        this.props.showAlert(this.props.value, !result.isCurrentLearningData);
                    }
                }

                if (result.hasOwnProperty("externalData")) {
                    this.props.onDataUploaded(result.externalData);
                }
            }
        }).catch(error => {
            if (error.constructor.name !== "AlertError") {
                console.error(error);
            }

            if (this._isMounted) {
                this.setState({
                    data: null,
                    items: null,
                    displayedItems: [],
                    alertProps: error
                });
            }
        }).finally(() => {
            if (this._isMounted) {
                const { project: { parameters, parametersSaved, classifyAction }} = this.props;
                const { defaultClassificationResult, typeOfClassifier } = parameters;

                this.setState(({parameters, selected}) => ({
                    loading: false,
                    parameters: parametersSaved ?
                        parameters : { ...parameters, ...{ defaultClassificationResult, typeOfClassifier }},
                    parametersSaved: parametersSaved,
                    selected: { ...selected, item: null, action: classifyAction }
                }));
            }
        });
    }

    /**
     * A component's lifecycle method. Fired once when component was mounted.
     * <br>
     * <br>
     * Method calls {@link getClassification}.
     *
     * @function
     * @memberOf Classification
     */
    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getClassification);
    }

    /**
     * A component's lifecycle method. Fired after a component was updated.
     * <br>
     * <br>
     * If index option was changed, method sets object's names according to new value.
     * <br>
     * <br>
     * If project was changed, method saves changes from previous project
     * and calls {@link getClassification} to receive the latest copy of classification.
     *
     * @function
     * @memberOf Classification
     * @param {Object} prevProps - Old props that were already replaced.
     * @param {Object} prevState - Old state that was already replaced.
     * @param {Object} snapshot - Returned from another lifecycle method <code>getSnapshotBeforeUpdate</code>. Usually undefined.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.project.id !== this.props.project.id) {
            const { parametersSaved, selected: { action } } = prevState;
            let project = { ...prevProps.project };

            if (!parametersSaved) {
                const { parameters } = prevState;

                project.parameters = { ...project.parameters, ...parameters};
                project.parametersSaved = parametersSaved;
            }

            project.classifyAction = action;
            this.props.onTabChange(project);
            this.setState({ loading: true }, this.getClassification);
        }
    }

    /**
     * A component's lifecycle method. Fired when component was requested to be unmounted.
     * <br>
     * <br>
     * Method saves changes from current project.
     *
     * @function
     * @memberOf Classification
     */
    componentWillUnmount() {
        this._isMounted = false;
        const { parametersSaved, selected: { action } } = this.state;
        let project = JSON.parse(JSON.stringify(this.props.project));

        if (!parametersSaved) {
            const { parameters } = this.state;

            project.parameters = { ...project.parameters, ...parameters };
            project.parametersSaved = parametersSaved;
        }

        project.classifyAction = action;
        this.props.onTabChange(project);
    }

    /**
     * Makes an API call on classification to classify objects from current project or uploaded objects
     * with selected parameters.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf Classification
     * @param {string} method - A HTTP method such as GET, POST or PUT.
     * @param {Object} data - The body of the message.
     */
    calculateClassification = (method, data) => {
        const { project, serverBase } = this.props;

        this.setState({
            loading: true,
        }, () => {
            const pathParams = { projectId: project.id };

            fetchClassification(
                pathParams, method, data, serverBase
            ).then(result => {
                if (result) {
                    if (this._isMounted && result.hasOwnProperty("Objects")
                        && result.hasOwnProperty("objectNames")) {

                        const items = parseClassifiedItems(result.Objects, result.objectNames);

                        this.setState({
                            data: result,
                            items: items,
                            displayedItems: items,
                            parametersSaved: true
                        });
                    }

                    let projectCopy = JSON.parse(JSON.stringify(project));
                    const resultParameters = result.hasOwnProperty("parameters") ?
                        parseClassificationParams(result.parameters) : { };

                    projectCopy.parameters = { ...project.parameters, ...resultParameters }
                    projectCopy.parametersSaved = true;
                    this.props.onTabChange(projectCopy);

                    if (result.hasOwnProperty("isCurrentLearningData")) {
                        if (result.hasOwnProperty("isCurrentRuleSet")) {
                            this.props.showAlert(this.props.value, !(result.isCurrentLearningData && result.isCurrentRuleSet));
                        } else {
                            this.props.showAlert(this.props.value, !result.isCurrentLearningData);
                        }
                    }

                    if (result.hasOwnProperty("externalData")) {
                        this.props.onDataUploaded(result.externalData);
                    }
                }
            }).catch(error => {
                if (error.constructor.name !== "AlertError") {
                    console.error(error);
                }

                if (this._isMounted) {
                    this.setState({
                        data: null,
                        items: null,
                        displayedItems: [],
                        alertProps: error
                    });
                }
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({selected}) => ({
                        loading: false,
                        selected: { ...selected, item: null }
                    }));
                }
            });
        });
    }

    /**
     * Calls {@link calculateClassification} to classify objects from current project.
     *
     * @function
     * @memberOf Classification
     */
    onClassifyData = () => {
        const { parameters } = this.state;

        const method = "PUT";
        const data = parseFormData(parameters, null);

        this.calculateClassification(method, data);
    };

    /**
     * Calls {@link calculateClassification} to classify objects from uploaded file.
     * If uploaded file is in CSV format, method opens {@link CSVDialog} to specify CSV attributes.
     *
     * @function
     * @memberOf Classification
     * @param {Object} event - Represents an event that takes place in DOM.
     */
    onUploadData = (event) => {
        event.persist();

        if (event.target.files) {
            if (event.target.files[0].type !== "application/json") {
                this.csvFile = event.target.files[0];

                this.setState(({open}) => ({
                    open: { ...open, csv: true }
                }));
            } else {
                const { parameters } = this.state;

                let method = "PUT";
                let files = { externalDataFile: event.target.files[0] };

                let data = parseFormData(parameters, files);
                this.calculateClassification(method, data);
            }
        }
    };

    /**
     * Callback fired when {@link CSVDialog} requests to be closed.
     * If the user specified CSV attributes, method calls {@link calculateClassification} to
     * classify objects from uploaded file.
     *
     * @function
     * @memberOf Classification
     * @param {Object} csvSpecs - An object representing CSV attributes.
     */
    onCSVDialogClose = (csvSpecs) => {
        this.setState(({open}) => ({
            open: { ...open, csv: false }
        }), () => {
            if (csvSpecs && Object.keys(csvSpecs).length) {
                const { parameters } = this.state;

                let method = "PUT";
                let files = { externalDataFile: this.csvFile };

                let data = parseFormData({ ...parameters, ...csvSpecs }, files);
                this.calculateClassification(method, data);
            }
        });
    }

    /**
     * Callback fired when the user requests to download misclassification matrix.
     * Method makes an API call to download the resource.
     *
     * @function
     * @memberOf Classification
     */
    onSaveToFile = () => {
        const { project, serverBase } = this.props;
        const pathParams = { projectId: project.id };
        const queryParams = { typeOfMatrix: "classification" };

        downloadMatrix(pathParams, queryParams, serverBase).catch(this.onSnackbarOpen);
    };

    onDefaultClassificationResultChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, defaultClassificationResult: event.target.value},
                parametersSaved: false
            }));
        }
    };

    onClassifierTypeChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, typeOfClassifier: event.target.value},
                parametersSaved: false
            }));
        }
    };

    onClassifyActionChange = (index) => {
        this.setState(({selected}) => ({
            selected: { ...selected, action: index }
        }));
    };

    /**
     * Filters items from {@link Classification}'s state.
     * Method uses {@link filterFunction} to filter items.
     *
     * @function
     * @memberOf Classification
     * @param {Object} event - Represents an event that takes place in DOM.
     */
    onFilterChange = (event) => {
        const { loading, items } = this.state;

        if (!loading && Array.isArray(items) && items.length) {
            const filteredItems = filterFunction(event.target.value.toString(), items.slice());

            this.setState(({selected}) => ({
                displayedItems: filteredItems,
                selected: { ...selected, item: null }
            }));
        }
    };

    toggleOpen = (name) => {
        this.setState(({open}) => ({
            open: {...open, [name]: !open[name]}
        }));
    };

    onDetailsOpen = (index) => {
        const { items } = this.state;

        this.setState(({open, selected}) => ({
            open: { ...open, details: true, settings: false },
            selected: { ...selected, item: items[index] }
        }));
    };

    onObjectNamesChange = (names) => {
        this.setState(({items, displayedItems}) => ({
            items: items.map((item, index) => {
                item.name = getItemName(index, names);
                return item;
            }),
            displayedItems: displayedItems.map((item, index) => {
                item.name = getItemName(index, names);
                return item;
            })
        }));
    };

    onAttributesMenuOpen = (event) => {
        const currentTarget = event.currentTarget;

        this.setState({
            attributesMenuEl: currentTarget
        });
    };

    onAttributesMenuClose = () => {
        this.setState({
            attributesMenuEl: null
        });
    };

    onSnackbarOpen = (exception) => {
        if (exception.constructor.name !== "AlertError") {
            console.error(exception);
            return;
        }

        if (this._isMounted) {
            this.setState({
                alertProps: exception
            });
        }
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    render() {
        const { loading, data, items, displayedItems, parameters, selected, open, attributesMenuEl, alertProps } = this.state;
        const { project: { id: projectId }, serverBase } = this.props;

        return (
            <CustomBox id={"classification"} variant={"Tab"}>
                <CustomDrawer
                    id={"classification-settings"}
                    open={open.settings}
                    onClose={() => this.toggleOpen("settings")}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfClassifierSelector
                        TextFieldProps={{
                            onChange: this.onClassifierTypeChange,
                            value: parameters.typeOfClassifier
                        }}
                    />
                    <DefaultClassificationResultSelector
                        TextFieldProps={{
                            onChange: this.onDefaultClassificationResultChange,
                            value: parameters.defaultClassificationResult
                        }}
                    />
                </CustomDrawer>
                <CustomBox customScrollbar={true} id={"classification-content"} variant={"TabBody"}>
                    <CustomHeader id={"classification-header"} paperRef={this.upperBar}>
                        <SettingsButton onClick={() => this.toggleOpen("settings")} />
                        <StyledDivider margin={16} />
                        <CustomButtonGroup
                            onActionSelected={this.onClassifyActionChange}
                            options={["Classify current data", "Choose new data & classify"]}
                            selected={selected.action}
                            tooltips={"Click on settings button on the left to customize parameters"}
                            WrapperProps={{
                                id: "classification-split-button"
                            }}
                        >
                            <CalculateButton
                                aria-label={"classify-current-file"}
                                disabled={loading}
                                onClick={this.onClassifyData}
                            >
                                Classify current data
                            </CalculateButton>
                            <CustomUpload
                                accept={".json,.csv"}
                                id={"classify-new-file"}
                                onChange={this.onUploadData}
                            >
                                <CalculateButton
                                    aria-label={"classify-new-file"}
                                    disabled={loading}
                                    component={"span"}
                                >
                                    Choose new data & classify
                                </CalculateButton>
                            </CustomUpload>
                        </CustomButtonGroup>
                        <CircleHelper
                            size={"smaller"}
                            title={"Attributes are taken from DATA."}
                            TooltipProps={{ placement: "bottom"}}
                            WrapperProps={{ style: { marginLeft: 16 }}}
                        />
                        {data &&
                            <React.Fragment>
                                <StyledDivider margin={16} />
                                <MatrixButton
                                    onClick={() => this.toggleOpen("matrix")}
                                    title={"Show ordinal misclassification matrix and it's details"}
                                />
                            </React.Fragment>
                        }
                        <span style={{flexGrow: 1}} />
                        <FilterTextField onChange={this.onFilterChange} />
                    </CustomHeader>
                    <TabBody
                        content={parseClassifiedListItems(displayedItems)}
                        id={"classification-list"}
                        isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                        isLoading={loading}
                        ListProps={{
                            onItemSelected: this.onDetailsOpen
                        }}
                        ListSubheaderProps={{
                            onSettingsClick: this.onAttributesMenuOpen,
                            style: this.upperBar.current ? { top: this.upperBar.current.offsetHeight } : undefined
                        }}
                        noFilterResults={!displayedItems}
                        subheaderContent={[
                            {
                                label: "Number of objects:",
                                value: displayedItems && displayedItems.length,
                            }
                        ]}
                    />
                    {selected.item != null &&
                        <ClassifiedObjectDialog
                            disableAttributesMenu={false}
                            item={selected.item}
                            onClose={() => this.toggleOpen("details")}
                            onSnackbarOpen={this.onSnackbarOpen}
                            open={open.details}
                            projectId={projectId}
                            resource={"classification"}
                            serverBase={serverBase}
                        />
                    }
                    {Array.isArray(items) && items.length > 0 &&
                        <MatrixDialog
                            onClose={() => this.toggleOpen("matrix")}
                            onSnackbarOpen={this.onSnackbarOpen}
                            open={open.matrix}
                            projectId={projectId}
                            resource={"classification"}
                            saveMatrix={this.onSaveToFile}
                            serverBase={serverBase}
                            title={
                                <React.Fragment>
                                    <MatrixDownloadButton
                                        onSave={this.onSaveToFile}
                                        tooltip={"Download matrix (txt)"}
                                    />
                                    <span aria-label={"matrix title"} style={{paddingLeft: 8}}>
                                        Ordinal misclassification matrix and details
                                    </span>
                                </React.Fragment>
                            }
                        />
                    }
                    <AttributesMenu
                        ListProps={{
                            id: "classification-main-desc-attributes-menu"
                        }}
                        MuiMenuProps={{
                            anchorEl: attributesMenuEl,
                            onClose: this.onAttributesMenuClose
                        }}
                        onObjectNamesChange={this.onObjectNamesChange}
                        onSnackbarOpen={this.onSnackbarOpen}
                        projectId={projectId}
                        resource={"classification"}
                        serverBase={serverBase}
                    />
                    <CSVDialog onConfirm={this.onCSVDialogClose} open={open.csv} />
                </CustomBox>
                <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />
            </CustomBox>
        )
    }
}

Classification.propTypes = {
    onDataUploaded: PropTypes.func,
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    showAlert: PropTypes.func,
    value: PropTypes.number
};

export default Classification;
