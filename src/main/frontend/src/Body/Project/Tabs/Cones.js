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
import StyledPaper from "../../../Utils/Surfaces/StyledPaper";

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
                const { result: { informationTable: { objects } }, settings } = project;
                const items = parseConesItems(result, objects, settings);

                this.setState({
                    data: result,
                    items: items,
                    displayedItems: items,
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
                this.setState({
                    loading: false,
                    selectedItem: null,
                })
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
            let method = project.dataUpToDate ? "PUT" : "POST"
            let data = new FormData();

            if ( !project.dataUpToDate ) {
                data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
                data.append("data", JSON.stringify(project.result.informationTable.objects));
            }

            fetchCones(
                serverBase, project.result.id, method, data
            ).then(result => {
                if (result) {
                    if (this._isMounted) {
                        const { result: { informationTable: { objects } }, settings } = project;
                        const items = parseConesItems(result, objects, settings);

                        this.setState({
                            data: result,
                            items: items,
                            displayedItems: items,
                        });
                    }
                    let newProject = { ...project };

                    newProject.result.dominanceCones = result;
                    newProject.dataUpToDate = true;
                    newProject.tabsUpToDate[this.props.value] = true;
                    this.props.onTabChange(newProject);
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
            <CustomBox id={"cones"} styleVariant={"tab"}>
                <StyledPaper id={"cones-bar"} paperRef={this.upperBar}>
                    <CalculateButton
                        aria-label={"cones-calculate-button"}
                        disabled={loading}
                        onClick={this.onCalculateClick}
                    />
                    <span style={{flexGrow: 1}}/>
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <TabBody
                    content={parseConesListItems(displayedItems)}
                    id={"cones-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onDetailsOpen
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
    value: PropTypes.number
};

export default Cones;