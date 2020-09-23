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

/**
 * The class unions tab in RuLeStudio.
 * Presents the list of all unions generated for the information table in current project
 *
 * @class
 * @category Tabs
 * @subcategory Tabs
 * @param {Object} props
 * @param {function} props.onTabChange - Callback fired when a tab is changed and there are unsaved changes in this tab.
 * @param {Object} props.project - Current project.
 * @param {string} props.serverBase - The name of the host.
 * @param {function} props.showAlert - Callback fired when results in this tab are based on outdated information table.
 * @param {number} props.value - The id of a tab.
 * @returns {React.Component}
 */
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

    /**
     * Makes an API call on unions to receive current copy of unions from server.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf Unions
     */
    getUnions = () => {
        const { project, serverBase } = this.props;
        const pathParams = {
            projectId: project.result.id,
            typeOfUnions: undefined,
            consistencyThreshold: undefined
        }

        fetchUnions(
            pathParams,"GET", serverBase
        ).then(result => {
            if (result && this._isMounted) {
                const items = parseUnionsItems(result);

                this.setState({
                    data: result,
                    items: items,
                    displayedItems: items,
                    parameters: {
                        consistencyThreshold: result.parameters.consistencyThreshold,
                        typeOfUnions: result.parameters.typeOfUnions.toLowerCase()
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

    /**
     * A component's lifecycle method. Fired once when component was mounted.
     * <br>
     * <br>
     * Method calls {@link getUnions}.
     *
     * @function
     * @memberOf Unions
     */
    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getUnions);
    }

    /**
     * A component's lifecycle method. Fired after a component was updated.
     * <br>
     * <br>
     * If type of unions was changed to <code>monotonic</code> and consistency threshold is equal to 1,
     * method changes value of threshold to 0.
     * <br>
     * <br>
     * If project was changed, method saves changes from previous project
     * and calls {@link getUnions} to receive the latest copy of unions.
     *
     * @function
     * @memberOf Unions
     * @param {Object} prevProps - Old props that were already replaced.
     * @param {Object} prevState - Old state that was already replaced.
     * @param {Object} snapshot - Returned from another lifecycle method <code>getSnapshotBeforeUpdate</code>. Usually undefined.
     */
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

    /**
     * A component's lifecycle method. Fired when component was requested to be unmounted.
     * <br>
     * <br>
     * Method saves changes from current project.
     *
     * @function
     * @memberOf Unions
     */
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

    /**
     * Makes an API call on unions to generate new unions from current information table with specified parameters.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf Unions
     */
    onCountUnionsClick = () => {
        const { project, serverBase }= this.props;
        const { parameters } = this.state;

        this.setState({
            loading: true,
        }, () => {
            const pathParams = { projectId: project.result.id, ...parameters };

            fetchUnions(
                pathParams, "PUT", serverBase
            ).then(result => {
                if (result) {
                    if (this._isMounted) {
                        const items = parseUnionsItems(result);

                        this.setState({
                            data: result,
                            items: items,
                            displayedItems: items,
                            parameters: {
                                consistencyThreshold: result.parameters.consistencyThreshold,
                                typeOfUnions: result.parameters.typeOfUnions.toLowerCase()
                            },
                            parametersSaved: true,
                        });
                    }
                    let projectCopy = JSON.parse(JSON.stringify(project));
                    projectCopy.result.unions = result;
                    projectCopy.parameters.consistencyThreshold = result.parameters.consistencyThreshold;
                    projectCopy.parameters.typeOfUnions = result.parameters.typeOfUnions.toLowerCase();
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

    /**
     * Filters items from {@link Unions}' state.
     * Method uses {@link filterFunction} to filter items.
     *
     * @function
     * @memberOf Unions
     * @param {Object} event - Represents an event that takes place in DOM.
     */
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
                        projectId={result.id}
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