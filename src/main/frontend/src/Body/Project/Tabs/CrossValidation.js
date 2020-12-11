import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import BigNumber from "bignumber.js";
import { fetchCrossValidation, fetchFold, downloadMatrix } from "../../../Utils/utilFunctions/fetchFunctions";
import { parseFormData } from "../../../Utils/utilFunctions/fetchFunctions/parseFormData";
import { getItemName, parseClassifiedItems } from "../../../Utils/utilFunctions/parseItems";
import { parseClassifiedListItems } from "../../../Utils/utilFunctions/parseListItems";
import { parseCrossValidationParams } from "../../../Utils/utilFunctions/parseParams";
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
import MatrixDialog from "../../../Utils/Dialogs/MatrixDialog";
import StyledDivider from "../../../Utils/DataDisplay/StyledDivider";
import CustomTooltip from "../../../Utils/DataDisplay/CustomTooltip";
import { ClassifiedObjectDialog } from "../../../Utils/Dialogs/DetailsDialog";
import StyledAlert from "../../../Utils/Feedback/StyledAlert";
import CustomTextField from "../../../Utils/Inputs/CustomTextField";
import { StyledIconButton } from "../../../Utils/Inputs/StyledButton";
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Sigma from "mdi-material-ui/Sigma";
import {AttributesMenu} from "../../../Utils/Menus/AttributesMenu";

/**
 * The cross-validation tab in RuLeStudio.
 * Presents the outcome of cross-validation for information table from current project.
 *
 * @class
 * @category Tabs
 * @subcategory Tabs
 * @param {Object} props
 * @param {string} props.objectGlobalName - The global visible object name used by all tabs as reference.
 * @param {function} props.onTabChange - Callback fired when a tab is changed and there are unsaved changes in this tab.
 * @param {Object} props.project - Current project.
 * @param {string} props.serverBase - The host and port in the URL of an API call.
 * @param {function} props.showAlert - Callback fired when results in this tab are based on outdated information table.
 * @param {number} props.value - The index of a selected tab.
 * @returns {React.Component}
 */
class CrossValidation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: {
                crossValidation: false,
                selectedFold: false,
            },
            folds: null,
            foldData: null,
            items: null,
            displayedItems: [],
            parameters: {
                consistencyThreshold: 0,
                defaultClassificationResultType: "majorityDecisionClass",
                numberOfFolds: 10,
                seed: 0,
                classifierType: "SimpleRuleClassifier",
                typeOfRules: "certain",
                typeOfUnions: "monotonic",
            },
            parametersSaved: true,
            refreshNeeded: {
                matrixMean: false,
                matrixSum: false,
                matrixFold: false
            },
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
            attributesMenuEl: null,
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    getFold = (foldIndex, finallyCallback) => {
        this.setState(({loading}) => ({
            loading: { ...loading, selectedFold: true }
        }), () => {
            const { project: { id: projectId }, serverBase } = this.props;
            const pathParams = { projectId, foldIndex };

            fetchFold(
                pathParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null && result.hasOwnProperty("Objects")
                    && result.hasOwnProperty("objectNames")) {

                    const items = parseClassifiedItems(result.Objects, result.objectNames)

                    this.setState({
                        foldData: result,
                        items: items,
                        displayedItems: items
                    });
                }
            }).catch(exception => {
                this.onSnackbarOpen(exception, () => {
                    if (this._isMounted) {
                        this.setState({
                            foldData: null,
                            items: null,
                            displayedItems: []
                        });
                    }
                });
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, selectedFold: false }
                    }), () => {
                        if (typeof finallyCallback === "function") finallyCallback();
                    });
                }
            });
        });
    }

    generateFoldNames = (numberOfFolds) => {
        return Array.from(Array(numberOfFolds).keys()).map(number => number + 1);
    }

    /**
     * Makes an API call on cross-validation to receive current copy of cross-validation from server.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf CrossValidation
     */
    getCrossValidation = () => {
        const { project, serverBase } = this.props;
        const pathParams = { projectId: project.id }
        const method = "GET";

        fetchCrossValidation(
            pathParams, method, null, serverBase
        ).then(result => {
            if (this._isMounted && result != null) {
                const { project: { foldIndex } } = this.props;
                const resultParams = result.hasOwnProperty("parameters") ?
                    parseCrossValidationParams(result.parameters) : { };
                const folds = resultParams.hasOwnProperty("numberOfFolds") ?
                    this.generateFoldNames(resultParams.numberOfFolds) : [];

                this.setState(({parameters, selected}) => ({
                    folds: folds,
                    parameters: { ...parameters, ...resultParams },
                    selected: { ...selected, foldIndex: foldIndex }
                }), () => {
                    const { selected: { foldIndex }} = this.state;
                    this.getFold(foldIndex);
                });

                if (result.hasOwnProperty("isCurrentData")) {
                    const messages = result.hasOwnProperty("errorMessages") ?
                        result.errorMessages : null;
                    this.props.showAlert(this.props.value, !result.isCurrentData, messages);
                }
            }
        }).catch(exception => {
            this.onSnackbarOpen(exception, () => {
                if ( this._isMounted ) {
                    this.setState({
                        items: null,
                        displayedItems: []
                    });
                }
            });
        }).finally(() => {
            if ( this._isMounted ) {
                const { project: { parameters: savedParameters, parametersSaved }} = this.props;

                this.setState(({loading, parameters, selected}) => ({
                    loading: { ...loading, crossValidation: false },
                    parameters: parametersSaved ? parameters : { ...savedParameters },
                    parametersSaved: parametersSaved,
                    selected: { ...selected, item: null }
                }));
            }
        });
    }

    /**
     * A component's lifecycle method. Fired once when component was mounted.
     * <br>
     * <br>
     * Method calls {@link getCrossValidation}.
     *
     * @function
     * @memberOf CrossValidation
     */
    componentDidMount() {
        this._isMounted = true;

        this.setState(({loading}) => ({
            loading: { ...loading, crossValidation: true }
        }), this.getCrossValidation);
    }

    /**
     * A component's lifecycle method. Fired after a component was updated.
     * <br>
     * <br>
     * If index option was changed, method sets object's names according to new value.
     * <br>
     * <br>
     * If type of unions was changed to <code>monotonic</code> and consistency threshold is equal to 1,
     * method changes value of threshold to 0.
     * <br>
     * <br>
     * If type of rules was changed to <code>possible</code>, method changes consistency threshold to 0.
     * <br>
     * <br>
     * If project was changed, method saves changes from previous project
     * and calls {@link getCrossValidation} to receive the latest copy of cross-validation.
     *
     * @function
     * @memberOf CrossValidation
     * @param {Object} prevProps - Old props that were already replaced.
     * @param {Object} prevState - Old state that was already replaced.
     * @param {Object} snapshot - Returned from another lifecycle method <code>getSnapshotBeforeUpdate</code>. Usually undefined.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
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
        if (prevProps.project.id !== this.props.project.id) {
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

            this.setState(({loading}) => ({
                loading: { ...loading, crossValidation: true }
            }), this.getCrossValidation);
        }
    }

    /**
     * A component's lifecycle method. Fired when component was requested to be unmounted.
     * <br>
     * <br>
     * Method saves changes from current project.
     *
     * @function
     * @memberOf CrossValidation
     */
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

    /**
     * Makes an API call on cross-validation to cross-validate objects from current information table
     * with selected parameters.
     * Then, updates state and makes necessary changes in display.
     *
     * @function
     * @memberOf CrossValidation
     */
    onCalculateClick = () => {
        const { project, serverBase } = this.props;
        const { parameters } = this.state;

        this.setState(({loading}) => ({
            loading: { ...loading, crossValidation: true },
        }), () => {
            const pathParams = { projectId: project.id };
            const method = "PUT";
            const data = parseFormData(parameters, null);

            fetchCrossValidation(
                pathParams, method, data, serverBase
            ).then(result => {
                if (result) {
                    const resultParams = result.hasOwnProperty("parameters") ?
                        parseCrossValidationParams(result.parameters) : { };
                    const folds = resultParams.hasOwnProperty("numberOfFolds") ?
                        this.generateFoldNames(resultParams.numberOfFolds) : [];

                    if (this._isMounted) {
                        this.setState(({selected}) => ({
                            folds: folds,
                            parametersSaved: true,
                            refreshNeeded: {
                                matrixMean: true,
                                matrixSum: true,
                                matrixFold: true
                            },
                            selected: { ...selected, foldIndex: 0 }
                        }), () => {
                            const { selected: { foldIndex }} = this.state;
                            this.getFold(foldIndex);
                        });
                    }

                    const projectCopy = JSON.parse(JSON.stringify(project));
                    projectCopy.parameters = {
                        ...projectCopy.parameters,
                        ...resultParams,
                        typeOfUnions: projectCopy.parameters.typeOfUnions
                    };
                    projectCopy.parametersSaved = true;
                    this.props.onTabChange(projectCopy);

                    if (result.hasOwnProperty("isCurrentData")) {
                        const messages = result.hasOwnProperty("errorMessages") ?
                            result.errorMessages : null;
                        this.props.showAlert(this.props.value, !result.isCurrentData, messages);
                    }
                }
            }).catch(exception => {
                this.onSnackbarOpen(exception, () => {
                    if (this._isMounted) {
                        this.setState({
                            items: null,
                            displayedItems: []
                        });
                    }
                });
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading, selected}) => ({
                        loading: { ...loading, crossValidation: false },
                        selected: { ...selected, item: null }
                    }));
                }
            });
        });
    };

    /**
     * Makes an API call to download specified misclassification matrix.
     *
     * @function
     * @memberOf CrossValidation
     * @param {Object} queryParams - Specifies the type of a matrix to downloaded.
     */
    onSaveToFile = (queryParams) => {
        const { project, serverBase } = this.props;
        const pathParams = { projectId: project.id };

        downloadMatrix(pathParams, queryParams, serverBase)
            .catch(this.onSnackbarOpen);
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
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        this.setState(({parameters}) => ({
            parameters: {...parameters, defaultClassificationResultType: event.target.value},
            parametersSaved: false
        }));
    };

    onSeedChange = (number) => {
        const { loading } = this.state;
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        const javaLong = new BigNumber("9223372036854775807");
        const bigNumber = new BigNumber(number);

        if (!bigNumber.isNaN()) {
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
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        const newSeed = Math.round(Math.random() * Math.pow(10, 16));
        this.onSeedChange(newSeed);
    };

    onTypeOfRulesChange = (event) => {
        const { loading } = this.state;
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        this.setState(({parameters}) => ({
            parameters: {...parameters, typeOfRules: event.target.value},
            parametersSaved: false
        }));
    };

    onConsistencyThresholdChange = (threshold) => {
        const { loading } = this.state;
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        this.setState(({parameters}) => ({
            parameters: {...parameters, consistencyThreshold: threshold},
            parametersSaved: false
        }));
    };

    onTypeOfClassifierChange = (event) => {
        const { loading } = this.state;
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        this.setState(({parameters}) => ({
            parameters: {...parameters, classifierType: event.target.value},
            parametersSaved: false
        }));
    };

    onTypeOfUnionsChange = (event) => {
        const { loading } = this.state;
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        this.setState(({parameters}) => ({
            parameters: {...parameters, typeOfUnions: event.target.value},
            parametersSaved: false
        }));
    };

    onNumberOfFoldsChange = (event) => {
        const { loading } = this.state;
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        const input = event.target.value;

        if (!isNaN(input)) {
            this.setState(({parameters}) => ({
                parameters: {...parameters, numberOfFolds: Number(input)},
                parametersSaved: false
            }));
        }
    };

    onFoldIndexChange = (event) => {
        const { loading } = this.state;
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        const foldIndex = Number(event.target.value);
        const finallyCallback = () => this.setState(({ selected }) => ({
            selected: {...selected, foldIndex: foldIndex},
            parametersSaved: false
        }));

        this.getFold(foldIndex, finallyCallback);
    };

    /**
     * Filters items from {@link CrossValidation}'s state.
     * Method uses {@link filterFunction} to filter items.
     *
     * @function
     * @memberOf CrossValidation
     * @param {Object} event - Represents an event that takes place in DOM.
     */
    onFilterChange = (event) => {
        const { loading, items } = this.state;
        if (loading.crossValidation || loading.selectedFold) {
            return;
        }

        if (Array.isArray(items) && items.length) {
            const filteredItems = filterFunction(event.target.value.toString(), items.slice());

            this.setState(({selected}) => ({
                displayedItems: filteredItems,
                selected: { ...selected, item: null }
            }));
        }
    };

    onObjectNamesChange = (names) => {
        this.setState(({items, displayedItems}) => ({
            items: items.map((item, index) => {
                item.name = getItemName(index, names);
                return item;
            }),
            displayedItems: displayedItems.map((item, index) => {
                item.name = getItemName(index, names);
                return item;
            })
        }));
    }

    onAttributesMenuOpen = (event) => {
        const currentTarget = event.currentTarget;

        this.setState({
            attributesMenuEl: currentTarget
        });
    };

    onAttributesMenuClose = () => {
        this.setState({
            attributesMenuEl: null
        });
    };

    onSnackbarOpen = (exception, setStateCallback) => {
        if (!(exception.hasOwnProperty("type") && exception.type === "AlertError")) {
            console.error(exception);
            return;
        }

        if (this._isMounted) {
            this.setState({ alertProps: exception }, setStateCallback);
        }
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    onMatrixRefresh = (matrixType) => {
        this.setState(({refreshNeeded}) => ({
            refreshNeeded: { ...refreshNeeded, [matrixType]: false }
        }));
    };

    render() {
        const {
            loading,
            folds,
            foldData,
            items,
            displayedItems,
            open,
            parameters,
            refreshNeeded,
            selected,
            alertProps,
            attributesMenuEl
        } = this.state;

        const { objectGlobalName, project: { id: projectId }, serverBase } = this.props;

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
                            value: parameters.classifierType
                        }}
                    />
                    <DefaultClassificationResultSelector
                        TextFieldProps={{
                            onChange: this.onDefaultClassificationResultChange,
                            value: parameters.defaultClassificationResultType
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
                                disabled={loading.crossValidation || loading.selectedFold}
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
                                            <InputAdornment position={"start"}>
                                                Fold:
                                            </InputAdornment>
                                        )
                                    }}
                                    select={true}
                                    value={selected.foldIndex}
                                >
                                    {folds.map((fold, index) => (
                                        <MenuItem key={index} value={index}>
                                            {fold}
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
                        isLoading={loading.crossValidation || loading.selectedFold}
                        ListProps={{
                            onItemSelected: this.onItemSelected
                        }}
                        ListSubheaderProps={{
                            onSettingsClick: this.onAttributesMenuOpen,
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
                                value: foldData != null && foldData.hasOwnProperty("numberOfTrainingObjects") ?
                                    foldData.numberOfTrainingObjects : "undefined"
                            },
                            {
                                label: "Rules:",
                                value: foldData != null && foldData.hasOwnProperty("numberOfRules") ?
                                    foldData.numberOfRules : "undefined"
                            },
                            {
                                label: "Test objects:",
                                value: foldData != null && foldData.hasOwnProperty("numberOfTestObjects") ?
                                    foldData.numberOfTestObjects : "undefined",
                            }
                        ]}
                    />
                    {selected.item != null && folds != null &&
                        <ClassifiedObjectDialog
                            disableAttributesMenu={true}
                            coveredObjectResource={"crossValidation"}
                            item={selected.item}
                            objectGlobalName={undefined}
                            onClose={() => this.toggleOpen("details")}
                            onSnackbarOpen={this.onSnackbarOpen}
                            open={open.details}
                            projectId={projectId}
                            resource={`crossValidation/${selected.foldIndex}`}
                            serverBase={serverBase}
                        />
                    }
                    {folds != null &&
                        <MatrixDialog
                            onClose={() => this.toggleOpen("matrixMean")}
                            onMatrixRefresh={() => this.onMatrixRefresh("matrixMean")}
                            onSnackbarOpen={this.onSnackbarOpen}
                            open={open.matrixMean}
                            projectId={projectId}
                            refreshNeeded={refreshNeeded.matrixMean}
                            resource={"crossValidation"}
                            saveMatrix={() => this.onSaveToFile({ typeOfMatrix: "crossValidationMean" })}
                            serverBase={serverBase}
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
                            queryParams={{ typeOfMatrix: "crossValidationMean" }}
                        />
                    }
                    {folds != null &&
                        <MatrixDialog
                            onClose={() => this.toggleOpen("matrixSum")}
                            onMatrixRefresh={() => this.onMatrixRefresh("matrixSum")}
                            onSnackbarOpen={this.onSnackbarOpen}
                            open={open.matrixSum}
                            projectId={projectId}
                            refreshNeeded={refreshNeeded.matrixSum}
                            resource={"crossValidation"}
                            saveMatrix={() => this.onSaveToFile({ typeOfMatrix: "crossValidationSum" })}
                            serverBase={serverBase}
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
                            queryParams={{ typeOfMatrix: "crossValidationSum" }}
                        />
                    }
                    {foldData != null &&
                        <MatrixDialog
                            onClose={() => this.toggleOpen("matrixFold")}
                            onMatrixRefresh={() => this.onMatrixRefresh("matrixFold")}
                            onSnackbarOpen={this.onSnackbarOpen}
                            open={open.matrixFold}
                            projectId={projectId}
                            saveMatrix={() => {
                                this.onSaveToFile({
                                    typeOfMatrix: "crossValidationFold",
                                    numberOfFold: selected.foldIndex
                                });
                            }}
                            refreshNeeded={refreshNeeded.matrixFold}
                            resource={"crossValidation"}
                            serverBase={serverBase}
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
                            queryParams={{
                                typeOfMatrix: "crossValidationFold",
                                numberOfFold: selected.foldIndex
                            }}
                        />
                    }
                    {Array.isArray(items) && items.length > 0 &&
                        <AttributesMenu
                            ListProps={{
                                id: "cross-validation-main-desc-attr-menu"
                            }}
                            MuiMenuProps={{
                                anchorEl: attributesMenuEl,
                                onClose: this.onAttributesMenuClose
                            }}
                            objectGlobalName={objectGlobalName}
                            onObjectNamesChange={this.onObjectNamesChange}
                            onSnackbarOpen={this.onSnackbarOpen}
                            projectId={projectId}
                            resource={"crossValidation"}
                            serverBase={serverBase}
                            queryParams={{ subject: selected.foldIndex }}
                        />
                    }
                </CustomBox>
                <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />
            </CustomBox>
        )
    }
}

CrossValidation.propTypes = {
    objectGlobalName: PropTypes.string,
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    showAlert: PropTypes.func,
    value: PropTypes.number
};

export default CrossValidation;
