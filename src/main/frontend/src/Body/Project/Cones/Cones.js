import React, {Component} from 'react';
import PropTypes from "prop-types";
import CalculateButton from "../Utils/Calculations/CalculateButton";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterNoResults from "../Utils/Filtering/FilterNoResults";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox"
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkDialog from "../../../RuleWorkComponents/Feedback/RuleWorkDialog/RuleWorkDialog"
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

class Cones extends Component {
    constructor(props) {
        super(props);

        this._data = {};
        this._items = [];

        this.state = {
            changes: false,
            updated: false,
            loading: false,
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
                            const items = this.getItems(result);

                            this._data = result;
                            this._items = items;
                            this.setState({
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
            this.setState({
                displayedItems: this.getItems(this._data)
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this.state.changes) {
            let project = {...this.props.project};
            if (Object.keys(this._data).length) {
                project.result.dominanceCones = this._data;
                project.result.calculatedDominanceCones = true;
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
                            const items = this.getItems(result);

                            this._data = result;
                            this._items = items;
                            this.setState({
                                changes: true,
                                updated: updated,
                                displayedItems: items,
                            });
                        } else {
                            project.result.dominanceCones = result;
                            project.result.calculatedDominanceCones = updated;

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
        const filteredItems = filterFunction(event.target.value.toString(), this._items.slice(0));
        this.setState({displayedItems: filteredItems});
    };

    onDetailsOpen = (index) => {
        this.setState({
            openDetails: true,
            selectedItem: {...this._items[index]},
        })
    };

    onDetailsClose = () => {
        this.setState({
            openDetails: false,
            selectedItem: null,
        });
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    getItems = (data) => {
        let items = [];

        if (data) {
            const indexOption = this.props.project.settings.indexOption;
            const objects = [...this.props.project.result.informationTable.objects];

            for (let i = 0; i < data.numberOfObjects; i++) {
                const id = i;
                let name = "Object " + (i + 1);

                if (indexOption !== "default") {
                    if (Object.keys(objects[i]).includes(indexOption)) {
                        name = objects[i][indexOption];
                    }
                }

                const tables = {
                    positiveDCones: data.positiveDCones[i].slice(),
                    negativeDCones: data.negativeDCones[i].slice(),
                    positiveInvDCones: data.positiveInvDCones[i].slice(),
                    negativeInvDCones: data.negativeInvDCones[i].slice(),
                };

                const item = new Item(id, name, null, null, tables);
                items.push(item);
            }
        }
        return items;
    };

    getListItems = (items) => {
        let listItems = [];
        if (this._data) {
            for (let i = 0; i < items.length; i++) {
                const listItem = {
                    id: items[i].id,
                    header: items[i].name,
                    subheader: undefined,
                    content: undefined,
                    multiContent: [
                        {
                            title: "Number of objects in positive dominance cone:",
                            subtitle: items[i].tables.positiveDCones.length,
                        },
                        {
                            title: "Number of objects in negative dominance cone:",
                            subtitle: items[i].tables.negativeDCones.length,
                        }
                    ]
                };
                listItems.push(listItem)
            }
        }
        return listItems;
    };

    render() {
        const {loading, displayedItems, openDetails, selectedItem, alertProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-cones"} styleVariant={"tab"}>
                <StyledPaper id={"cones-bar"} paperRef={this.upperBar}>
                    <CalculateButton
                        aria-label={"cones-calculate-button"}
                        disabled={!this.props.project || loading}
                        onClick={this.onCalculateClick}
                    />
                    <span style={{flexGrow: 1}}/>
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkBox id={"cones-list"} styleVariant={"tab-body"}>
                    {loading ?
                        <StyledCircularProgress />
                        :
                        displayedItems ?
                            <RuleWorkList onItemSelected={this.onDetailsOpen}>
                                {this.getListItems(displayedItems)}
                            </RuleWorkList>
                            :
                            <FilterNoResults />
                    }
                </RuleWorkBox>
                {selectedItem &&
                    <RuleWorkDialog
                        item={selectedItem}
                        onClose={this.onDetailsClose}
                        open={openDetails}
                        projectResult={this.props.project.result}
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