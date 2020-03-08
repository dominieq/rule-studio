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

class Cones extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            displayedData: [],
            snackbarProps: {
                open: false,
                message: "",
                variant: "info",
            },
        };
    }

    componentDidMount() {
        const project = this.props.project;

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

                    const objectsWithCones = this.getItems(result);

                    this.setState({
                        loading: false,
                        data: objectsWithCones,
                        displayedData: objectsWithCones,
                    });
                }).catch(error => {
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
                });
            });
        }
    }

    onCalculateClick = () => {
        const project = this.props.project;

        this.setState({
            loading: true,
        }, () => {
            fetch(`http://localhost:8080/projects/${project.result.id}/cones`, {
                method: "GET",
            }).then(response => {
                return response.json();
            }).then(result => {
                console.log(result);

                const objectsWithCones = this.getItems(result);

                this.setState({
                    loading: false,
                    data: objectsWithCones,
                    displayedData: objectsWithCones,
                });
            }).catch(error => {
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
            });
        });
    };

    onFilterChange = (event) => {
        const filterText = event.target.value.toString();
        const data = this.state.data.slice(0);

        if (filterText === "") {
            this.setState({
                displayedData: data,
            });
            return;
        }

        let items = [];
        for (let i = 0; i < data.length; i++) {
            const object = data[i];

            if (object.name.toString().includes(filterText)) {
                items = [...items, object];
            }
        }
        if (items.length > 0) {
            this.setState({
                displayedData: items,
            });
        }
    };

    onSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            snackbarProps: {
                open: false,
                message: "",
                variant: "info",
            },
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
        const {loading, displayedData, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-cones"} styleVariant={"tab"}>
                <StyledPaper id={"cones-bar"} styleVariant={"bar"} square={true} variant={"outlined"}>
                    <RuleWorkTextField
                        type={"search"}
                        onChange={this.onFilterChange}
                    >
                        Filter objects
                    </RuleWorkTextField>
                    <span style={{flexGrow: 1}}/>
                    <StyledButton
                        buttonVariant={"contained"}
                        onClick={this.onCalculateClick}
                        styleVariant={"green"}
                    >
                        Calculate
                    </StyledButton>
                </StyledPaper>
                <RuleWorkBox id={"cones-list"} styleVariant={"tab-body1"}>
                    {loading ?
                        <StyledCircularProgress />
                        :
                        <RuleWorkList>
                            {displayedData}
                        </RuleWorkList>
                    }
                </RuleWorkBox>
                <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        );
    }
}

Cones.propTypes = {
    changed: PropTypes.array,
    project: PropTypes.object.isRequired,
    updateProject: PropTypes.func,
    value: PropTypes.number,
};

export default Cones;