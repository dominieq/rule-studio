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
            foldDisplay: 0,
            foldIndex: 0,
            foldNumber: 1,
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

        console.log("Fetching cross-validation from server...");
        this.setState({
            foldDisplay: this.props.project.foldDisplay,
            foldIndex: this.props.project.foldIndex,
            foldNumber: this.props.project.foldNumber,
        })
    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this.state.changes) {
            let project = {...this.props.project};
            if (Object.keys(this._data).length) {
                //TODO DO SOMETHING
            }
            project.foldDisplay = this.state.foldDisplay;
            project.foldIndex = this.state.foldIndex;
            project.foldNumber = this.state.foldNumber;
            this.props.onTabChange(project, this.props.value, this.state.updated);
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
        console.log("Calculating cross-validation on server...");
        const array = Array(this.state.foldNumber).fill(1);
        for (let i = 0; i < array.length; i++) {
            array[i] = i + 1;
        }
        this.setState({
            folds: array,
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