import React, { Component } from 'react';
import PropTypes from "prop-types";
import { fetchCones } from "../Utils/fetchFunctions";
import { parseConesItems, parseConesListItems } from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CustomBox from "../../../Utils/Containers/CustomBox"
import { ConesDialog } from "../../../Utils/Feedback/DetailsDialog";
import StyledAlert from "../../../Utils/Feedback/StyledAlert";
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";

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

    getData = () => {
        const { project, serverBase } = this.props;

        fetchCones(
            serverBase, project.result.id, "GET", null
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

    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getData);
    }

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

    componentWillUnmount() {
        this._isMounted = false;
    }

    onCalculateClick = () => {
        const { project, serverBase } = this.props;

        this.setState({
            loading: true,
        }, () => {
            fetchCones(
                serverBase, project.result.id, "PUT", null
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