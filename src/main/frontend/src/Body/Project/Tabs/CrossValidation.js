import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import BigNumber from "bignumber.js";
import { downloadMatrix, fetchCrossValidation } from "../../../Utils/utilFunctions/fetchFunctions";
import { parseFormData } from "../../../Utils/utilFunctions/fetchFunctions/parseFormData";
import { parseCrossValidationItems } from "../../../Utils/utilFunctions/parseItems";
import { parseClassifiedListItems } from "../../../Utils/utilFunctions/parseListItems";
import { parseCrossValidationParams } from "../../../Utils/utilFunctions/parseParams";
import { parseFolds } from "../../../Utils/utilFunctions/parseFolds";
import { parseMatrix } from "../../../Utils/utilFunctions/parseMatrix";
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
import CustomBox from "../../../Utils/Containers/CustomBox";
import CustomDrawer from "../../../Utils/Containers/CustomDrawer"
import { MatrixDialog } from "../../../Utils/DataDisplay/MatrixDialog";
import StyledDivider from "../../../Utils/DataDisplay/StyledDivider";
import CustomTooltip from "../../../Utils/DataDisplay/CustomTooltip";
import { ClassifiedObjectDialog } from "../../../Utils/Feedback/DetailsDialog";
import StyledAlert from "../../../Utils/Feedback/StyledAlert";
import CustomTextField from "../../../Utils/Inputs/CustomTextField";
import { StyledIconButton } from "../../../Utils/Inputs/StyledButton";
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";
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
                numberOfFolds: 10,
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
        const { project, serverBase } = this.props;

        fetchCrossValidation(
            serverBase, project.result.id, 'GET', null
        ).then(result => {
            if (this._isMounted && result) {
                const { project: { foldIndex, settings } } = this.props

                let folds = parseFolds(result);
                let resultParams = parseCrossValidationParams(result);

                this.setState(({parameters, selected}) => ({
                    data: result,
                    folds: folds,
                    parameters: {...parameters, ...resultParams},
                    selected: { ...selected, foldIndex: foldIndex }
                }), () => {
                    const { folds, selected: { foldIndex } } = this.state;
                    let items = parseCrossValidationItems(folds[foldIndex], settings);

                    this.setState({
                        items: items,
                        displayedItems: items,
                    });
                });

                if (result.hasOwnProperty("isCurrentData")) {
                    this.props.showAlert(this.props.value, !result.isCurrentData);
                }
            }
        }).catch(error => {
            if (!error.hasOwnProperty("open")) {
                console.log(error);
            }
            if ( this._isMounted ) {
                this.setState({
                    data: null,
                    folds: null,
                    items: null,
                    displayedItems: [],
                    alertProps: error
                });
            }
        }).finally(() => {
            if ( this._isMounted ) {
                const { project: { parameters, parametersSaved, result: { informationTable: { objects }}}} = this.props;
                let { numberOfFolds, ...otherParams } = parameters;

                if (objects.length < numberOfFolds) {
                    otherParams = { ...otherParams, numberOfFolds: objects.length };
                } else {
                    otherParams = { ...otherParams, numberOfFolds: numberOfFolds };
                }

                this.setState(({parameters, selected}) => ({
                    loading: false,
                    parameters: parametersSaved ? parameters : { ...parameters, ...otherParams },
                    parametersSaved: parametersSaved,
                    selected: { ...selected, item: null }
                }));
            }
        });
    }

    componentDidMount() {
        this._isMounted = true;

        this.setState({ loading: true }, this.getCrossValidation);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /* Check if default objects name has changed */
        if (this.props.project.settings.indexOption !== prevProps.project.settings.indexOption) {
            const { folds, selected: { foldIndex } } = this.state;
            const { project } = this.props;

            this.setState({
                displayedItems: [...parseCrossValidationItems(folds[foldIndex], project.settings)]
            });
        }

        const { parameters: prevParameters } = prevState;
        const { parameters } = this.state;

        /* Check if consistency measure has changed and whether consistency threshold had boundary value */
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

        /* Check if type of rules changed to possible */
        if (prevParameters.typeOfRules !== parameters.typeOfRules && parameters.typeOfRules === "possible") {
            this.setState(({parameters}) => ({
                parameters: { ...parameters, consistencyThreshold: 0}
            }));
        }

        /* Check if project has been changed by user and save changes from previous project */
        if (prevProps.project.result.id !== this.props.project.result.id) {
            const { parametersSaved } = prevState;

            if (!parametersSaved) {
                let project = { ...prevProps.project };
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

            this.setState({ loading: true }, this.getCrossValidation);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { parametersSaved } = this.state;

        if (!parametersSaved) {
            let project = JSON.parse(JSON.stringify(this.props.project));
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
        const { project, serverBase } = this.props;
        const { parameters } = this.state;

        this.setState({
            loading: true,
        }, () => {
            let method = "PUT";
            let data = parseFormData(parameters, null);

            fetchCrossValidation(
                serverBase, project.result.id, method, data
            ).then(result => {
                if (result) {
                    if (this._isMounted) {
                        let folds = parseFolds(result);

                        this.setState(({selected}) => ({
                            data: result,
                            folds: folds,
                            parametersSaved: true,
                            selected: { ...selected, foldIndex: 0 }
                        }), () => {
                            const { folds, selected: { foldIndex } } = this.state;
                            let items = parseCrossValidationItems(folds[foldIndex], project.settings);

                            this.setState({
                                items: items,
                                displayedItems: items,
                            });
                        });
                    }
                    let projectCopy = JSON.parse(JSON.stringify(project));
                    projectCopy.result.crossValidation = result;

                    let resultParameters = parseCrossValidationParams(result);

                    projectCopy.parameters = {
                        ...projectCopy.parameters,
                        ...resultParameters,
                        typeOfUnions: projectCopy.parameters.typeOfUnions
                    };
                    projectCopy.parametersSaved = true;
                    this.props.onTabChange(projectCopy);

                    if (result.hasOwnProperty("isCurrentData")) {
                        this.props.showAlert(this.props.value, !result.isCurrentData);
                    }
                }
            }).catch(error => {
                if (!error.hasOwnProperty("open")) {
                    console.log(error);
                }
                if ( this._isMounted ) {
                    this.setState({
                        data: null,
                        folds: null,
                        items: null,
                        displayedItems: [],
                        alertProps: error
                    });
                }
            }).finally(() => {
                if ( this._isMounted ) {
                    this.setState(({selected}) => ({
                        loading: false,
                        selected: { ...selected, item: null }
                    }));
                }
            });
        });
    };

    onSaveToFile = (data) => {
        const { project, serverBase } = this.props;

        downloadMatrix(serverBase, project.result.id, data).catch(error => {
            if (!error.hasOwnProperty("open")) {
                console.log(error);
            }
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

    onSeedChange = (number) => {
        const javaLong = new BigNumber("9223372036854775807");

        const { loading } = this.state;
        const bigNumber = new BigNumber(number);

        if (!loading && !bigNumber.isNaN()) {
            if (bigNumber.isGreaterThan(javaLong)) {
                this.setState({
                    alertProps: {
                        message: "Seed shouldn't be greater than 9223372036854775807.",
                        open: true,
                        severity: "warning"
                    }
                })
                return;
            }

            this.setState(({parameters}) => ({
                parameters: { ...parameters, seed: bigNumber },
                parametersSaved: false
            }));
        }
    };

    onSeedRandomize = () => {
        const { loading } = this.state;
        const newSeed = Math.round(Math.random() * Math.pow(10, 16));

        if (!loading) {
            this.onSeedChange(newSeed);
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
        let input = event.target.value;

        if (!loading && !isNaN(input)) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, numberOfFolds: Number(input)},
                parametersSaved: false
            }));
        }
    };

    onNumberOfFoldsBlur = () => {
        this.setState(({parameters}) => {
            const { numberOfFolds } = parameters;
            const { project: { result: { informationTable: { objects }}}} = this.props;

            if (numberOfFolds > objects.length) {
                return {
                    parameters: { ...parameters, numberOfFolds: objects.length },
                    alertProps: {
                        message: "Number of folds should be less than or equal to number of objects.",
                        open: true,
                        severity: "warning"
                    }
                };
            } else if (numberOfFolds < 2 && objects.length >= 2) {
                return {
                    parameters: { ...parameters, numberOfFolds: 2 },
                    alertProps: {
                        message: "Number of folds should be greater than or equal to 2.",
                        open: true,
                        severity: "warning"
                    }
                };
            } else {
                return {
                    parameters: { ...parameters }
                };
            }
        })
    }

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
        const { loading, items } = this.state;

        if (!loading && Array.isArray(items) && items.length) {
            const filteredItems = filterFunction(event.target.value.toString(), items.slice());

            this.setState(({selected}) => ({
                displayedItems: filteredItems,
                selected: { ...selected, item: null }
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
        const { project } = this.props;

        return (
            <CustomBox id={"cross-validation"} variant={"Tab"}>
                <CustomDrawer
                    dividers={false}
                    id={"cross-validation-settings"}
                    open={open.settings}
                    onClose={() => this.toggleOpen("settings")}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfRulesSelector
                        style={{marginBottom: 16}}
                        TextFieldProps={{
                            onChange: this.onTypeOfRulesChange,
                            value: parameters.typeOfRules
                        }}
                    />
                    <TypeOfUnionsSelector
                        style={{marginBottom: 16}}
                        TextFieldProps={{
                            disabledChildren: ["standard"],
                            onChange: this.onTypeOfUnionsChange,
                            value: parameters.typeOfUnions
                        }}
                        variant={"extended"}
                    />
                    <ThresholdSelector
                        keepChanges={parameters.typeOfRules !== "possible"}
                        onChange={this.onConsistencyThresholdChange}
                        value={parameters.consistencyThreshold}
                        variant={"extended"}
                    />
                    <StyledDivider
                        color={"secondary"}
                        flexItem={true}
                        margin={16}
                        orientation={"horizontal"}
                        style={{height: 1}}
                    />
                    <TypeOfClassifierSelector
                        style={{marginBottom: 16}}
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
                    <StyledDivider
                        color={"secondary"}
                        flexItem={true}
                        margin={16}
                        orientation={"horizontal"}
                        style={{height: 1}}
                    />
                    <SeedSelector
                        randomizeSeed={this.onSeedRandomize}
                        style={{marginBottom: 16}}
                        TextFieldProps={{
                            onChange: event => this.onSeedChange(event.target.value),
                            value: parameters.seed
                        }}
                    />
                    <NumberOfFoldsSelector
                        TextFieldProps={{
                            onChange: this.onNumberOfFoldsChange,
                            onBlur: this.onNumberOfFoldsBlur,
                            value: parameters.numberOfFolds
                        }}
                    />
                </CustomDrawer>
                <CustomBox customScrollbar={true} id={"cross-validation-content"} variant={"TabBody"}>
                    <CustomHeader id={"cross-validation-header"} paperRef={this.upperBar}>
                        <SettingsButton onClick={() => this.toggleOpen("settings")} />
                        <StyledDivider margin={16} />
                        <CustomTooltip
                            disableMaxWidth={true}
                            title={"Click on settings button on the left to customize parameters"}
                        >
                            <CalculateButton
                                aria-label={"cross-validation-calculate-button"}
                                disabled={loading}
                                onClick={this.onCalculateClick}
                            />
                        </CustomTooltip>
                        <StyledDivider margin={16} />
                        {Array.isArray(folds) && Boolean(folds.length) &&
                            <Fragment>
                                {/* Part regarding all folds */}
                                <p id={"all-folds"} style={{margin: "0 16px 0 0", fontSize: "1.15rem"}}>All folds:</p>
                                <MatrixButton
                                    onClick={() => this.toggleOpen("matrixMean")}
                                    title={"Show mean ordinal misclassification matrix"}
                                />
                                <CustomTooltip title={"Show accumulated ordinal misclassification matrix"}>
                                    <StyledIconButton
                                        aria-label={"sum-matrix-button"}
                                        color={"secondary"}
                                        onClick={() => this.toggleOpen("matrixSum")}
                                    >
                                        <Sigma />
                                    </StyledIconButton>
                                </CustomTooltip>
                                <StyledDivider margin={16} />
                                {/* Part regarding specific fold */}
                                <CustomTextField
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
                                </CustomTextField>
                                <p id={"fold-colon"} style={{margin: "0 16px 0 4px", fontSize: "1.15rem"}}>:</p>
                                <MatrixButton
                                    onClick={() => this.toggleOpen("matrixFold")}
                                    title={`Open ordinal misclassification matrix for fold ${selected.foldIndex + 1}`}
                                />
                            </Fragment>
                        }
                        <span style={{flexGrow: 1}} />
                        <FilterTextField onChange={this.onFilterChange} />
                    </CustomHeader>
                    <TabBody
                        content={parseClassifiedListItems(displayedItems)}
                        id={"cross-validation-list"}
                        isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                        isLoading={loading}
                        ListProps={{
                            onItemSelected: this.onItemSelected
                        }}
                        ListSubheaderProps={{
                            style: this.upperBar.current ? { top: this.upperBar.current.offsetHeight } : undefined
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
                    {Array.isArray(folds) && Boolean(folds.length) && selected.item !== null &&
                        <ClassifiedObjectDialog
                            informationTable={folds[selected.foldIndex].trainingTable}
                            item={selected.item}
                            onClose={() => this.toggleOpen("details")}
                            open={open.details}
                            ruleSet={folds[selected.foldIndex].ruleSet}
                            settings={project.settings}
                        />
                    }
                    {data !== null &&
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
                                        tooltip={"Go to accumulated ordinal misclassification matrix"}
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
                    {data !== null &&
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
                                        tooltip={"Download accumulated matrix (txt)"}
                                    />
                                    <span aria-label={"sum matrix title"} style={{paddingLeft: 8}}>
                                        Accumulated ordinal misclassification matrix and details
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
                </CustomBox>
                <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />
            </CustomBox>
        )
    }
}

CrossValidation.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    showAlert: PropTypes.func,
    value: PropTypes.number
};

export default CrossValidation;