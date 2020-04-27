import React, {Component} from "react";
import PropTypes from "prop-types";
import { fetchUnions } from "../Utils/fetchFunctions";
import { parseUnionsItems, parseUnionsListItems } from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import { UnionsDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog";
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

class Unions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
            items: null,
            displayedItems: [],
            parameters: {
                consistencyThreshold: 0,
                typeOfUnions: "monotonic"
            },
            parametersSaved: true,
            selectedItem: null,
            open: {
                details: false,
                settings: false
            },
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    getUnions = () => {
        const { project } = this.props;

        fetchUnions(
            project.result.id, "GET", null
        ).then(result => {
            if (this._isMounted && result) {
                const items = parseUnionsItems(result);
                const { project: { parametersSaved } } = this.props;

                this.setState({
                    data: result,
                    items: items,
                    displayedItems: items,
                    parameters: {
                        consistencyThreshold: result.consistencyThreshold,
                        typeOfUnions: result.typeOfUnions.toLowerCase()
                    },
                    parametersSaved: parametersSaved
                });
            }
        }).catch(error => {
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
                const { parametersSaved } = this.state;
                const { project: { parameters: { consistencyThreshold, typeOfUnions } } } = this.props;

                this.setState(({parameters}) => ({
                    loading: false,
                    parameters: parametersSaved ?
                        parameters : { ...parameters, ...{ consistencyThreshold, typeOfUnions } },
                    selectedItems: null
                }));
            }
        });
    };

    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getUnions);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { parameters: prevParameters } = prevState;
        const { parameters } = this.state;

        if ( prevParameters.typeOfUnions !== parameters.typeOfUnions) {
            if ( parameters.typeOfUnions === "monotonic" && parameters.consistencyThreshold === 1) {
                this.setState(({parameters}) => ({
                    parameters: { ...parameters, consistencyThreshold: 0}
                }));
            } else if ( parameters.typeOfUnions === "standard" && parameters.consistencyThreshold === 0) {
                this.setState(({parameters}) => ({
                    parameters: { ...parameters, consistencyThreshold: 1}
                }));
            }
        }

        if (prevProps.project.result.id !== this.props.project.result.id) {
            const { parametersSaved } = prevState;

            if (!parametersSaved) {
                const { parameters } = prevState;
                let project = { ...prevProps.project };

                project.parameters = { ...project.parameters, ...parameters };
                project.parametersSaved = parametersSaved;
                this.props.onTabChange(project);
            }

            this.setState({ loading: true }, this.getUnions);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { parametersSaved } = this.state;

        if (!parametersSaved) {
            const { parameters } = this.state;
            let project = {...this.props.project};

            project.parameters = { ...project.parameters, ...parameters }
            project.parametersSaved = parametersSaved;
            this.props.onTabChange(project);
        }
    }

    onCountUnionsClick = () => {
        let project = {...this.props.project};
        const { parameters: { consistencyThreshold, typeOfUnions } } = this.state;

        this.setState({
            loading: true,
        }, () => {
            let method = project.dataUpToDate ? "PUT" : "POST";
            let data = new FormData();

            if ( !project.dataUpToDate ) {
                data.append("typeOfUnions", typeOfUnions)
                data.append("consistencyThreshold", consistencyThreshold)
                data.append("metadata", JSON.stringify(project.result.informationTable.attributes))
                data.append("data", JSON.stringify(project.result.informationTable.objects));
            } else {
                data = {
                    consistencyThreshold: consistencyThreshold,
                    typeOfUnions: typeOfUnions
                };
            }

            fetchUnions(
                project.result.id, method, data
            ).then(result => {
                if (result) {
                    if (this._isMounted) {
                        const items = parseUnionsItems(result);

                        this.setState({
                            data: result,
                            items: items,
                            displayedItems: items,
                            parameters: {
                                consistencyThreshold: result.consistencyThreshold,
                                typeOfUnions: result.typeOfUnions.toLowerCase()
                            },
                            parametersSaved: true,
                        });
                    }

                    project.result.unions = result;
                    project.dataUpToDate = true;
                    project.tabsUpToDate[this.props.value] = true;
                    project.parameters.consistencyThreshold = result.consistencyThreshold;
                    project.parameters.typeOfUnions = result.typeOfUnions.toLowerCase();
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

    toggleOpen = (name) => {
        this.setState(({open}) => ({
            open: {...open, [name]: !open[name]}
        }));
    };

    onDetailsOpen = (index) => {
        const { items } = this.state;

        this.setState(({open}) => ({
            open: {...open, details: true, settings: false},
            selectedItem: items[index],
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
                items: items,
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
            <RuleWorkBox id={"rule-work-unions"} styleVariant={"tab"}>
                <StyledPaper id={"unions-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"unions-settings-button"}
                        onClick={() => this.toggleOpen("settings")}
                        title={"Click to choose consistency & type of unions"}
                    />
                    <StyledDivider margin={16} />
                    <RuleWorkTooltip
                        title={`Calculate with threshold ${parameters.consistencyThreshold} 
                        & ${parameters.typeOfUnions} unions`}
                    >
                        <CalculateButton
                            aria-label={"unions-calculate-button"}
                            disabled={loading}
                            onClick={this.onCountUnionsClick}
                        />
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange}/>
                </StyledPaper>
                <RuleWorkDrawer
                    id={"unions-settings"}
                    onClose={() => this.toggleOpen("settings")}
                    open={open.settings}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfUnionsSelector
                        TextFieldProps={{
                            onChange: this.onTypeOfUnionsChange,
                            value: parameters.typeOfUnions
                        }}
                    />
                    <ThresholdSelector
                        onChange={this.onConsistencyThresholdChange}
                        value={parameters.consistencyThreshold}
                    />
                </RuleWorkDrawer>
                <TabBody
                    content={parseUnionsListItems(displayedItems)}
                    id={"unions-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onDetailsOpen
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Number of unions:",
                            value: displayedItems ? displayedItems.length : undefined
                        },
                        {
                            label: "Quality of classification:",
                            value: data ? data.qualityOfApproximation : undefined
                        }
                    ]}
                />
                {selectedItem !== null &&
                    <UnionsDialog
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

Unions.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    value: PropTypes.number,
};

export default Unions;