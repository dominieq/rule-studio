import React, {Component} from 'react';
import PropTypes from "prop-types";
import Item from "../../../RuleWorkComponents/API/Item";
import {filterFunction, FilterNoResults, FilterTextField} from "../ProjectTabsUtils/Filtering";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
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
            openSettings: false,
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

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState({snackbarProps: undefined});
        }
    };

    getItems = (data) => {
        let items = [];

        if (data) {
            for (let i = 0; i < data.numberOfObjects; i++) {
                // TODO Change id to object id from InformationTable.
                const id = i.toString();

                // TODO Add choice to display description instead of a number.
                const name = "Object " + (i + 1);
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
        const {loading, displayedItems, snackbarProps} = this.state;

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
                            <RuleWorkList>
                                {displayedItems}
                            </RuleWorkList>
                            :
                            <FilterNoResults />
                    }
                </RuleWorkBox>
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