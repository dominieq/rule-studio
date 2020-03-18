import React, {Component} from 'react';
import PropTypes from "prop-types";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterNoResults from "../Utils/Filtering/FilterNoResults";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox"
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkDialog from "../../../RuleWorkComponents/Feedback/RuleWorkDialog/RuleWorkDialog"
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import Calculator from "mdi-material-ui/Calculator";

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
            snackbarProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        const project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            let msg = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/cones`, {
                method: "GET"
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this.setState({
                                loading: false,
                                displayedItems: items,
                            }, () => {
                                this._data = result;
                                this._items = items;
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                } else {
                    response.json().then(result => {
                        msg = "error " + result.status + ": " + result.message;
                        let alertProps = {hasTitle: true, title: "Something went wrong! Please don't panic :)"};
                        let snackbarProps = {alertProps: alertProps, open: true, message: msg, variant: "info"};
                        if (this._isMounted) {
                            this.setState({
                                loading: false,
                                snackbarProps: result.status !== 404 ? snackbarProps : null
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load cones :(";
                    this.setState({
                        loading: false,
                        snackbarProps: {open: true, message: msg, variant: "error"},
                    });
                }
            });
        });
    }

   componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.project.settings.indexOption !== prevProps.project.settings.indexOption) {
            this.setState({
                displayedItems: [...this.getItems(this._data)]
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
            this.props.onTabChange(project, this.props.value, this.state.updated);
        }
    }

    onCalculateClick = () => {
        const project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            let data = new FormData();
            data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
            data.append("data", JSON.stringify(project.result.informationTable.objects));

            let msg = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/cones`, {
                method: this.props.dataUpToDate ? "PUT" : "POST",
                body: this.props.dataUpToDate ? null : data,
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this.setState({
                                changes: true,
                                updated: true,
                                loading: false,
                                displayedItems: items,
                            }, () => {
                                this._data = result;
                                this._items = items;
                            });
                        } else {
                            project.result.dominanceCones = result;
                            project.result.calculatedDominanceCones = true;
                            this.props.onTabChange(project, this.props.value, true);
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "error " + result.status + ": " + result.message;
                            let alertProps = {hasTitle: true, title: "Something went wrong! Please don't panic :)"};
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "info"}
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate dominance cones :(";
                    this.setState({
                        loading: false,
                        snackbarProps: {open: true, message: msg, variant: "error"}
                    });
                }
            });
        });
    };

    onFilterChange = (event) => {
        const filteredItems = filterFunction(event.target.value.toString(), this._items.slice(0));
        this.setState({displayedItems: filteredItems});
    };

    onDetailsOpen = (index) => {
        this.setState({
            openDetails: true,
            selectedItem: {...this.state.displayedItems[index]},
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
            this.setState({snackbarProps: undefined});
        }
    };

    getItems = (data) => {
        let items = [];

        if (data) {
            const indexOption = this.props.project.settings.indexOption;
            const objects = [...this.props.project.result.informationTable.objects];

            for (let i = 0; i < data.numberOfObjects; i++) {
                const id = i.toString();
                let name = "Object " + (i + 1);

                if (indexOption !== "default") {
                    if (Object.keys(objects[i]).includes(indexOption)) {
                        name = objects[i][indexOption];
                    }
                }

                const tables = {
                    positiveDCones: data.positiveDCones[i],
                    negativeDCones: data.negativeDCones[i],
                    positiveInvDCones: data.positiveInvDCones[i],
                    negativeInvDCones: data.negativeInvDCones[i],
                };

                const item = new Item(id, name, null, null, tables);
                items = [...items, item];
            }
        }
        return items;
    };

    render() {
        const {loading, displayedItems, openDetails, selectedItem, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-cones"} styleVariant={"tab"}>
                <StyledPaper id={"cones-bar"} paperRef={this.upperBar} square={true} variant={"outlined"}>
                    <StyledButton
                        disabled={!this.props.project || loading}
                        disableElevation={true}
                        onClick={this.onCalculateClick}
                        startIcon={<Calculator />}
                        themeVariant={"primary"}
                        variant={"contained"}
                    >
                        Calculate
                    </StyledButton>
                    <span style={{flexGrow: 1}}/>
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkBox id={"cones-list"} styleVariant={"tab-body"}>
                    {loading ?
                        <StyledCircularProgress />
                        :
                        displayedItems ?
                            <RuleWorkList onItemSelected={this.onDetailsOpen}>
                                {displayedItems}
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
                <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        );
    }
}

Cones.propTypes = {
    dataUpToDate: PropTypes.bool,
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    upToDate: PropTypes.bool,
    value: PropTypes.number,
};

export default Cones;