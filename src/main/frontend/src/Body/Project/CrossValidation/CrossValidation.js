import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
    createFormData,
    downloadMatrix,
    fetchCrossValidation,
    parseCrossValidationParams
} from "../Utils/fetchFunctions";
import {
    parseMatrix,
    parseCrossValidationFolds,
    parseCrossValidationItems,
    parseCrossValidationListItems
} from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import MatrixButton from "../Utils/Buttons/MatrixButton";
import MatrixDownloadButton from "../Utils/Buttons/MatrixDownloadButton";
import MatrixSwapButton from "../Utils/Buttons/MatrixSwapButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import DefaultClassificationResultSelector from "../Utils/Calculations/DefaultClassificationResultSelector";
import NumberOfFoldsSelector from "../Utils/Calculations/NumberOfFoldsSelector";
import SeedSelector from "../Utils/Calculations/SeedSelector";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import TypeOfClassifierSelector from "../Utils/Calculations/TypeOfClassifierSelector";
import TypeOfRulesSelector from "../Utils/Calculations/TypeOfRulesSelector";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import { MatrixDialog } from "../../../RuleWorkComponents/DataDisplay/MatrixDialog";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import { CrossValidationDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog";
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Sigma from "mdi-material-ui/Sigma";

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
                seed: 0,
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
                matrixMean: false,
                matrixSum: false,
                matrixFold: false,
                settings: false,
            },
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    getCrossValidation = () => {
        const { project } = this.props;

        fetchCrossValidation(
            project.result.id, 'GET', null
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
                this.setState(({selected}) => ({
                    data: null,
                    folds: null,
                    items: null,
                    displayedItems: [],
                    selected: { ...selected, item: null },
                    alertProps: error
                }));
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
    }

    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getCrossValidation);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.project.settings.indexOption !== prevProps.project.settings.indexOption) {
            const { folds, selected: { foldIndex } } = this.state;
            const { project } = this.props;

            this.setState({
                displayedItems: [...parseCrossValidationItems(folds[foldIndex], project.settings)]
            });
        }

        const { parameters: prevParameters } = prevState;
        const { parameters } = this.state;

        if (parameters.typeOfUnions !== "monotonic") {
            if (parameters.consistencyThreshold === 1) {
                this.setState(({parameters}) => ({
                    parameters: { ...parameters, consistencyThreshold: 0, typeOfUnions: "monotonic" }
                }))
            } else {
                this.setState(({parameters}) => ({
                    parameters: { ...parameters, typeOfUnions: "monotonic" }
                }));
            }
        }

        if (prevParameters.typeOfRules !== parameters.typeOfRules && parameters.typeOfRules === "possible") {
            this.setState(({parameters}) => ({
                parameters: { ...parameters, consistencyThreshold: 0}
            }));
        }

        if (prevProps.project.result.id !== this.props.project.result.id) {
            this.setState({ loading: true }, this.getCrossValidation);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { parametersSaved } = this.state;

        if (!parametersSaved) {
            let project = {...this.props.project};
            const { parameters, selected: { foldIndex } } = this.state;

            project.parameters = {
                ...project.parameters,
                ...parameters,
                typeOfUnions: project.parameters.typeOfUnions
            };
            project.parametersSaved = parametersSaved;
            project.foldIndex = foldIndex;
            this.props.onTabChange(project);
        }
    }

    onCalculateClick = () => {
        this.setState({
            loading: true,
        }, () => {
            let project = { ...this.props.project };
            const { parameters } = this.state;

            let method = project.dataUpToDate ? "PUT" : "POST";
            let files =  {
                metadata: JSON.stringify(project.result.informationTable.attributes),
                data: JSON.stringify(project.result.informationTable.objects)
            };
            let data = createFormData(parameters, project.dataUpToDate ? null : files);

            fetchCrossValidation(
                project.result.id, method, data
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

                    project.parameters = {
                        ...project.parameters,
                        ...resultParameters,
                        typeOfUnions: project.parameters.typeOfUnions
                    };
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

    onSaveToFile = (data) => {
        const { project } = this.props;

        downloadMatrix( project.result.id, data ).catch(error => {
            if (this._isMounted) {
                this.setState({ alertProps: error });
            }
        });
    };

    toggleOpen = (name) => {
        this.setState(({open}) => ({
            open: {...open, [name]: !open[name]}
        }));
    };

    swapMatrix = (from, to) => {
       this.setState(({open}) => ({
           open: { ...open, [from]: false }
       }), () => {
           this.setState(({open}) => ({
               open: { ...open, [to]: true }
           }));
       });
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

    onSeedChange = (event) => {
        const { loading } = this.state;
        const input = event.target.value;

        if (!loading && !isNaN(input)) {
            this.setState(({parameters}) => ({
                parameters: { ...parameters, seed: input },
                parametersSaved: false
            }));
        }
    };

    onSeedRandomize = () => {
        const { loading } = this.state;
        const newSeed = Math.round(Math.random() * Math.pow(10, 16));

        if (!loading) {
            this.setState(({parameters}) => ({
                parameters: { ...parameters, seed: newSeed },
                parametersSaved: false
            }));
        }
    }

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
                    <StyledDivider margin={16} />
                    <RuleWorkTooltip title={`Current number of folds: ${parameters.numberOfFolds}`}>
                        <CalculateButton
                            aria-label={"cross-validation-calculate-button"}
                            disabled={loading}
                            onClick={this.onCalculateClick}
                        />
                    </RuleWorkTooltip>
                    <StyledDivider margin={16} />
                    {Array.isArray(folds) && Boolean(folds.length) &&
                        <Fragment>
                            {/* Part regarding all folds */}
                            <p id={"all-folds"} style={{margin: "0 16px 0 0", fontSize: "1.15rem"}}>All folds:</p>
                            <MatrixButton
                                onClick={() => this.toggleOpen("matrixMean")}
                                title={"Show mean ordinal misclassification matrix"}
                            />
                            <RuleWorkTooltip title={"Show sum ordinal misclassification matrix"}>
                                <StyledButton
                                    aria-label={"sum-matrix-button"}
                                    isIcon={true}
                                    onClick={() => this.toggleOpen("matrixSum")}
                                    themeVariant={"secondary"}
                                >
                                    <Sigma />
                                </StyledButton>
                            </RuleWorkTooltip>
                            <StyledDivider margin={16} />
                            {/* Part regarding specific fold */}
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
                    <TypeOfRulesSelector
                        TextFieldProps={{
                            onChange: this.onTypeOfRulesChange,
                            value: parameters.typeOfRules
                        }}
                    />
                    <TypeOfUnionsSelector
                        TextFieldProps={{
                            disabledChildren: ["standard"],
                            onChange: this.onTypeOfUnionsChange,
                            value: parameters.typeOfUnions
                        }}
                    />
                    <ThresholdSelector
                        keepChanges={parameters.typeOfRules !== "possible"}
                        onChange={this.onConsistencyThresholdChange}
                        value={parameters.consistencyThreshold}
                    />
                    <TypeOfClassifierSelector
                        TextFieldProps={{
                            onChange: this.onTypeOfClassifierChange,
                            value: parameters.typeOfClassifier
                        }}
                    />
                    <DefaultClassificationResultSelector
                        TextFieldProps={{
                            onChange: this.onDefaultClassificationResultChange,
                            value: parameters.defaultClassificationResult
                        }}
                    />
                    <SeedSelector
                        randomizeSeed={this.onSeedRandomize}
                        TextFieldProps={{
                            onChange: this.onSeedChange,
                            value: parameters.seed
                        }}
                    />
                    <NumberOfFoldsSelector
                        TextFieldProps={{
                            onChange: this.onNumberOfFoldsChange,
                            value: parameters.numberOfFolds
                        }}
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
                            label: "Training objects:",
                            value: folds && folds[selected.foldIndex].numberOfLearningObjects
                        },
                        {
                            label: "Rules:",
                            value: folds && folds[selected.foldIndex].ruleSet.length
                        },
                        {
                            label: "Test objects:",
                            value: folds && folds[selected.foldIndex].numberOfTestObjects,
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
                        matrix={parseMatrix(data.meanOrdinalMisclassificationMatrix)}
                        onClose={() => this.toggleOpen("matrixMean")}
                        open={open.matrixMean}
                        saveMatrix={() => this.onSaveToFile({ typeOfMatrix: "crossValidationMean" })}
                        subheaders={
                            folds[selected.foldIndex].classificationValidationTable.decisionsDomain
                        }
                        title={
                            <React.Fragment>
                                <MatrixSwapButton
                                    onSwap={() => this.swapMatrix("matrixMean", "matrixSum")}
                                    tooltip={"Go to sum ordinal misclassification matrix"}
                                />
                                <MatrixDownloadButton
                                    onSave={() => this.onSaveToFile({ typeOfMatrix: "crossValidationMean" })}
                                    tooltip={"Download mean matrix (txt)"}
                                />
                                <span aria-label={"mean matrix title"} style={{paddingLeft: 8}}>
                                    Mean ordinal misclassification matrix, deviations and details
                                </span>
                            </React.Fragment>
                        }
                    />
                }
                {data &&
                    <MatrixDialog
                        matrix={parseMatrix(data.sumOrdinalMisclassificationMatrix)}
                        onClose={() => this.toggleOpen("matrixSum")}
                        open={open.matrixSum}
                        saveMatrix={() => this.onSaveToFile({ typeOfMatrix: "crossValidationSum" })}
                        subheaders={
                            folds[selected.foldIndex].classificationValidationTable.decisionsDomain
                        }
                        title={
                            <React.Fragment>
                                <MatrixSwapButton
                                    onSwap={() => this.swapMatrix("matrixSum", "matrixMean")}
                                    tooltip={"Go to mean ordinal misclassification matrix"}
                                />
                                <MatrixDownloadButton
                                    onSave={() => this.onSaveToFile({ typeOfMatrix: "crossValidationSum" })}
                                    tooltip={"Download sum matrix (txt)"}
                                />
                                <span aria-label={"sum matrix title"} style={{paddingLeft: 8}}>
                                    Sum ordinal misclassification matrix and details
                                </span>
                            </React.Fragment>

                        }
                    />
                }
                {Array.isArray(folds) && Boolean(folds.length) &&
                    <MatrixDialog
                        matrix={
                            parseMatrix(
                                folds[selected.foldIndex].classificationValidationTable.ordinalMisclassificationMatrix
                            )
                        }
                        onClose={() => this.toggleOpen("matrixFold")}
                        open={open.matrixFold}
                        saveMatrix={() => {
                            this.onSaveToFile({
                                typeOfMatrix: "crossValidationFold",
                                numberOfFold: selected.foldIndex
                            });
                        }}
                        subheaders={
                            folds[selected.foldIndex].classificationValidationTable.decisionsDomain
                        }
                        title={
                            <React.Fragment>
                                <MatrixDownloadButton
                                    onSave={() => {
                                        this.onSaveToFile({
                                            typeOfMatrix: "crossValidationFold",
                                            numberOfFold: selected.foldIndex
                                        });
                                    }}
                                    tooltip={`Download fold ${selected.foldIndex + 1} matrix (txt)`}
                                />
                                <span aria-label={"fold matrix title"} style={{paddingLeft: 8}}>
                                    {`Fold ${selected.foldIndex + 1}: Ordinal misclassification matrix  and details`}
                                </span>
                            </React.Fragment>
                        }
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