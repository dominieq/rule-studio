import React, {Component} from 'react';
import PropTypes from "prop-types";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
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

        if (project.result.calculatedDominanceCones) {
            this.setState({
                loading: true,
            }, () => {
                fetch(`http://localhost:8080/projects/${project.result.id}/cones`, {
                    method: "GET"
                }).then(response => {
                    return response.json();
                }).then(result => {
                    console.log(result);

                    const items = this.getItems(result);

                    if (this._isMounted) {
                        this.setState({
                            loading: false,
                            displayedItems: items,
                        }, () => {
                            this._data = result;
                            this._items = items;
                        });
                    }
                }).catch(error => {
                    if (this._isMounted) {
                        this.setState({
                            loading: false,
                            snackbarProps: {
                                open: true,
                                message: "Server error. Couldn't load cones!",
                                variant: "error",
                            },
                        }, () => {
                            console.log(error);
                        });
                    }
                });
            });
        }
    }

    componentWillUnmount() {
        if (this.state.changes) {
            let project = {...this.props.project};
            if (Object.keys(this._data).length) {
                project.result.dominanceCones = this._data;
                project.result.calculatedDominanceCones = true;
            }
            this.props.onTabChange(project, this.props.value, false);
        }
    }

    onCalculateClick = () => {
        const project = this.props.project;

        this.setState({
            loading: true,
        }, () => {
            // const method = !this.props.dataUpToDate ? "PUT" : "GET";
            fetch(`http://localhost:8080/projects/${project.result.id}/cones`, {
                method: "GET",
            }).then(response => {
                return response.json();
            }).then(result => {
                console.log(result);

                const items = this.getItems(result);

                if (this._isMounted) {
                    this.setState({
                        changes: true, // this.props.dataUpToDate,
                        loading: false,
                        displayedItems: items,
                    }, () => {
                        this._data = result;
                        this._items = items;
                    });
                }
            }).catch(error => {
                if (this._isMounted) {
                    this.setState({
                        loading: false,
                        snackbarProps: {
                            open: true,
                            message: "Server error. Couldn't calculate cones!",
                            variant: "error",
                        },
                    }, () => {
                        console.log(error);
                    });
                }
            });
        });
    };

    onFilterChange = (event) => {
        const filterText = event.target.value.toString();
        const items = this._items.slice(0);

        if (filterText === "") {
            this.setState({
                displayedItems: items,
            });
            return;
        }

        let displayedItems = [];
        for (let i = 0; i < items.length; i++) {
            const object = items[i];

            if (object.name.toString().includes(filterText)) {
                displayedItems = [...displayedItems, object];
            }
        }
        if (displayedItems.length > 0) {
            this.setState({
                displayedItems: displayedItems,
            });
        }
    };

    onSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            snackbarProps: undefined,
        });
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
                    <RuleWorkTextField
                        type={"search"}
                        onChange={this.onFilterChange}
                    >
                        Filter objects
                    </RuleWorkTextField>
                </StyledPaper>
                <RuleWorkBox id={"cones-list"} styleVariant={"tab-body"}>
                    {loading ?
                        <StyledCircularProgress />
                        :
                        <RuleWorkList>
                            {displayedItems}
                        </RuleWorkList>
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