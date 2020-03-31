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
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledToggleButton from "../../../RuleWorkComponents/Inputs/StyledToggleButton";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import TypeOfRulesSelector from "../Utils/Calculations/TypeOfRulesSelector";
import TypeOfClassifierSelector from "../Utils/Calculations/TypeOfClassifierSelector";
import DefaultClassificationResultSelector from "../Utils/Calculations/DefaultClassificationResultSelector";

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
            defaultClassificationResult: "majorityDecisionClass",
            ruleType: "certain",
            threshold: 0,
            typeOfClassifier: "SimpleRuleClassifier",
            typeOfUnions: "monotonic",
            foldDisplay: 0,
            foldIndex: 0,
            foldNumber: 2,
            folds: [],
            selectedItem: null,
            openDetails: false,
            openSettings: false,
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;

        this.setState({
            loading: true,
        }, () => {
            const project = {...this.props.project};
            let msg, title = "";
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
                                displayedItems: items,
                                foldNumber: result.numberOfFolds,
                                folds: Array.from(Array(result.numberOfFolds).keys()).map(x => ++x)
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + " " + result.message;
                            title = "Something went wrong! Couldn't calculate cross-validation :(";
                            let alertProps = {message: msg, open: true, title: title, severity: "warning"};
                            this.setState({
                                alertProps: response.status !== 404 ? alertProps : undefined
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate cross-validation :(";
                            title = "ERROR " + response.status;
                            let alertProps = {message: msg, open: true, title: title, severity: "error"};
                            this.setState({
                                alertProps: response.status !== 404 ? alertProps : undefined
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate classification :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"}
                    });
                }
            }).finally(() => {
                this.setState({
                    loading: false,
                    defaultClassificationResult: this.props.project.defaultClassificationResult,
                    ruleType: this.props.project.ruleType,
                    threshold: this.props.project.threshold,
                    typeOfClassifier: this.props.project.typeOfClassifier,
                    typeOfUnions: this.props.project.typeOfUnions,
                    foldDisplay: this.props.project.foldDisplay,
                    foldIndex: this.props.project.foldIndex,
                });
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

            project.defaultClassificationResult = this.state.defaultClassificationResult;
            project.ruleType = this.state.ruleType;
            project.threshold = this.state.threshold;
            project.typeOfUnions = this.state.typeOfUnions;
            project.typeOfClassifier = this.state.typeOfClassifier;
            project.foldDisplay = this.state.foldDisplay;
            project.foldIndex = this.state.foldIndex;
            project.foldNumber = this.state.foldNumber;

            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = this.state.updated;

            this.props.onTabChange(project, this.state.updated, tabsUpToDate);
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

            let msg, title = "";
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
                                displayedItems: items,
                                foldNumber: result.numberOfFolds,
                                folds: Array.from(Array(result.numberOfFolds).keys()).map(x => ++x),
                            });
                        } else {

                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + " " + result.message;
                            title = "Something went wrong! Couldn't calculate cross-validation :(";
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "warning"}
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate cross-validation :(";
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
                    msg = "Server error! Couldn't calculate cross-validation :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"}
                    });
                }
            }).finally(() => {
                if (this._isMounted) this.setState({loading: false});
            });
        });
    };

    onDefaultClassificationResultChange = (event) => {
        this.setState({
            changes: event.target.value !== "majorityDecisionClass",
            updated: this.props.project.dataUpToDate,
            defaultClassificationResult: event.target.value
        });
    };

    onRuleTypeChange = (event) => {
        this.setState({
            changes: event.target.value !== "certain",
            updated: this.props.project.dataUpToDate,
            ruleType: event.target.value
        });
    };

    onThresholdChange = (threshold) => {
        this.setState({
            changes: Boolean(threshold),
            updated: this.props.project.dataUpToDate,
            threshold: threshold
        });
    };

    onTypeOfClassifier = (event) => {
        this.setState({
            changes: event.target.value !== "SimpleRuleClassifier",
            updated: this.props.project.dataUpToDate,
            typeOfClassifier: event.target.value
        });
    };

    onTypeOfUnions = (event) => {
        this.setState({
            changes: event.target.value !== "monotonic",
            updated: this.props.project.dataUpToDate,
            typeOfUnions: event.target.value
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
        const { loading, displayedItems, foldNumber, selectedItem, openDetails, openSettings, alertProps } = this.state;
        const { defaultClassificationResult, ruleType, threshold, typeOfClassifier, typeOfUnions } = this.state;

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
                            onChange={this.onFoldNumberChange}
                            outsideLabel={"Choose number of folds"}
                            style={{maxWidth: 72}}
                            value={foldNumber}
                        />
                    </RuleWorkSmallBox>
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <TypeOfUnionsSelector
                        id={"cross-validation-union-type-selector"}
                        onChange={this.onTypeOfUnions}
                        value={typeOfUnions}
                    />
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <ThresholdSelector
                        id={"cross-validation-threshold-selector"}
                        onChange={this.onThresholdChange}
                        value={threshold}
                    />
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <TypeOfRulesSelector
                        id={"cross-validation-rule-type-selector"}
                        onChange={this.onRuleTypeChange}
                        value={ruleType}
                    />
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <TypeOfClassifierSelector
                        id={"cross-validation-classifier-type-selector"}
                        onChange={this.onTypeOfClassifier}
                        value={typeOfClassifier}
                    />
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <DefaultClassificationResultSelector
                        id={"cross-validation-default-classification-result-selector"}
                        onChange={this.onDefaultClassificationResultChange}
                        value={defaultClassificationResult}
                    />
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
                <RuleWorkAlert {...alertProps} onClose={this.onSnackbarClose} />
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