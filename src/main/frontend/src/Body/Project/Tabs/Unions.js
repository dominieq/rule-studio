import React, {Component} from "react";
import PropTypes from "prop-types";
import { fetchUnions } from "../../../Utils/utilFunctions/fetchFunctions";
import { parseUnionsItems } from "../../../Utils/utilFunctions/parseItems";
import { parseUnionsListItems } from "../../../Utils/utilFunctions/parseListItems";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import CustomBox from "../../../Utils/Containers/CustomBox";
import CustomDrawer from "../../../Utils/Containers/CustomDrawer"
import StyledDivider from "../../../Utils/DataDisplay/StyledDivider";
import CustomTooltip from "../../../Utils/DataDisplay/CustomTooltip";
import { UnionsDialog } from "../../../Utils/Feedback/DetailsDialog";
import StyledAlert from "../../../Utils/Feedback/StyledAlert";
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";

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
        const { project, serverBase } = this.props;

        fetchUnions(
            serverBase, project.result.id, "GET", null
        ).then(result => {
            if (result && this._isMounted) {
                const items = parseUnionsItems(result);

                this.setState({
                    data: result,
                    items: items,
                    displayedItems: items,
                    parameters: {
                        consistencyThreshold: result.consistencyThreshold,
                        typeOfUnions: result.typeOfUnions.toLowerCase()
                    }
                });

                if (result.hasOwnProperty("isCurrentData")) {
                    this.props.showAlert(this.props.value, !result.isCurrentData);
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
                const { project: { parameters, parametersSaved }} = this.props;
                const { consistencyThreshold, typeOfUnions } = parameters;

                this.setState(({parameters}) => ({
                    loading: false,
                    parameters: parametersSaved ?
                        parameters : { ...parameters, ...{ consistencyThreshold, typeOfUnions }},
                    parametersSaved: parametersSaved,
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
            let project = JSON.parse(JSON.stringify(this.props.project));

            project.parameters = { ...project.parameters, ...parameters }
            project.parametersSaved = parametersSaved;
            this.props.onTabChange(project);
        }
    }

    onCountUnionsClick = () => {
        const { project, serverBase }= this.props;
        const { parameters } = this.state;

        this.setState({
            loading: true,
        }, () => {
            let method = "PUT";
            let data = { ...parameters };

            fetchUnions(
                serverBase, project.result.id, method, data
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
                    let projectCopy = JSON.parse(JSON.stringify(project));
                    projectCopy.result.unions = result;
                    projectCopy.parameters.consistencyThreshold = result.consistencyThreshold;
                    projectCopy.parameters.typeOfUnions = result.typeOfUnions.toLowerCase();
                    projectCopy.parametersSaved = true;
                    this.props.onTabChange(projectCopy);

                    if (result.hasOwnProperty("isCurrentData")) {
                        this.props.showAlert(this.props.value, !result.isCurrentData);
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
                    this.setState({
                        loading: false,
                        selectedItem: null
                    });
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
        const { loading, items } = this.state;

        if (!loading && Array.isArray(items) && items.length) {
            const filteredItems = filterFunction(event.target.value.toString(), items.slice());

            this.setState({
                displayedItems: filteredItems,
                selectedItem: null
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
            <CustomBox id={"unions"} variant={"Tab"}>
                <CustomDrawer
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
                </CustomDrawer>
                <CustomBox customScrollbar={true} id={"unions-content"} variant={"TabBody"}>
                    <CustomHeader id={"unions-header"} paperRef={this.upperBar}>
                        <SettingsButton onClick={() => this.toggleOpen("settings")} />
                        <StyledDivider margin={16} />
                        <CustomTooltip
                            disableMaxWidth={true}
                            title={"Click on settings button on the left to customize parameters"}
                        >
                            <CalculateButton
                                aria-label={"unions-calculate-button"}
                                disabled={loading}
                                onClick={this.onCountUnionsClick}
                            />
                        </CustomTooltip>
                        <span style={{flexGrow: 1}} />
                        <FilterTextField onChange={this.onFilterChange}/>
                    </CustomHeader>
                    <TabBody
                        content={parseUnionsListItems(displayedItems)}
                        id={"unions-list"}
                        isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                        isLoading={loading}
                        ListProps={{
                            onItemSelected: this.onDetailsOpen
                        }}
                        ListSubheaderProps={{
                            style: this.upperBar.current ? { top: this.upperBar.current.offsetHeight } : undefined
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
                </CustomBox>
                <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />
            </CustomBox>
        )
    }
}

Unions.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    showAlert: PropTypes.func,
    value: PropTypes.number
};

export default Unions;