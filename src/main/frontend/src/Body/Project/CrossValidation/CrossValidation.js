import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { createFormData, fetchCrossValidation, parseCrossValidationParams } from "../Utils/fetchFunctions";
import { parseCrossValidationFolds, parseCrossValidationItems, parseCrossValidationListItems } from "../Utils/parseData";
import { parseMatrix } from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import MatrixButton from "../Utils/Buttons/MatrixButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import DefaultClassificationResultSelector from "../Utils/Calculations/DefaultClassificationResultSelector";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import TypeOfClassifierSelector from "../Utils/Calculations/TypeOfClassifierSelector";
import TypeOfRulesSelector from "../Utils/Calculations/TypeOfRulesSelector";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import MatrixDialog from "../../../RuleWorkComponents/DataDisplay/MatrixDialog";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import { CrossValidationDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog";
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";

class CrossValidation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
            folds: null,
            items: null,
            displayedItems: [],
            parameters: {
                consistencyThreshold: 0,
                defaultClassificationResult: "majorityDecisionClass",
                numberOfFolds: 2,
                typeOfClassifier: "SimpleRuleClassifier",
                typeOfRules: "certain",
                typeOfUnions: "monotonic",
            },
            parametersSaved: true,
            selected: {
                foldIndex: 0,
                item: null,
            },
            open: {
                details: false,
                matrixGlobal: false,
                matrixFold: false,
                settings: false,
            },
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;

        this.setState({
            loading: true,
        }, () => {
            const { project } = this.props;

            fetchCrossValidation(
                project.result.id, 'GET', null, 404
            ).then(result => {
                if (this._isMounted && result) {
                    const { project: { parametersSaved, settings } } = this.props

                    let folds = parseCrossValidationFolds(result);
                    let resultParams = parseCrossValidationParams(result);

                    this.setState(({parameters}) => ({
                        data: result,
                        folds: folds,
                        parameters: {...parameters, ...resultParams},
                        parametersSaved: parametersSaved
                    }), () => {
                        const { folds, selected: { foldIndex } } = this.state;
                        let items = parseCrossValidationItems(folds[foldIndex], settings);

                        this.setState({
                            items: items,
                            displayedItems: items,
                        });
                    });
                }
            }).catch(error => {
                if ( this._isMounted ) {
                    this.setState({alertProps: error});
                }
            }).finally(() => {
                if ( this._isMounted ) {
                    const { parametersSaved } = this.state;
                    const { project: { parameters: propsParameters } } = this.props;

                    this.setState(({parameters}) => ({
                        loading: false,
                        parameters: parametersSaved ? parameters : { ...parameters, ...propsParameters }
                    }));
                }
            });
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.project.settings.indexOption !== prevProps.project.settings.indexOption) {
            const { folds, selected: { foldIndex } } = this.state;
            const { project } = this.props;

            this.setState({
                displayedItems: [...parseCrossValidationItems(folds[foldIndex], project.settings)]
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { parametersSaved } = this.state;

        if (!parametersSaved) {
            let project = {...this.props.project};
            const { parameters, selected: { foldIndex } } = this.state;

            project.parameters = { ...project.parameters, ...parameters }
            project.parametersSaved = parametersSaved;
            project.foldIndex = foldIndex;
            this.props.onTabChange(project);
        }
    }

    onCalculateClick = () => {
        this.setState({
            loading: true,
        }, () => {
            let project = {...this.props.project};
            const { parameters } = this.state;

            let method = project.dataUpToDate ? "PUT" : "POST";
            let data = createFormData(parameters, project);

            fetchCrossValidation(
                project.result.id, method, data, []
            ).then(result => {
                if (result) {
                    if (this._isMounted) {
                        let folds = parseCrossValidationFolds(result);

                        this.setState({
                            data: result,
                            folds: folds,
                            parametersSaved: true
                        }, () => {
                            const { folds, selected: { foldIndex } } = this.state;
                            let items = parseCrossValidationItems(folds[foldIndex], project.settings);

                            this.setState({
                                items: items,
                                displayedItems: items,
                            });
                        });
                    }

                    project.result.crossValidation = result;
                    project.dataUpToDate = true;
                    project.tabsUpToDate[this.props.value] = true;

                    let resultParameters = parseCrossValidationParams(result);
                    project.parameters = { ...project.parameters, ...resultParameters };
                    project.parametersSaved = true;
                    this.props.onTabChange(project);
                }

            }).catch(error => {
                if ( this._isMounted ) {
                    this.setState({alertProps: error});
                }
            }).finally(() => {
                if ( this._isMounted ) {
                    this.setState({loading: false});
                }
            });
        });
    };

    toggleOpen = (name) => {
        this.setState(({open}) => ({
            open: {...open, [name]: !open[name]}
        }));
    };

    onItemSelected = (index) => {
        this.setState(({items, open, selected}) => ({
            open: {...open, details: true, settings: false},
            selected: {...selected, item: items[index]}
        }));
    };

    onDefaultClassificationResultChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, defaultClassificationResult: event.target.value},
                parametersSaved: false
            }));
        }
    };

    onTypeOfRulesChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, typeOfRules: event.target.value},
                parametersSaved: false
            }));
        }
    };

    onConsistencyThresholdChange = (threshold) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, consistencyThreshold: threshold},
                parametersSaved: false
            }));
        }
    };

    onTypeOfClassifierChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, typeOfClassifier: event.target.value},
                parametersSaved: false
            }));
        }
    };

    onTypeOfUnionsChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, typeOfUnions: event.target.value},
                parametersSaved: false
            }));
        }
    };

    onNumberOfFoldsChange = (event) => {
        const { loading } = this.state;
        const input = event.target.value;

        if (!loading && !isNaN(input)) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, numberOfFolds: Number(input)},
                parametersSaved: false
            }));
        }
    };

    onFoldIndexChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            const { project } = this.props;
            this.setState(({ selected }) => ({
                selected: {...selected, foldIndex: Number(event.target.value)},
                parametersSaved: false
            }), () => {
                const { folds, selected: { foldIndex }} = this.state;
                let items = parseCrossValidationItems(folds[foldIndex], project.settings);

                this.setState({
                    items: items,
                    displayedItems: items,
                });
            });
        }
    };

    onFilterChange = (event) => {
        const { loading } = this.state;

        if (!loading) {
            const { items } = this.state;
            const filteredItems = filterFunction(event.target.value.toString(), items.slice());

            this.setState(({selected}) => ({
                displayedItems: filteredItems,
                selected: {...selected, item: null}
            }));
        }
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    render() {
        const { alertProps, data, folds, displayedItems, loading, open, parameters, selected } = this.state;

        return (
            <RuleWorkBox id={"rule-work-cross-validation"} styleVariant={"tab"}>
                <StyledPaper id={"cross-validation-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"cross-validation-settings-button"}
                        onClick={() => this.toggleOpen("settings")}
                        title={"Click to customize parameters"}
                    />
                    <StyledDivider />
                    <RuleWorkTooltip title={`Current number of folds: ${parameters.numberOfFolds}`}>
                        <CalculateButton
                            aria-label={"cross-validation-calculate-button"}
                            disabled={loading}
                            onClick={this.onCalculateClick}
                        />
                    </RuleWorkTooltip>
                    <StyledDivider />
                    {Array.isArray(folds) && Boolean(folds.length) &&
                        <Fragment>
                            <p id={"all-folds"} style={{margin: "0 16px 0 0", fontSize: "1.15rem"}}>All folds:</p>
                            <MatrixButton
                                onClick={() => this.toggleOpen("matrixGlobal")}
                                title={"Show ordinal misclassification matrix for all folds"}
                            />
                            <StyledDivider />
                            <RuleWorkTextField
                                onChange={this.onFoldIndexChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment>
                                            Fold:
                                        </InputAdornment>
                                    )
                                }}
                                select={true}
                                value={selected.foldIndex}
                            >
                                {folds.map((fold, index) => (
                                    <MenuItem key={index} value={fold.index}>
                                        {fold.index + 1}
                                    </MenuItem>
                                ))}
                            </RuleWorkTextField>
                            <p id={"fold-colon"} style={{margin: "0 16px 0 4px", fontSize: "1.15rem"}}>:</p>
                            <MatrixButton
                                onClick={() => this.toggleOpen("matrixFold")}
                                title={`Open ordinal misclassification matrix for fold ${selected.foldIndex + 1}`}
                            />
                        </Fragment>
                    }
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkDrawer
                    id={"cross-validation-settings"}
                    open={open.settings}
                    onClose={() => this.toggleOpen("settings")}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <RuleWorkSmallBox id={"fold-number-selector"} >
                        <RuleWorkTextField
                            onChange={this.onNumberOfFoldsChange}
                            outsideLabel={"Choose number of folds"}
                            style={{maxWidth: 72}}
                            value={parameters.numberOfFolds}
                        />
                    </RuleWorkSmallBox>
                    <TypeOfUnionsSelector
                        id={"cross-validation-union-type-selector"}
                        onChange={this.onTypeOfUnionsChange}
                        value={parameters.typeOfUnions}
                    />
                    <ThresholdSelector
                        id={"cross-validation-threshold-selector"}
                        onChange={this.onConsistencyThresholdChange}
                        value={parameters.consistencyThreshold}
                    />
                    <TypeOfRulesSelector
                        id={"cross-validation-rule-type-selector"}
                        onChange={this.onTypeOfRulesChange}
                        value={parameters.typeOfRules}
                    />
                    <TypeOfClassifierSelector
                        id={"cross-validation-classifier-type-selector"}
                        onChange={this.onTypeOfClassifierChange}
                        value={parameters.typeOfClassifier}
                    />
                    <DefaultClassificationResultSelector
                        id={"cross-validation-default-classification-result-selector"}
                        onChange={this.onDefaultClassificationResultChange}
                        value={parameters.defaultClassificationResult}
                    />
                </RuleWorkDrawer>
                <TabBody
                    content={parseCrossValidationListItems(displayedItems)}
                    id={"cross-validation-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onItemSelected
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Fold:",
                            value: selected.foldIndex + 1
                        },
                        {
                            label: "Number of objects:",
                            value: displayedItems && displayedItems.length
                        },
                        {
                            label: "Total number of rules:",
                            value: folds && folds[selected.foldIndex].ruleSet.length
                        }
                    ]}
                />
                {selected.item &&
                    <CrossValidationDialog
                        item={selected.item}
                        onClose={() => this.toggleOpen("details")}
                        open={open.details}
                        ruleSet={folds[selected.foldIndex].ruleSet}
                    />
                }
                {data &&
                    <MatrixDialog
                        disableDeviation={false}
                        matrix={parseMatrixTraits(data.meanOrdinalMisclassificationMatrix)}
                        onClose={() => this.toggleOpen("matrixGlobal")}
                        open={open.matrixGlobal}
                        title={"Mean ordinal misclassification matrix, it's deviation and details"}
                    />
                }
                {Array.isArray(folds) && Boolean(folds.length) &&
                    <MatrixDialog
                        matrix={
                            parseMatrixTraits(
                                folds[selected.foldIndex].classificationValidationTable.ordinalMisclassificationMatrix
                            )
                        }
                        onClose={() => this.toggleOpen("matrixFold")}
                        open={open.matrixFold}
                        title={`Fold ${selected.foldIndex + 1}: Ordinal misclassification matrix, it's deviation and details`}
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