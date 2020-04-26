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
import { createCategories, simpleSort, SortButton, SortMenu } from "../../../RuleWorkComponents/Inputs/SortMenu";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
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
            externalRules: false,
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
        const { project } = this.props;

        fetchRules(
            project.result.id, "GET", null
        ).then(result => {
            if (result && this._isMounted) {
                const { project: { parametersSaved, sortParams } } = this.props;

                const items = parseRulesItems(result);
                const resultParameters = parseRulesParams(result);

                this.setState(({parameters, sort}) => ({
                    data: result,
                    items: items,
                    displayedItems: items,
                    externalRules: result.externalRules,
                    parameters: { ...parameters, ...resultParameters},
                    parametersSaved: parametersSaved,
                    sort: { ...sort, ...sortParams.rules }
                }));
            }
        }).catch(error => {
            console.log(error);
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
                const { displayedItems, parametersSaved } = this.state;
                const { project: { parameters: {
                    consistencyThreshold,
                    typeOfRules,
                    typeOfUnions
                }}} = this.props;


                this.setState(({parameters}) => ({
                    loading: false,
                    parameters: parametersSaved ?
                        parameters : { ...parameters, ...{ consistencyThreshold, typeOfRules, typeOfUnions } },
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
        let project = {...this.props.project};

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

    onSaveRulesToXMLClick = () => {
        const { project } = this.props;
        let data = { format: "xml" };

        downloadRules( project.result.id, data ).catch(error => {
            if (this._isMounted) {
                this.setState({alertProps: error});
            }
        });
    };

    onSaveRulesToTXTClick = () => {
        const { project } = this.props;
        let data = { format: "txt" };

        downloadRules( project.result.id, data ).catch(error => {
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
        const { loading } = this.state;

        if (!loading) {
            const { items, sort: { order, value } } = this.state;
            const filteredItems = filterFunction(event.target.value.toString(), items.slice());

            if ( order && value ) {
                this.onSortChange(filteredItems);
            } else {
                this.setState({
                    displayedItems: filteredItems
                });
            }
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
        const { loading, data, displayedItems, parameters, selectedItem, open, sort, alertProps } = this.state;
        const { project: { result, settings } } = this.props;

        return (
            <RuleWorkBox id={"rule-work-rules"} styleVariant={"tab"}>
                <StyledPaper id={"rules-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"rules-settings-button"}
                        onClick={() => this.toggleOpen("settings")}
                        title={"Click to choose consistency threshold, type of unions & rules"}
                    />
                    <StyledDivider margin={16} />
                    <RuleWorkTooltip
                        title={`Calculate with consistency threshold ${parameters.consistencyThreshold}`}
                    >
                        <CalculateButton
                            aria-label={"rules-calculate-button"}
                            disabled={loading}
                            onClick={this.onCalculateClick}
                        />
                    </RuleWorkTooltip>
                    <StyledDivider margin={16} />
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
                    <StyledDivider margin={16} />
                    <RuleWorkTooltip title={"Save rules to RuleML"}>
                        <StyledButton
                            aria-label={"rules-save-to-xml-button"}
                            disabled={!Boolean(data) || loading}
                            isIcon={true}
                            onClick={this.onSaveRulesToXMLClick}
                            themeVariant={"primary"}
                        >
                            <SaveIcon />
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider margin={16} />
                    <RuleWorkTooltip title={"Save rules to TXT"}>
                        <StyledButton
                            aria-label={"rules-save-to-txt-button"}
                            disabled={!Boolean(data) || loading}
                            isIcon={true}
                            onClick={this.onSaveRulesToTXTClick}
                            themeVariant={"primary"}
                        >
                            <SvgIcon><path d={mdiTextBox} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <SortButton
                        ButtonProps={{
                            "aria-controls": "rules-sort-menu",
                            "aria-haspopup": true,
                            "aria-label": "sort rules",
                            disabled: !Boolean(data),
                            onClick: this.onSortMenuOpen
                        }}
                        tooltip={Boolean(data) ? "Sort rules" : "No content to sort"}
                        TooltipProps={{
                            WrapperProps: { style: { marginRight: "0.5rem" } }
                        }}
                    />
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkDrawer
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
                </RuleWorkDrawer>
                {data !== null &&
                    <SortMenu
                        anchorE1={sort.anchorE1}
                        ContentProps={{
                            categories: createCategories(Object.keys(displayedItems[0].traits)),
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