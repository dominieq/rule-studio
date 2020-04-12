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

    componentDidMount() {
        this._isMounted = true;
        const { project } = this.props;

        this.setState({
            loading: true,
        }, () => {
            fetchRules(
                project.result.id, "GET", null, 404
            ).then(result => {
                if (result && this._isMounted) {
                    const { project: { externalRules, parametersSaved } } = this.props;

                    const items = parseRulesItems(result);
                    const resultParameters = parseRulesParams(result);

                    this.setState(({parameters}) => ({
                        data: result,
                        items: items,
                        displayedItems: items,
                        externalRules: externalRules,
                        parameters: { ...parameters, ...resultParameters},
                        parametersSaved: parametersSaved
                    }));
                }
            }).catch(error => {
                if (this._isMounted) {
                    this.setState({alertProps: error});
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
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { parametersSaved } = this.state;

        if ( !parametersSaved ) {
            const { parameters } = this.state;
            let project = {...this.props.project};

            project.parameters = { ...project.parameters, ...parameters };
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
                            externalRules: false,
                            data: result,
                            items: items,
                            displayedItems: items,
                            parametersSaved: true,
                        });
                    }

                    project.result.rules = result;
                    project.dataUpToDate = true;

                    let nand = !(project.result.classification && project.externalRules);
                    project.tabsUpToDate[this.props.value] = true;
                    project.tabsUpToDate[this.props.value + 1] = project.tabsUpToDate[this.props.value + 1] && nand;

                    project.externalRules = false;

                    const newParameters = parseRulesParams(result);

                    project.parameters = { ...project.parameters, ...newParameters };
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
                                externalRules: true,
                            });
                        }

                        project.result.rules = result.rules;
                        project.externalRules = true;
                        project.tabsUpToDate[this.props.value] = null;
                        project.tabsUpToDate[this.props.value + 1] = !project.result.classification;
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
        this.setState(({parameters}) => ({
            parameters: {...parameters, consistencyThreshold: threshold},
            parametersSaved: false
        }));
    };

    onTypeOfRulesChange = (event) => {
        this.setState(({parameters}) => ({
            parameters: {...parameters, typeOfRules: event.target.value},
            parametersSaved: false
        }));
    };

    onTypeOfUnionsChange = (event) => {
        this.setState(({parameters}) => ({
            parameters: {...parameters, typeOfUnions: event.target.value},
            parametersSaved: false
        }));
    };

    onFilterChange = (event) => {
        const { items } = this.state;
        const filteredItems = filterFunction(event.target.value.toString(), items.slice());

        this.setState({
            displayedItems: filteredItems
        });
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
                        id={"rules-union-type-selector"}
                        onChange={this.onTypeOfUnionsChange}
                        value={parameters.typeOfUnions}
                    />
                    <ThresholdSelector
                        id={"rules-threshold-selector"}
                        onChange={this.onConsistencyThresholdChange}
                        value={parameters.consistencyThreshold}
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
                            label: "Number of rules",
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