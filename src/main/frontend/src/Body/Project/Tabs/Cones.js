import React, { Component } from 'react';
import PropTypes from "prop-types";
import { fetchCones } from "../../../Utils/utilFunctions/fetchFunctions";
import { parseConesItems } from "../../../Utils/utilFunctions/parseItems"
import { parseConesListItems } from "../../../Utils/utilFunctions/parseListItems";
import TabBody from "../Utils/TabBody";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CustomBox from "../../../Utils/Containers/CustomBox"
import { ConesDialog } from "../../../Utils/Feedback/DetailsDialog";
import StyledAlert from "../../../Utils/Feedback/StyledAlert";
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";

/**
 * The dominance cones tab in RuLeStudio.
 * Presents the list of all objects from information table with details about their dominance cones.
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
class Cones extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
            items: null,
            displayedItems: [],
            selectedItem: null,
            openDetails: false,
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    /**
     * Makes an API call on cones to receive current copy of dominance cones from server.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf Cones
     */
    getData = () => {
        const { project, serverBase } = this.props;

        fetchCones(
            project.result.id, "GET", null, serverBase
        ).then(result => {
            if (result && this._isMounted) {
                const { project: { result: { informationTable: { objects }}, settings }} = this.props;
                const items = parseConesItems(result, objects, settings);

                this.setState({
                    data: result,
                    items: items,
                    displayedItems: items
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
                this.setState({
                    loading: false,
                    selectedItem: null
                });
            }
        });
    }

    /**
     * A component's lifecycle method. Fired once when component was mounted.
     * <br>
     * <br>
     * Method calls {@link getData}.
     *
     * @function
     * @memberOf Cones
     */
    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getData);
    }

    /**
     * A component's lifecycle method. Fired after a component was updated.
     * <br>
     * <br>
     * If index option was changed, method sets object's names according to new value.
     * <br>
     * <br>
     * If project was changed, method saves changes from previous project
     * and calls {@link getData} to receive the latest copy of dominance cones.
     *
     * @function
     * @memberOf Cones
     * @param {Object} prevProps - Old props that were already replaced.
     * @param {Object} prevState - Old state that was already replaced.
     * @param {Object} snapshot - Returned from another lifecycle method <code>getSnapshotBeforeUpdate</code>. Usually undefined.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.project.settings.indexOption !== prevProps.project.settings.indexOption) {
            const { data } = this.state;
            const { result: { informationTable: { objects } }, settings } = this.props.project;

            let newItems = parseConesItems(data, objects, settings);

            this.setState({
                items: newItems,
                displayedItems: newItems
            });
        }

        if (prevProps.project.result.id !== this.props.project.result.id) {
            this.setState({ loading: true }, this.getData);
        }
    }

    /**
     * A component's lifecycle method. Fired when component was requested to be unmounted.
     *
     * @function
     * @memberOf Cones
     */
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Makes an API call on cones to generate new dominance cones from current information table.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf Cones
     */
    onCalculateClick = () => {
        const { project, serverBase } = this.props;

        this.setState({
            loading: true,
        }, () => {
            fetchCones(
                project.result.id, "PUT", null, serverBase
            ).then(result => {
                if (result) {
                    let projectCopy = JSON.parse(JSON.stringify(project));

                    if (this._isMounted) {
                        const { result: { informationTable: { objects } }, settings } = projectCopy;
                        const items = parseConesItems(result, objects, settings);

                        this.setState({
                            data: result,
                            items: items,
                            displayedItems: items
                        });
                    }

                    projectCopy.result.dominanceCones = result;
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

    /**
     * Filters items from {@link Cones}'s state.
     * Method uses {@link filterFunction} to filter items.
     *
     * @function
     * @memberOf Cones
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

    onDetailsOpen = (index) => {
        const { items } = this.state;

        this.setState({
            openDetails: true,
            selectedItem: items[index],
        })
    };

    onDetailsClose = () => {
        this.setState({
            openDetails: false
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
        const { loading, items, displayedItems, openDetails, selectedItem, alertProps } = this.state;
        const { project: { result } } = this.props;

        return (
            <CustomBox customScrollbar={true} id={"cones"} variant={"TabBody"}>
                <CustomHeader id={"cones-header"} paperRef={this.upperBar}>
                    <CalculateButton
                        aria-label={"cones-calculate-button"}
                        disabled={loading}
                        onClick={this.onCalculateClick}
                    />
                    <span style={{flexGrow: 1}}/>
                    <FilterTextField onChange={this.onFilterChange} />
                </CustomHeader>
                <TabBody
                    content={parseConesListItems(displayedItems)}
                    id={"cones-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onDetailsOpen
                    }}
                    ListSubheaderProps={{
                        disableHelper: false,
                        helper: (
                            <React.Fragment>
                                <header style={{textAlign: "left"}}>
                                    {"For an object x, cones are defined as follows:"}
                                </header>
                                <ul style={{margin: 0, paddingInlineStart: 16}}>
                                    <li style={{textAlign: "left"}}>
                                        <b>a positive cone</b>
                                        {" is the set of objects that dominate x,"}
                                    </li>
                                    <li style={{textAlign: "left"}}>
                                        <b>a negative cone</b>
                                        {" contains objects that x dominates,"}
                                    </li>
                                    <li style={{textAlign: "left"}}>
                                        <b>a positive inverse cone</b>
                                        {" contains objects that x is dominated by,"}
                                    </li>
                                    <li style={{textAlign: "left"}}>
                                        <b>a negative inverse cone</b>
                                        {" is the set of objects that are dominated by x."}
                                    </li>
                                </ul>
                                <p aria-label={"helper text"} style={{margin: 0, textAlign: "justify"}}>
                                    {
                                        "Inverse dominance cones are displayed when it is necessary. " +
                                        "Inverse dominance cones are going to be hidden " +
                                        "when they are equal to normal cones."
                                    }
                                </p>
                            </React.Fragment>

                        ),
                        style: this.upperBar.current ? { top: this.upperBar.current.offsetHeight } : undefined
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Number of objects:",
                            value: displayedItems && displayedItems.length
                        }
                    ]}
                />
                {selectedItem !== null &&
                    <ConesDialog
                        item={selectedItem}
                        items={items}
                        onClose={this.onDetailsClose}
                        open={openDetails}
                        projectId={result.id}
                        projectResult={result}
                    />
                }
                <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />
            </CustomBox>
        );
    }
}

Cones.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    showAlert: PropTypes.func,
    value: PropTypes.number
};

export default Cones;