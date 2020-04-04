import React, { Component } from "react";
import PropTypes from "prop-types";
import fetchCrossValidation from "./fetchFunctions/fetchCrossValidation";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import DefaultClassificationResultSelector from "../Utils/Calculations/DefaultClassificationResultSelector";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import TypeOfClassifierSelector from "../Utils/Calculations/TypeOfClassifierSelector";
import TypeOfRulesSelector from "../Utils/Calculations/TypeOfRulesSelector";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
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

        this._data = {};

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            folds: null,
            items: null,
            displayedItems: null,
            parameters: {
                consistencyThreshold: 0,
                defaultClassificationResult: "majorityDecisionClass",
                numberOfFolds: 2,
                typeOfClassifier: "SimpleRuleClassifier",
                typeOfRules: "certain",
                typeOfUnions: "monotonic",
            },
            parametersUpToDate: true,
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
            const project = {...this.props.project};

            fetchCrossValidation(
                project.result.id,
                'GET',
                null,
                404
            ).then(result => {
                if (this._isMounted && result) {
                    this._data = result;
                    let folds = this.getFolds(result);

                    this.setState(({parameters}) => ({
                        folds: folds,
                        parameters: {...parameters, numberOfFolds: result.numberOfFolds},
                    }), () => {
                        const { folds, selected: { foldIndex } } = this.state;
                        let items = this.getItems(folds[foldIndex]);

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
                    this.setState({loading: false});
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

            const { parameters, foldDisplay, foldIndex } = this.state;

            project.threshold = parameters.consistencyThreshold;
            project.defaultClassificationResult = parameters.defaultClassificationResult;
            project.foldNumber = parameters.numberOfFolds;
            project.typeOfClassifier = parameters.typeOfClassifier;
            project.ruleType = parameters.typeOfRules;
            project.typeOfUnions = parameters.typeOfUnions;
            project.foldDisplay = foldDisplay;
            project.foldIndex = foldIndex;

            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = this.state.updated;

            this.props.onTabChange(project, this.state.updated, tabsUpToDate);
        }
    }

    onCalculateClick = () => {
        this.setState({
            loading: true,
        }, () => {
            let project = {...this.props.project};
            const { parameters } = this.state;

            let data = new FormData();
            Object.keys(parameters).map(key => {
                data.append(key, parameters[key])
            });
            if (!project.dataUpToDate) {
                data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
                data.append("data", JSON.stringify(project.result.informationTable.objects));
            }

            fetchCrossValidation(
                project.result.id,
                project.dataUpToDate ? "PUT" : "POST",
                data,
            ).then(result => {
                if (this._isMounted && result) {
                    const updated = true;
                    let folds = this.getFolds(result);

                    this._data = result;
                    this.setState(({parameters}) => ({
                        changes: true,
                        updated: updated,
                        folds: folds,
                        parameters: {...parameters, numberOfFolds: result.numberOfFolds},
                    }), () => {
                        const { folds, selected: { foldIndex } } = this.state;
                        let items = this.getItems(folds[foldIndex]);

                        this.setState({
                            items: items,
                            displayedItems: items,
                        })
                    });
                } else {

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
            open: {...open, details: true},
            selected: {...selected, item: items[index]}
        }));
    };

    onDefaultClassificationResultChange = (event) => {
        this.setState(({parameters}) => ({
            changes: event.target.value !== "majorityDecisionClass",
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, defaultClassificationResult: event.target.value},
        }));
    };

    onTypeOfRulesChange = (event) => {
        this.setState(({parameters}) => ({
            changes: event.target.value !== "certain",
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, typeOfRules: event.target.value},
        }));
    };

    onConsistencyThresholdChange = (threshold) => {
        this.setState(({parameters}) => ({
            changes: Boolean(threshold),
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, consistencyThreshold: threshold},
        }));
    };

    onTypeOfClassifierChange = (event) => {
        this.setState(({parameters}) => ({
            changes: event.target.value !== "SimpleRuleClassifier",
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, typeOfClassifier: event.target.value},
        }));
    };

    onTypeOfUnionsChange = (event) => {
        this.setState(({parameters}) => ({
            changes: event.target.value !== "monotonic",
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, typeOfUnions: event.target.value},
        }));
    };

    onNumberOfFoldsChange = (event) => {
        const input = event.target.value;

        if (!isNaN(input)) {
            this.setState(({parameters}) => ({
                changes: Number(input) !== 2,
                updated: this.props.project.dataUpToDate,
                parameters: {...parameters, numberOfFolds: Number(input)},
            }));
        }
    };

    onFoldIndexChange = (event) => {
        this.setState(({ selected }) => ({
            changes: Boolean(event.target.value),
            updated: this.props.project.dataUpToDate,
            selected: {...selected, foldIndex: Number(event.target.value)},
        }), () => {
            const { folds, selected: { foldIndex }} = this.state;
            let items = this.getItems(folds[foldIndex]);

            this.setState({
                items: items,
                displayedItems: items,
            });
        });
    };

    onFilterChange = (event) => {
        const { items } = this.state;
        const filteredItems = filterFunction(event.target.value.toString(), items.slice());
        this.setState(({selected}) => ({
            displayedItems: filteredItems,
            selected: {...selected, item: null}
        }));
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    getFolds = (data) => {
        let folds = [];
        if (data) {
            for ( let i = 0; i < data.numberOfFolds; i++) {
                folds.push({
                    index: i,
                    ...data.crossValidationSingleFolds[i]
                });
            }
        }
        return folds;
    };

    getItems = (fold) => {
        let items = [];
        if (fold && Object.keys(fold).length) {
            const { indexOption } = this.props.project.settings;
            for (let i = 0; i < fold.validationTable.objects.length; i++) {
                let name = "Object " + (i + 1);

                if (indexOption !== "default") {
                    if (Object.keys(fold.validationTable.objects[i]).includes(indexOption)) {
                        name = fold.validationTable.object[i][indexOption];
                    }
                }

                items.push({
                    id: i,
                    name: name,
                    traits: {
                        ...fold.validationTable,
                        ...fold.classificationValidationTable.classificationResults[i]
                    },
                    tables: {
                        indicesOfCoveringRules: fold.classificationValidationTable.indicesOfCoveringRules[i],
                    },
                });
            }
        }
        return items;
    };

    getListItems = (items) => {
        let listItems = [];
        if (Array.isArray(items) && items.length) {
            for ( let i = 0; i < items.length; i++) {
                listItems.push({
                    id: items[i].id,
                    header: items[i].name,
                    subheader: "Suggested decision " + items[i].traits.suggestedDecision,
                    content: "Covered by " + items[i].tables.indicesOfCoveringRules.length + " rules"
                });
            }
        }
        return listItems;
    };

    render() {
        const { alertProps, folds, displayedItems, loading, open, parameters, selected } = this.state;

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
                            disabled={!this.props.project || loading}
                            onClick={this.onCalculateClick}
                        />
                    </RuleWorkTooltip>
                    <StyledDivider />
                    {Array.isArray(folds) && folds.length &&
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
                    content={this.getListItems(displayedItems)}
                    id={"cross-validation-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onItemSelected
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Fold",
                            value: selected.foldIndex + 1
                        },
                        {
                            label: "Number of objects",
                            value: displayedItems && displayedItems.length
                        },
                        {
                            label: "Total number of rules",
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