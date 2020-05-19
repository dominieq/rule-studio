import React, {Component} from 'react';
import PropTypes from "prop-types";
import { createFormData, downloadRules, fetchRules, parseRulesParams, uploadRules } from "../Utils/fetchFunctions";
import { parseRulesItems, parseRulesListItems } from "../Utils/parseData";
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
import { RulesDialog } from "../../../Utils/Feedback/DetailsDialog";
import StyledAlert from "../../../Utils/Feedback/StyledAlert";
import { createCategories, simpleSort, SortButton, SortMenu } from "../../../Utils/Inputs/SortMenu";
import CustomUpload from "../../../Utils/Inputs/CustomUpload";
import StyledButton from "../../../Utils/Inputs/StyledButton";
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";
import SvgIcon from "@material-ui/core/SvgIcon";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import { mdiTextBox } from '@mdi/js';


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
                value: ""
            },
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    getRules = () => {
        const { project, serverBase } = this.props;

        fetchRules(
            serverBase, project.result.id, "GET", null
        ).then(result => {
            if (result && this._isMounted) {
                const items = parseRulesItems(result);
                const resultParameters = parseRulesParams(result);

                let alertProps = undefined;
                if (result.hasOwnProperty("errorMessage")) {
                    alertProps = { message: result.errorMessage, open: true, severity: "error" };
                }

                this.setState(({parameters}) => ({
                    data: result,
                    items: items,
                    displayedItems: items,
                    parameters: { ...parameters, ...resultParameters},
                    alertProps: alertProps
                }));

                if (result.hasOwnProperty("isCurrentData")) {
                    this.props.showAlert(this.props.value, !result.isCurrentData);
                }

                if (result.hasOwnProperty("externalRules")) {
                    this.props.onRulesUploaded(result.externalRules);
                }

                if (result.hasOwnProperty("validateCurrentData")) {
                    this.updateAlerts(result.validateCurrentData, null);
                }
            }
        }).catch(error => {
            if (!error.hasOwnProperty("open")) {
                console.log(error);
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

    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getRules);
    }

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

        if (prevProps.project.result.id !== this.props.project.result.id) {
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

    onCalculateClick = () => {
        const { project, serverBase } = this.props;
        const { parameters } = this.state;

        this.setState({
            loading: true,
        }, () => {
            let method = "PUT";
            let data = createFormData(parameters, null);

            fetchRules(
                serverBase, project.result.id, method, data
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
                            parametersSaved: true,
                            alertProps: alertProps
                        });
                    }

                    let projectCopy = JSON.parse(JSON.stringify(project));
                    projectCopy.result.rules = result;

                    const newParameters = parseRulesParams(result);
                    projectCopy.parameters = {
                        ...projectCopy.parameters,
                        consistencyThreshold: newParameters.consistencyThreshold,
                        typeOfRules: newParameters.typeOfRules
                    };
                    projectCopy.parametersSaved = true;

                    if (result.hasOwnProperty("isCurrentData")) {
                        this.props.showAlert(this.props.value, !result.isCurrentData);
                    }

                    if (result.hasOwnProperty("externalRules")) {
                        this.props.onRulesUploaded(result.externalRules);
                    }

                    if (result.hasOwnProperty("validateCurrentData")) {
                        this.updateAlerts(result.validateCurrentData, projectCopy);
                    }

                    this.props.onTabChange(projectCopy);
                }
            }).catch(error => {
                if (!error.hasOwnProperty("open")) {
                    console.log(error);
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

    onUploadFileChanged = (event) => {
        if (event.target.files[0]) {
            const { project, serverBase } = this.props;

            let method = "PUT";
            let files = { rules: event.target.files[0] }

            let data = createFormData(null, files);

            this.setState({
                loading: true,
            }, () => {
                uploadRules(
                    serverBase, project.result.id, method, data
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
                        let projectCopy = JSON.parse(JSON.stringify(project));
                        projectCopy.result.rules = result;

                        if (result.hasOwnProperty("isCurrentData")) {
                            this.props.showAlert(this.props.value, !result.isCurrentData);
                        }

                        if (result.hasOwnProperty("externalRules")) {
                            this.props.onRulesUploaded(result.externalRules);
                        }

                        if (result.hasOwnProperty("validateCurrentData")) {
                            this.updateAlerts(result.validateCurrentData, projectCopy);
                        }

                        this.props.onTabChange(projectCopy);
                    }
                }).catch(error => {
                    if (!error.hasOwnProperty("open")) {
                        console.log(error);
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

    updateAlerts = (validateCurrentData, project) => {
        if (validateCurrentData.classification !== null) {
            if (validateCurrentData.classification.hasOwnProperty("isCurrentLearningData")) {
                const isCurrentLearningData = validateCurrentData.classification.isCurrentLearningData;

                if (project !== null && project.result.classification !== null) {
                    project.result.classification.isCurrentLearningData = isCurrentLearningData;
                }

                if (validateCurrentData.classification.hasOwnProperty("isCurrentRuleSet")) {
                    const isCurrentRuleSet = validateCurrentData.classification.isCurrentRuleSet;

                    if (project !== null && project.result.classification !== null) {
                        project.result.classification.isCurrentRuleSet = isCurrentRuleSet;
                    }

                    this.props.showAlert(this.props.value + 1, !(isCurrentLearningData && isCurrentRuleSet));
                } else {
                    this.props.showAlert(this.props.value + 1, !isCurrentLearningData);
                }
            }

            if (validateCurrentData.classification.hasOwnProperty("externalData")) {
                if (project !== null && project.result.classification !== null) {
                    project.result.classification.externalData = validateCurrentData.classification.externalData;
                }

                this.props.onDataUploaded(validateCurrentData.classification.externalData);
            }
        }

        if (validateCurrentData.unions !== null) {
            if (validateCurrentData.unions.hasOwnProperty("isCurrentData")) {
                if (project !== null && project.result.unions !== null) {
                    project.result.unions.isCurrentData = validateCurrentData.unions.isCurrentData;
                }

                this.props.showAlert(this.props.value - 1, !validateCurrentData.unions.isCurrentData);
            }
        }
    };

    onSaveRulesToXMLClick = () => {
        const { project, serverBase } = this.props;
        let data = { format: "xml" };

        downloadRules(serverBase, project.result.id, data).catch(error => {
            if (!error.hasOwnProperty("open")) {
                console.log(error);
            }
            if (this._isMounted) {
                this.setState({alertProps: error});
            }
        });
    };

    onSaveRulesToTXTClick = () => {
        const { project, serverBase } = this.props;
        let data = { format: "txt" };

        downloadRules(serverBase, project.result.id, data).catch(error => {
            if (!error.hasOwnProperty("open")) {
                console.log(error);
            }
            if (this._isMounted) {
                this.setState({ alertProps: error });
            }
        });
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

    onSortChange = (items) => {
        if (items) {
            const { items: originalItems, sort: { order, value } } = this.state;

            if (order && value) {
                let newItems = items.map(item => item.toSort(value));
                newItems = simpleSort(newItems, value, order);
                newItems = newItems.map(item => originalItems[item.id]);

                this.setState({ displayedItems: newItems });
            } else {
                const { items: originalItems } = this.state;

                this.setState({
                    displayedItems: Boolean(originalItems) ? originalItems : []
                });
            }
        } else {
            this.setState({
                displayedItems: null
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
        const { loading, items, displayedItems, parameters, selectedItem, open, sort, alertProps } = this.state;
        const { project: { result, settings } } = this.props;

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
                                <StyledButton
                                    aria-label={"rules-upload-button"}
                                    disabled={loading}
                                    isIcon={true}
                                    component={"span"}
                                    themeVariant={"primary"}
                                >
                                    <CloudUploadIcon />
                                </StyledButton>
                            </CustomUpload>
                        </CustomTooltip>
                        <StyledDivider margin={16} />
                        <CustomTooltip title={"Save rules to RuleML"}>
                            <StyledButton
                                aria-label={"rules-save-to-xml-button"}
                                disabled={!resultsExists || loading}
                                isIcon={true}
                                onClick={this.onSaveRulesToXMLClick}
                                themeVariant={"primary"}
                            >
                                <SaveIcon />
                            </StyledButton>
                        </CustomTooltip>
                        <StyledDivider margin={16} />
                        <CustomTooltip title={"Save rules to TXT"}>
                            <StyledButton
                                aria-label={"rules-save-to-txt-button"}
                                disabled={!resultsExists || loading}
                                isIcon={true}
                                onClick={this.onSaveRulesToTXTClick}
                                themeVariant={"primary"}
                            >
                                <SvgIcon><path d={mdiTextBox} /></SvgIcon>
                            </StyledButton>
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
                            invisible={sort.value === "" && sort.order === "asc"}
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
                                    Object.keys(items[0].traits).filter(value => value !== "Type")
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
                            disableHelper: false,
                            helper: "First row of each rule presents decision condition. " +
                                "Next rows present subsequent elementary conditions. " +
                                "These elementary conditions are connected by AND. " +
                                "Last row shows chosen rule’s characteristics.",
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
                            onClose={() => this.toggleOpen("details")}
                            open={open.details}
                            projectResult={result}
                            settings={settings}
                        />
                    }
                </CustomBox>
                <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />
            </CustomBox>

        )
    }
}

Rules.propTypes = {
    onDataUploaded: PropTypes.func,
    onRulesUploaded: PropTypes.func,
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    showAlert: PropTypes.func,
    value: PropTypes.number
};

export default Rules;