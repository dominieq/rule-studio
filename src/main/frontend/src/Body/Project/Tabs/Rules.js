import React, {Component} from 'react';
import PropTypes from "prop-types";
import { downloadRules, fetchRules } from "../../../Utils/utilFunctions/fetchFunctions";
import { parseFormData } from "../../../Utils/utilFunctions/fetchFunctions/parseFormData";
import { parseRulesItems } from  "../../../Utils/utilFunctions/parseItems";
import { parseRulesListItems } from "../../../Utils/utilFunctions/parseListItems";
import { parseRulesParams } from "../../../Utils/utilFunctions/parseParams";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import TypeOfRulesSelector from "../Utils/Calculations/TypeOfRulesSelector";
import CustomBox from "../../../Utils/Containers/CustomBox";
import CustomDrawer from "../../../Utils/Containers/CustomDrawer"
import StyledDivider from "../../../Utils/DataDisplay/StyledDivider";
import CustomTooltip from "../../../Utils/DataDisplay/CustomTooltip";
import CircleHelper from "../../../Utils/Feedback/CircleHelper";
import { RulesDialog } from "../../../Utils/Feedback/DetailsDialog";
import StyledAlert from "../../../Utils/Feedback/StyledAlert";
import { createCategories, simpleSort, SortButton, SortMenu } from "../../../Utils/Inputs/SortMenu";
import CustomUpload from "../../../Utils/Inputs/CustomUpload";
import { StyledIconButton } from "../../../Utils/Inputs/StyledButton";
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";
import SvgIcon from "@material-ui/core/SvgIcon";
import FileUpload from "mdi-material-ui/FileUpload";
import SaveIcon from "@material-ui/icons/Save";
import { mdiTextBox } from '@mdi/js';

/**
 * The rules tab in RuLeStudio.
 * Presents the list of all rules generated for information table from current project.
 *
 * @class
 * @category Tabs
 * @subcategory Tabs
 * @param {Object} props
 * @param {string} props.objectGlobalName - The global visible object name used by all tabs as reference.
 * @param {function} props.onDataUploaded - Callback fired when tab receives information that new data was uploaded.
 * @param {function} props.onRulesUploaded - Callback fired when tab receives information that rule set was uploaded.
 * @param {function} props.onTabChange - Callback fired when a tab is changed and there are unsaved changes in this tab.
 * @param {Object} props.project - Current project.
 * @param {string} props.serverBase - The host and port in the URL of an API call.
 * @param {function} props.showAlert - Callback fired when results in this tab are based on outdated information table.
 * @param {number} props.value - The index of a selected tab.
 * @returns {React.Component}
 */
class Rules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
            items: null,
            displayedItems: [],
            parameters: {
                consistencyThreshold: 0,
                typeOfRules: "certain",
                typeOfUnions: "monotonic"
            },
            selectedItem: null,
            open: {
                details: false,
                settings: false,
            },
            sort: {
                anchorE1: null,
                order: "asc",
                value: "id"
            },
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    /**
     * Makes an API call on rules to receive current copy of rule set from server.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf Rules
     */
    getRules = () => {
        const { project, serverBase } = this.props;
        const pathParams = { projectId: project.id };
        const method = "GET";

        fetchRules(
            pathParams, method, null, serverBase
        ).then(result => {
            if (result && this._isMounted) {
                const items = parseRulesItems(result);
                const resultParameters = result.hasOwnProperty("parameters") ?
                    parseRulesParams(result.parameters) : { };

                this.setState(({parameters, alertProps}) => ({
                    data: result,
                    items: items,
                    displayedItems: items,
                    parameters: { ...parameters, ...resultParameters},
                    alertProps: result.hasOwnProperty("errorMessage") ?
                        { message: result.errorMessage, open: true, severity: "error" } : alertProps
                }));

                if (result.hasOwnProperty("isCurrentData")) {
                    const messages = result.hasOwnProperty("errorMessages") ?
                        result.errorMessages : null;
                    this.props.showAlert(this.props.value, !result.isCurrentData, messages);
                }

                if (result.hasOwnProperty("externalRules")) {
                    this.props.onRulesUploaded(result.externalRules);
                }

                if (result.hasOwnProperty("validityRulesContainer")) {
                    this.updateAlerts(result.validityRulesContainer);
                }
            }
        }).catch(exception => {
            this.onSnackbarOpen(exception, () => {
                if (this._isMounted) {
                    this.setState({
                        data: null,
                        items: null,
                        displayedItems: []
                    });
                }
            });
        }).finally(() => {
            if (this._isMounted) {
                const { displayedItems } = this.state;
                const { project: { parameters, parametersSaved, sortParams }} = this.props;
                const { consistencyThreshold, typeOfRules, typeOfUnions } = parameters;

                this.setState(({parameters, sort}) => ({
                    loading: false,
                    parameters: parametersSaved ?
                        parameters : { ...parameters, ...{ consistencyThreshold, typeOfRules, typeOfUnions } },
                    parametersSaved: parametersSaved,
                    sort: { ...sort, ...sortParams.rules },
                    selectedItem: null
                }), () => this.onSortChange(displayedItems));
            }
        });
    };

    /**
     * A component's lifecycle method. Fired once when component was mounted.
     * <br>
     * <br>
     * Method calls {@link getRules}.
     *
     * @function
     * @memberOf Rules
     */
    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getRules);
    }

    /**
     * A component's lifecycle method. Fired after a component was updated.
     * <br>
     * <br>
     * If type of unions was changed to <code>monotonic</code> and consistency threshold is equal to 1,
     * method changes value of threshold to 0.
     * <br>
     * <br>
     * If type of rules was changed to <code>possible</code>, method changes consistency threshold to 0.
     * <br>
     * <br>
     * If project was changed, method saves changes from previous project
     * and calls {@link getRules} to receive the latest copy of rule set.
     *
     * @function
     * @memberOf Rules
     * @param {Object} prevProps - Old props that were already replaced.
     * @param {Object} prevState - Old state that was already replaced.
     * @param {Object} snapshot - Returned from another lifecycle method <code>getSnapshotBeforeUpdate</code>. Usually undefined.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { parameters: prevParameters } = prevState;
        const { parameters } = this.state;

        if (parameters.typeOfUnions !== 'monotonic') {
            if (parameters.consistencyThreshold === 1) {
                this.setState(({parameters}) => ({
                    parameters: { ...parameters, consistencyThreshold: 0, typeOfUnions: "monotonic" }
                }));
            } else {
                this.setState(({parameters}) => ({
                    parameters: { ...parameters, typeOfUnions: "monotonic" }
                }));
            }
        }

        if  (parameters.typeOfRules !== prevParameters.typeOfRules && parameters.typeOfRules === "possible") {
            this.setState(({parameters}) => ({
                parameters: { ...parameters, consistencyThreshold: 0 }
            }));
        }

        if (prevProps.project.id !== this.props.project.id) {
            const { parametersSaved, sort: { order, value } } = prevState;
            let project = { ...prevProps.project };

            project.sortParams.rules = { ...project.sortParams.rules, ...{ order, value } };

            if (!parametersSaved) {
                const { parameters } = prevState;

                project.parameters = {
                    ...project.parameters,
                    consistencyThreshold: parameters.consistencyThreshold,
                    typeOfRules: parameters.typeOfRules
                };
                project.parametersSaved = parametersSaved;
            }

            this.props.onTabChange(project);

            this.setState({ loading: true }, this.getRules);
        }
    }

    /**
     * A component's lifecycle method. Fired when component was requested to be unmounted.
     * <br>
     * <br>
     * Method saves changes from current project.
     *
     * @function
     * @memberOf Rules
     */
    componentWillUnmount() {
        this._isMounted = false;
        const { parametersSaved , sort: { order, value } } = this.state;
        let project = JSON.parse(JSON.stringify(this.props.project));

        project.sortParams.rules = { ...project.sortParams.rules, ...{ order, value } };

        if ( !parametersSaved ) {
            const { parameters } = this.state;

            project.parameters = {
                ...project.parameters,
                consistencyThreshold: parameters.consistencyThreshold,
                typeOfRules: parameters.typeOfRules
            };
            project.parametersSaved = parametersSaved;
        }

        this.props.onTabChange(project);
    }

    /**
     * Makes an API call on rules to generate new rule set from current information table and parameters.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf Rules
     */
    onCalculateClick = () => {
        const { project, serverBase } = this.props;
        const { parameters } = this.state;

        this.setState({
            loading: true,
        }, () => {
            const pathParams = { projectId: project.id };
            const method = "PUT";
            const data = parseFormData(parameters, null);

            fetchRules(
                pathParams, method, data, serverBase
            ).then(result => {
                if (result) {
                    if (this._isMounted) {
                        const items = parseRulesItems(result);

                        this.setState(({alertProps}) => ({
                            data: result,
                            items: items,
                            displayedItems: items,
                            parametersSaved: true,
                            alertProps: result.hasOwnProperty("errorMessage") ?
                                { message: result.errorMessage, open: true, severity: "error" } : alertProps
                        }));
                    }

                    let projectCopy = JSON.parse(JSON.stringify(project));

                    const newParameters = result.hasOwnProperty("parameters") ?
                        parseRulesParams(result.parameters) : { };
                    projectCopy.parameters = {
                        ...projectCopy.parameters,
                        consistencyThreshold: newParameters.consistencyThreshold,
                        typeOfRules: newParameters.typeOfRules
                    };
                    projectCopy.parametersSaved = true;

                    if (result.hasOwnProperty("isCurrentData")) {
                        const messages = result.hasOwnProperty("errorMessages") ?
                            result.errorMessages : null;
                        this.props.showAlert(this.props.value, !result.isCurrentData, messages);
                    }

                    if (result.hasOwnProperty("externalRules")) {
                        this.props.onRulesUploaded(result.externalRules);
                    }

                    if (result.hasOwnProperty("validityRulesContainer")) {
                        this.updateAlerts(result.validityRulesContainer);
                    }

                    this.props.onTabChange(projectCopy);
                }
            }).catch(exception => {
                this.onSnackbarOpen(exception, () => {
                    if (this._isMounted) {
                        this.setState({
                            data: null,
                            items: null,
                            displayedItems: []
                        });
                    }
                });
            }).finally(() => {
                const { displayedItems } = this.state;

                if (this._isMounted) {
                    this.setState({
                        loading: false,
                        selectedItem: null
                    }, () => this.onSortChange(displayedItems));
                }
            });
        });
    };

    /**
     * Makes an API call on rules to upload user's rule set.
     * Then, updates states and makes necessary changes in display.
     *
     * @function
     * @memberOf Rules
     * @param {Object} event - Represents an event that takes place in DOM.
     */
    onUploadFileChanged = (event) => {
        if (event.target.files[0]) {
            const { project, serverBase } = this.props;

            const pathParams = { projectId: project.id };
            const method = "PUT";
            const data = parseFormData(null, { rules: event.target.files[0] });

            this.setState({
                loading: true,
            }, () => {
                fetchRules(
                    pathParams, method, data, serverBase, true
                ).then(result => {
                    if (result) {
                        if (this._isMounted) {
                            const items = parseRulesItems(result);

                            let alertProps = undefined;
                            if (result.hasOwnProperty("errorMessage")) {
                                alertProps = { message: result.errorMessage, open: true, severity: "error" };
                            }

                            this.setState({
                                data: result,
                                items: items,
                                displayedItems: items,
                                alertProps: alertProps
                            });
                        }
                        if (result.hasOwnProperty("isCurrentData")) {
                            const messages = result.hasOwnProperty("errorMessages") ?
                                result.errorMessages : null;
                            this.props.showAlert(this.props.value, !result.isCurrentData, messages);
                        }

                        if (result.hasOwnProperty("externalRules")) {
                            this.props.onRulesUploaded(result.externalRules);
                        }

                        if (result.hasOwnProperty("validityRulesContainer")) {
                            this.updateAlerts(result.validityRulesContainer);
                        }
                    }
                }).catch(exception => {
                    this.onSnackbarOpen(exception, () => {
                        if (this._isMounted) {
                            this.setState({
                                data: null,
                                items: null,
                                displayedItems: []
                            });
                        }
                    });
                }).finally(() => {
                    const { displayedItems } = this.state;

                    if (this._isMounted) {
                        this.setState({
                            loading: false,
                            selectedItem: null
                        }, () =>  this.onSortChange(displayedItems));
                    }
                });
            });
        }
    };

    /**
     * Used when changes in {@link Rules} had an impact on results in {@link Unions} or {@link Classification}.
     * Updates classification and unions in current project, makes necessary changes in display.
     *
     * @function
     * @memberOf Rules
     * @param {Object} validityRulesContainer - The part of response from server
     */
    updateAlerts = (validityRulesContainer) => {
        if (validityRulesContainer.classification != null) {
            if (validityRulesContainer.classification.hasOwnProperty("isCurrentData")) {
                const messages = validityRulesContainer.classification.hasOwnProperty("errorMessages") ?
                    validityRulesContainer.classification.errorMessages : null;
                this.props.showAlert(this.props.value + 1, !validityRulesContainer.classification.isCurrentData, messages);
            }

            if (validityRulesContainer.classification.hasOwnProperty("externalData")) {
                this.props.onDataUploaded(validityRulesContainer.classification.externalData);
            }
        }

        if (validityRulesContainer.unions != null) {
            if (validityRulesContainer.unions.hasOwnProperty("isCurrentData")) {
                const messages = validityRulesContainer.unions.hasOwnProperty("errorMessages") ?
                    validityRulesContainer.unions.errorMessages : null;
                this.props.showAlert(this.props.value - 1, !validityRulesContainer.unions.isCurrentData, messages);
            }
        }
    };

    /**
     * Makes an API call to download current rules set in XML format.
     *
     * @function
     * @memberOf Rules
     */
    onSaveRulesToXMLClick = () => {
        const { project, serverBase } = this.props;
        const pathParams = { projectId: project.id };
        const queryParams = { format: "xml" };

        downloadRules(pathParams, queryParams, serverBase)
            .catch(this.onSnackbarOpen);
    };

    /**
     * Makes an API call to download current rule set in TXT format.
     *
     * @function
     * @memberOf Rules
     */
    onSaveRulesToTXTClick = () => {
        const { project, serverBase } = this.props;
        const pathParams = { projectId: project.id };
        const queryParams = { format: "txt" };

        downloadRules(pathParams, queryParams, serverBase)
            .catch(this.onSnackbarOpen);
    };

    toggleOpen = (name) => {
        this.setState(({open}) => ({
            open: {...open, [name]: !open[name]}
        }));
    };

    onDetailsOpen = (index) => {
        const { items } = this.state;

        this.setState(({open}) => ({
            open: {...open, details: true, settings: false},
            selectedItem: items[index]
        }));
    };

    onConsistencyThresholdChange = (threshold) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, consistencyThreshold: threshold},
                parametersSaved: false
            }));
        }
    };

    onTypeOfRulesChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, typeOfRules: event.target.value},
                parametersSaved: false
            }));
        }
    };

    onTypeOfUnionsChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, typeOfUnions: event.target.value},
                parametersSaved: false
            }));
        }
    };

    /**
     * Filters items from {@link Rules}' state and then sorts them if any order was declared.
     * Method uses {@link filterFunction} to filter items.
     *
     * @function
     * @memberOf Rules
     * @param {Object} event - Represents an event that takes place in DOM.
     */
    onFilterChange = (event) => {
        const { loading, items } = this.state;

        if (!loading && Array.isArray(items) && items.length) {
            this.onSortChange(filterFunction(event.target.value.toString(), items.slice()));
        }
    };

    onSortMenuOpen = (event) => {
        const target = event.currentTarget;

        this.setState(({sort}) => ({
            sort: { ...sort, anchorE1: target }
        }));
    };

    onSortMenuClose = () => {
        this.setState(({sort}) => ({
            sort: { ...sort, anchorE1: null }
        }));
    };

    onSortValueChange = (event) => {
        const value = event.target.value;

        this.setState(({sort}) => ({
            sort: { ...sort, value: value }
        }), () => {
            const { displayedItems } = this.state;

            this.onSortChange(displayedItems);
        });
    };

    onSortOrderChange = (event) => {
        const order = event.target.value;

        this.setState(({sort}) => ({
            sort: { ...sort, order: order }
        }), () => {
            const { displayedItems } = this.state;

            this.onSortChange(displayedItems);
        });
    };

    /**
     * Sorts provided items and saves results in {@link Rules}' state.
     * Method uses {@link simpleSort} function to sort items.
     *
     * @function
     * @memberOf Rules
     * @param {Object[]} items - A list of objects that will be sorted.
     */
    onSortChange = (items) => {
        if (items) {
            const { items: originalItems, sort: { order, value } } = this.state;

            let newItems = items.map(item => item.toSort(value));
            newItems = simpleSort(newItems, value, order);
            newItems = newItems.map(item => originalItems[item.id]);

            this.setState({
                displayedItems: newItems
            });
        } else {
            this.setState({
                displayedItems: null
            });
        }
    };

    onSnackbarOpen = (exception, setStateCallback) => {
        if (!(exception.hasOwnProperty("type") && exception.type === "AlertError")) {
            console.error(exception);
            return;
        }

        this.setState({ alertProps: exception }, setStateCallback);
    }

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    render() {
        const { loading, items, displayedItems, parameters, selectedItem, open, sort, alertProps } = this.state;
        const { objectGlobalName, project: { id: projectId }, serverBase } = this.props;

        const resultsExists = Array.isArray(items) && Boolean(items.length);

        return (
            <CustomBox id={"rules"} variant={"Tab"}>
                <CustomDrawer
                    id={"rules-settings"}
                    open={open.settings}
                    onClose={() => this.toggleOpen("settings")}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfRulesSelector
                        TextFieldProps={{
                            onChange: this.onTypeOfRulesChange,
                            value: parameters.typeOfRules
                        }}
                    />
                    <TypeOfUnionsSelector
                        TextFieldProps={{
                            disabledChildren: ["standard"],
                            onChange: this.onTypeOfUnionsChange,
                            value: parameters.typeOfUnions
                        }}
                        variant={"extended"}
                    />
                    <ThresholdSelector
                        keepChanges={parameters.typeOfRules !== 'possible'}
                        onChange={this.onConsistencyThresholdChange}
                        value={parameters.consistencyThreshold}
                        variant={"extended"}
                    />
                </CustomDrawer>
                <CustomBox customScrollbar={true} id={"rules-content"} variant={"TabBody"}>
                    <CustomHeader id={"rules-header"} paperRef={this.upperBar}>
                        <SettingsButton onClick={() => this.toggleOpen("settings")} />
                        <StyledDivider margin={16} />
                        <CustomTooltip
                            disableMaxWidth={true}
                            title={"Click on settings button on the left to customize parameters"}
                        >
                            <CalculateButton
                                aria-label={"rules-calculate-button"}
                                disabled={loading}
                                onClick={this.onCalculateClick}
                            />
                        </CustomTooltip>
                        <StyledDivider margin={16} />
                        <CustomTooltip title={"Upload file"}>
                            <CustomUpload
                                accept={".xml"}
                                disabled={loading}
                                id={"rules-upload-button"}
                                onChange={this.onUploadFileChanged}
                            >
                                <StyledIconButton
                                    aria-label={"rules-upload-button"}
                                    color={"primary"}
                                    component={"span"}
                                    disabled={loading}
                                >
                                    <FileUpload />
                                </StyledIconButton>
                            </CustomUpload>
                        </CustomTooltip>
                        <CircleHelper
                            size={"smaller"}
                            title={"Attributes are taken from DATA."}
                            TooltipProps={{ placement: "bottom" }}
                            WrapperProps={{ style: { marginLeft: 16 }}}
                        />
                        <StyledDivider margin={16} />
                        <CustomTooltip title={"Save rules to RuleML"}>
                            <StyledIconButton
                                aria-label={"rules-save-to-xml-button"}
                                color={"primary"}
                                disabled={!resultsExists || loading}
                                onClick={this.onSaveRulesToXMLClick}
                            >
                                <SaveIcon />
                            </StyledIconButton>
                        </CustomTooltip>
                        <StyledDivider margin={16} />
                        <CustomTooltip title={"Save rules to TXT"}>
                            <StyledIconButton
                                aria-label={"rules-save-to-txt-button"}
                                color={"primary"}
                                disabled={!resultsExists || loading}
                                onClick={this.onSaveRulesToTXTClick}
                            >
                                <SvgIcon><path d={mdiTextBox} /></SvgIcon>
                            </StyledIconButton>
                        </CustomTooltip>
                        <span style={{flexGrow: 1}} />
                        <SortButton
                            ButtonProps={{
                                "aria-controls": "rules-sort-menu",
                                "aria-haspopup": true,
                                "aria-label": "sort rules",
                                disabled: !resultsExists || loading,
                                onClick: this.onSortMenuOpen
                            }}
                            invisible={sort.value === "id" && sort.order === "asc"}
                            tooltip={resultsExists ? "Sort rules" : "No content to sort"}
                            TooltipProps={{
                                WrapperProps: { style: { marginRight: "0.5rem" } }
                            }}
                        />
                        <FilterTextField onChange={this.onFilterChange} />
                    </CustomHeader>
                    {resultsExists &&
                        <SortMenu
                            anchorE1={sort.anchorE1}
                            ContentProps={{
                                categories: createCategories(
                                    Object.keys(items[0].traits).filter(value => value !== "Type"),
                                    "none (default index)",
                                    "id"
                                ),
                                chooseOrder: true,
                                onCategoryChange: this.onSortValueChange,
                                onOrderChange: this.onSortOrderChange,
                                order: sort.order,
                                rowHeight: 28,
                                value: sort.value
                            }}
                            id={"rules-sort-menu"}
                            onClose={this.onSortMenuClose}
                        />
                    }
                    <TabBody
                        content={parseRulesListItems(displayedItems)}
                        id={"rules-list"}
                        isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                        isLoading={loading}
                        ListProps={{
                            onItemSelected: this.onDetailsOpen
                        }}
                        ListSubheaderProps={{
                            disableLeftGutter: true,
                            disableRightGutter: false,
                            helper: (
                                <p aria-label={"helper-text"} style={{margin: 0, textAlign: "justify"}}>
                                    {
                                        "First row of each rule presents decision condition. " +
                                        "Next rows present subsequent elementary conditions. " +
                                        "These elementary conditions are connected by AND. " +
                                        "Last row shows chosen rule’s characteristics."
                                    }
                                </p>
                            ),
                            style: this.upperBar.current ? { top: this.upperBar.current.offsetHeight } : undefined
                        }}
                        noFilterResults={!displayedItems}
                        subheaderContent={[
                            {
                                label: "Number of rules:",
                                value: displayedItems && displayedItems.length
                            }
                        ]}
                    />
                    {selectedItem !== null &&
                        <RulesDialog
                            item={selectedItem}
                            objectGlobalName={objectGlobalName}
                            onClose={() => this.toggleOpen("details")}
                            onSnackbarOpen={this.onSnackbarOpen}
                            open={open.details}
                            projectId={projectId}
                            serverBase={serverBase}
                        />
                    }
                </CustomBox>
                <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />
            </CustomBox>

        )
    }
}

Rules.propTypes = {
    objectGlobalName: PropTypes.string,
    onDataUploaded: PropTypes.func,
    onRulesUploaded: PropTypes.func,
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    showAlert: PropTypes.func,
    value: PropTypes.number
};

export default Rules;
