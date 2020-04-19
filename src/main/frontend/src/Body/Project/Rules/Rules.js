import React, {Component} from 'react';
import PropTypes from "prop-types";
import { downloadRules, fetchRules, parseRulesParams, uploadRules } from "../Utils/fetchFunctions";
import { parseRulesItems, parseRulesListItems } from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import TypeOfRulesSelector from "../Utils/Calculations/TypeOfRulesSelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import { RulesDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog";
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";

class Rules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
            items: null,
            displayedItems: [],
            externalRules: false,
            parameters: {
                consistencyThreshold: 0,
                typeOfRules: "certain",
                typeOfUnions: "monotonic"
            },
            selectedItem: null,
            open: {
                details: false,
                settings: false
            },
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    getRules = () => {
        const { project } = this.props;

        fetchRules(
            project.result.id, "GET", null
        ).then(result => {
            if (result && this._isMounted) {
                const { project: { parametersSaved } } = this.props;

                const items = parseRulesItems(result);
                const resultParameters = parseRulesParams(result);

                this.setState(({parameters}) => ({
                    data: result,
                    items: items,
                    displayedItems: items,
                    externalRules: result.externalRules,
                    parameters: { ...parameters, ...resultParameters},
                    parametersSaved: parametersSaved
                }));
            }
        }).catch(error => {
            if (this._isMounted) {
                this.setState({
                    data: null,
                    items: null,
                    displayedItems: [],
                    selectedItem: null,
                    alertProps: error
                });
            }
        }).finally(() => {
            if (this._isMounted) {
                const { parametersSaved } = this.state;
                const { project: { parameters: {
                    consistencyThreshold,
                    typeOfRules,
                    typeOfUnions
                }}} = this.props;

                this.setState(({parameters}) => ({
                    loading: false,
                    parameters: parametersSaved ?
                        parameters : { ...parameters, ...{ consistencyThreshold, typeOfRules, typeOfUnions } }
                }));
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
            this.setState({ loading: true }, this.getRules);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { parametersSaved } = this.state;

        if ( !parametersSaved ) {
            const { parameters } = this.state;
            let project = {...this.props.project};

            project.parameters = {
                ...project.parameters,
                consistencyThreshold: parameters.consistencyThreshold,
                typeOfRules: parameters.typeOfRules
            };
            project.parametersSaved = parametersSaved;
            this.props.onTabChange(project);
        }
    }

    onCalculateClick = () => {
        let project = {...this.props.project};
        const { parameters } = this.state;

        this.setState({
            loading: true,
        }, () => {
            let method = project.dataUpToDate ? "PUT" : "POST";
            let data = new FormData();

            Object.keys(parameters).map(key => {
                data.append(key, parameters[key]);
            });

            if (!project.dataUpToDate) {
                data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
                data.append("data", JSON.stringify(project.result.informationTable.objects));
            }

            fetchRules(
                project.result.id, method, data
            ).then(result => {
                if (result) {
                    if (this._isMounted) {
                        const items = parseRulesItems(result);

                        this.setState({
                            data: result,
                            items: items,
                            displayedItems: items,
                            externalRules: result.externalRules,
                            parametersSaved: true,
                        });
                    }

                    project.result.rules = result;
                    project.dataUpToDate = true;
                    project.tabsUpToDate[this.props.value] = true;
                    project.externalRules = result.externalRules;

                    const newParameters = parseRulesParams(result);

                    project.parameters = {
                        ...project.parameters,
                        consistencyThreshold: newParameters.consistencyThreshold,
                        typeOfRules: newParameters.typeOfRules
                    };
                    project.parametersSaved = true;
                    this.props.onTabChange(project);
                }
            }).catch(error => {
                if (this._isMounted) {
                    this.setState({alertProps: error});
                }
            }).finally(() => {
                if (this._isMounted) {
                    this.setState({loading: false});
                }
            });
        });
    };

    onUploadFileChanged = (event) => {
        if (event.target.files[0]) {
            let project = {...this.props.project};

            let data = new FormData();
            data.append("rules", event.target.files[0]);

            this.setState({
                loading: true,
            }, () => {
                uploadRules(
                    project.result.id, data
                ).then(result => {
                    if (result) {
                        if (this._isMounted) {
                            const items = parseRulesItems(result.rules);

                            this.setState({
                                data: result,
                                items: items,
                                displayedItems: items,
                                externalRules: result.rules.externalRules,
                            });
                        }

                        project.result.rules = result.rules;
                        project.externalRules = result.rules.externalRules;
                        this.props.onTabChange(project);
                    }
                }).catch(error => {
                    if (this._isMounted) {
                        this.setState({alertProps: error});
                    }
                }).finally(() => {
                    if (this._isMounted) {
                        this.setState({loading: false});
                    }
                });
            });
        }
    };

    onSaveFileClick = () => {
        const { project } = this.props;

        downloadRules( project.result.id ).catch(error => {
            if (this._isMounted) {
                this.setState({alertProps: error});
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
        const { loading } = this.state;

        if (!loading) {
            const { items } = this.state;
            const filteredItems = filterFunction(event.target.value.toString(), items.slice());

            this.setState({
                displayedItems: filteredItems
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
        const { loading, data, displayedItems, parameters, selectedItem, open, alertProps } = this.state;
        const { project: { result, settings } } = this.props;

        return (
            <RuleWorkBox id={"rule-work-rules"} styleVariant={"tab"}>
                <StyledPaper id={"rules-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"rules-settings-button"}
                        onClick={() => this.toggleOpen("settings")}
                        title={"Click to choose consistency threshold, type of unions & rules"}
                    />
                    <StyledDivider />
                    <RuleWorkTooltip
                        title={`Calculate with consistency threshold ${parameters.consistencyThreshold}`}
                    >
                        <CalculateButton
                            aria-label={"rules-calculate-button"}
                            disabled={loading}
                            onClick={this.onCalculateClick}
                        />
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={"Upload file"}>
                        <RuleWorkUpload
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
                        </RuleWorkUpload>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={"Save file"}>
                        <StyledButton
                            aria-label={"rules-save-button"}
                            disabled={!Boolean(data) || loading}
                            isIcon={true}
                            onClick={this.onSaveFileClick}
                            themeVariant={"primary"}
                        >
                            <SaveIcon />
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkDrawer
                    id={"rules-settings"}
                    open={open.settings}
                    onClose={() => this.toggleOpen("settings")}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfRulesSelector
                        id={"rules-rule-type-selector"}
                        onChange={this.onTypeOfRulesChange}
                        value={parameters.typeOfRules}
                    />
                    <TypeOfUnionsSelector
                        disabledChildren={["standard"]}
                        id={"rules-union-type-selector"}
                        onChange={this.onTypeOfUnionsChange}
                        value={parameters.typeOfUnions}
                        variant={"extended"}
                    />
                    <ThresholdSelector
                        id={"rules-threshold-selector"}
                        keepChanges={parameters.typeOfRules !== 'possible'}
                        onChange={this.onConsistencyThresholdChange}
                        value={parameters.consistencyThreshold}
                        variant={"extended"}
                    />
                </RuleWorkDrawer>
                <TabBody
                    content={parseRulesListItems(displayedItems)}
                    id={"rules-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onDetailsOpen
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Number of rules:",
                            value: displayedItems && displayedItems.length
                        }
                    ]}
                />
                {selectedItem &&
                    <RulesDialog
                        item={selectedItem}
                        onClose={() => this.toggleOpen("details")}
                        open={open.details}
                        projectResult={result}
                        settings={settings}
                    />
                }
                <RuleWorkAlert {...alertProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        )
    }
}

Rules.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    value: PropTypes.number,
};

export default Rules;