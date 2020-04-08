import React, {Component} from 'react';
import PropTypes from "prop-types";
import { parseConesItems, parseConesListItems } from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox"
import { ConesDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog";
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

class Cones extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changes: false,
            updated: false,
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

    componentDidMount() {
        this._isMounted = true;
        const project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            let msg, title = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/cones`, {
                method: "GET"
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const { result: { informationTable: { objects } }, settings } = project;
                            const items = parseConesItems(result, objects, settings);

                            this.setState({
                                data: result,
                                items: items,
                                displayedItems: items,
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            title = "Something went wrong! Couldn't load dominance cones :(";
                            let alertProps = {message: msg, open: true,  title: title, severity: "warning"};
                            this.setState({
                                alertProps: result.status !== 404 ? alertProps : undefined,
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't load dominance cones :(";
                            title = "ERROR " + response.status;
                            let alertProps = {message: msg, open: true, title: title, severity: "error"};
                            this.setState({
                                alertProps: response.status !== 404 ? alertProps : undefined,
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load dominance cones :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"},
                    });
                }
            }).finally(() => {
                if (this._isMounted) this.setState({loading: false});
            });
        });
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
    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this.state.changes) {
            let project = {...this.props.project};

            if (Object.keys(this._data).length) {
                project.result.dominanceCones = this._data;
            }

            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = this.state.updated;

            this.props.onTabChange(project, this.state.updated, tabsUpToDate);
        }
    }

    onCalculateClick = () => {
        let project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            let data = new FormData();
            data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
            data.append("data", JSON.stringify(project.result.informationTable.objects));

            let msg, title = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/cones`, {
                method: project.dataUpToDate ? "PUT" : "POST",
                body: project.dataUpToDate ? null : data,
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        const updated = true;

                        if (this._isMounted) {
                            const { result: { informationTable: { objects } }, settings } = project;
                            const items = parseConesItems(result, objects, settings);

                            this.setState({
                                changes: true,
                                updated: updated,
                                data: result,
                                items: items,
                                displayedItems: items,
                            });
                        } else {
                            project.result.dominanceCones = result;

                            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
                            tabsUpToDate[this.props.value] = updated;

                            this.props.onTabChange(project, updated, tabsUpToDate);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            title = "Something went wrong! Couldn't calculate dominance cones :(";
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "warning"}
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate dominance cones :(";
                            title = "ERROR " + response.status;
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "error"}
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate dominance cones :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"}
                    });
                }
            }).finally(() => {
                if (this._isMounted) this.setState({loading: false});
            })
        });
    };

    onFilterChange = (event) => {
        const { items } = this.state;
        const filteredItems = filterFunction(event.target.value.toString(), items.slice());

        this.setState({
            displayedItems: filteredItems
        });
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
        const {
            loading,
            items,
            displayedItems,
            openDetails,
            selectedItem,
            alertProps
        } = this.state;

        const {
            project: { result }
        } = this.props;

        return (
            <RuleWorkBox id={"rule-work-cones"} styleVariant={"tab"}>
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
                            label: "Number of objects",
                            value: displayedItems && displayedItems.length
                        }
                    ]}
                />
                {selectedItem &&
                    <ConesDialog
                        item={selectedItem}
                        items={items}
                        onClose={this.onDetailsClose}
                        open={openDetails}
                        projectResult={result}
                    />
                }
                <RuleWorkAlert {...alertProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        );
    }
}

Cones.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    value: PropTypes.number,
};

export default Cones;