import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterNoResults from "../Utils/Filtering/FilterNoResults";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Calculations/CalculateButton";
import SettingsButton from "../Utils/Settings/SettingsButton";
import SettingsFooter from "../Utils/Settings/SettingsFooter";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import RuleWorkDialog from "../../../RuleWorkComponents/Feedback/RuleWorkDialog/RuleWorkDialog"
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledToggleButton from "../../../RuleWorkComponents/Inputs/StyledToggleButton";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

class CrossValidation extends Component {
    constructor(props) {
        super(props);

        this._data = {};
        this._items = [];

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            displayedItems: [],
            threshold: 0,
            typeOfUnions: "monotonic",
            typeOfClassifier: "SimpleRuleClassifier",
            defaultClassificationResult: "majorityDecisionClass",
            foldDisplay: 0,
            foldIndex: 0,
            foldNumber: 2,
            folds: [],
            selectedItem: null,
            openDetails: false,
            openSettings: false,
            snackbarProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;

        this.setState({
            loading: true,
            threshold: this.props.project.threshold,
            typeOfUnions: this.props.project.typeOfUnions,
            typeOfClassifier: this.props.project.typeOfClassifier,
            defaultClassificationResult: this.props.project.defaultClassificationResult,
            foldDisplay: this.props.project.foldDisplay,
            foldIndex: this.props.project.foldIndex,
            foldNumber: this.props.project.foldNumber,
        }, () => {
            const project = {...this.props.project};
            let msg = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/crossValidation`, {
                method: 'GET'
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = this.getItems(result.crossValidationSingleFolds);

                            this._data = result;
                            this._items = items;
                            this.setState({
                                loading: false,
                                displayedItems: items,
                                foldNumber: result.numberOfFolds,
                                folds: Array.from(Array(result.numberOfFolds).keys()).map(x => ++x)
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + " " + result.message;
                            let alertProps = {title: "Something went wrong! Couldn't calculate cross-validation :("};
                            let snackbarProps = {alertProps: alertProps, open: true, message: msg, variant: "warning"};
                            this.setState({
                                loading: false,
                                snackbarProps: response.status !== 404 ? snackbarProps : undefined
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate cross-validation :(";
                            let alertProps = {title: "ERROR " + response.status};
                            let snackbarProps = {alertProps: alertProps, open: true, message: msg, variant: "error"};
                            this.setState({
                                loading: false,
                                snackbarProps: response.status !== 404 ? snackbarProps : undefined
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate classification :(";
                    this.setState({
                        loading: false,
                        snackbarProps: {open: true, message: msg, variant: "error"}
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
                project.result.crossValidation = this._data;
            }
            project.threshold = this.state.threshold;
            project.typeOfUnions = this.state.typeOfUnions;
            project.typeOfClassifier = this.state.typeOfClassifier;
            project.defaultClassificationResult = this.state.defaultClassificationResult;
            project.foldDisplay = this.state.foldDisplay;
            project.foldIndex = this.state.foldIndex;
            project.foldNumber = this.state.foldNumber;

            this.props.onTabChange(project, this.state.updated, true);
        }
    }

    onSettingsClick = () => {
        this.setState(prevState => ({
            openSettings: !prevState.openSettings,
        }));
    };

    onSettingsClose = () => {
        this.setState({
            openSettings: false,
        });
    };

    onFoldNumberChange = (event) => {
        const input = event.target.value;

        if (!isNaN(input)) {
            this.setState({
                changes: Number(input) !== 1,
                updated: this.props.project.dataUpToDate,
                foldNumber: Number(input),
            });
        }
    };

    onCalculateClick = () => {
        this.setState({
            loading: true,
        }, () => {
            const project = {...this.props.project};

            let data = new FormData();
            data.append("typeOfUnions", this.state.typeOfUnions);
            data.append("consistencyThreshold", this.state.threshold);
            data.append("typeOfClassifier", this.state.typeOfClassifier);
            data.append("defaultClassificationResult", this.state.defaultClassificationResult);
            data.append("numberOfFolds", this.state.foldNumber);

            let msg = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/crossValidation`, {
                method: "PUT",
                body: data
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        const updated = true;

                        if (this._isMounted) {
                            const items = this.getItems(result.crossValidationSingleFolds);

                            this._data = result;
                            this._items = items;
                            this.setState({
                                changes: true,
                                updated: updated,
                                loading: false,
                                displayedItems: items,
                                foldNumber: result.numberOfFolds,
                                folds: Array.from(Array(result.numberOfFolds).keys()).map(x => ++x),
                            });
                        } else {

                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false})
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + " " + result.message;
                            let alertProps = {title: "Something went wrong! Couldn't calculate cross-validation :("};
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "warning"}
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate cross-validation :(";
                            let alertProps = {title: "ERROR " + response.status};
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "error"}
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate cross-validation :(";
                    this.setState({
                        loading: false,
                        snackbarProps: {open: true, message: msg, variant: "error"}
                    });
                }
            });
        });
    };

    onFoldIndexChange = (event) => {
        this.setState({
            changes: Boolean(event.target.value),
            updated: this.props.project.dataUpToDate,
            foldIndex: event.target.value,
        })
    };

    onFoldDisplayChange = (event, newDisplay) => {
        if (typeof newDisplay !== 'number') return;

        this.setState({
            changes: Boolean(newDisplay),
            updated: this.props.project.dataUpToDate,
            foldDisplay: newDisplay,
        });
    };

    onFilterChange = (event) => {
        const filteredItems = filterFunction(event.target.value.toString(), this._items.slice(0));
        this.setState({displayedItems: filteredItems});
    };

    onDetailsOpen = (index) => {
        this.setState({
            openDetails: true,
            selectedItem: this._items[index],
        });
    };

    onDetailsClose = () => {
        this.setState({
            openDetails: false,
            selectedItem: null
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
            for (let i = 0; i < data.length; i++) {
                console.log(data[i]);
            }
        }
        return items;
    };

    renderResultsActions = () => {
        const {foldDisplay, folds, foldIndex} = this.state;

        if (Array.isArray(folds) && folds.length) {
            return (
                <Fragment>
                    <RuleWorkTextField
                        hasOutsideLabel={true}
                        onChange={this.onFoldIndexChange}
                        outsideLabel={"Choose fold"}
                        select={true}
                        value={foldIndex}
                    >
                        {folds}
                    </RuleWorkTextField>
                    <StyledDivider />
                    <ToggleButtonGroup
                        aria-label={"display-toggle-button-group"}
                        exclusive={true}
                        onChange={this.onFoldDisplayChange}
                        value={foldDisplay}
                    >
                        <StyledToggleButton value={0}>
                            Details of training set
                        </StyledToggleButton>
                        <StyledToggleButton value={1}>
                            Error matrix
                        </StyledToggleButton>
                        <StyledToggleButton value={2}>
                            Mean error matrix
                        </StyledToggleButton>
                    </ToggleButtonGroup>
                </Fragment>
            )
        } else {
            return null;
        }
    };

    render() {
        const {loading, displayedItems, foldNumber, selectedItem, openDetails,
            openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-cross-validation"} styleVariant={"tab"}>
                <StyledPaper id={"cross-validation-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"cross-validation-settings-button"}
                        onClick={this.onSettingsClick}
                        title={"Click to customize number of folds"}
                    />
                    <StyledDivider />
                    <RuleWorkTooltip title={`Current number of folds: ${foldNumber}`}>
                        <CalculateButton
                            aria-label={"cross-validation-calculate-button"}
                            disabled={!this.props.project || loading}
                            onClick={this.onCalculateClick}
                        />
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    {this.renderResultsActions()}
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkDrawer
                    height={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                    id={"cross-validation-settings-drawer"}
                    open={openSettings}
                >
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"fold-number-selector"} >
                        <RuleWorkTextField
                            hasOutsideLabel={true}
                            onChange={this.onFoldNumberChange}
                            outsideLabel={"Choose number of folds"}
                            style={{maxWidth: 72}}
                            value={foldNumber}
                        />
                    </RuleWorkSmallBox>
                    <SettingsFooter
                        id={"cross-validation-settings-footer"}
                        onClose={this.onSettingsClose}
                        styleVariant={"footer"}
                    />
                </RuleWorkDrawer>
                <RuleWorkBox id={"cross-validation-body"} styleVariant={"tab-body"}>
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
        )
    }
}

CrossValidation.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    value: PropTypes.number,
};

export default CrossValidation;