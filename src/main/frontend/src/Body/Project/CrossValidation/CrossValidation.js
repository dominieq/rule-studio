import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSelect from "../../../RuleWorkComponents/Inputs/RuleWorkSelect";
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import RuleWorkTooltip from "../../../RuleWorkComponents/Inputs/RuleWorkTooltip";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import StyledToggleButton from "../../../RuleWorkComponents/Inputs/StyledToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Calculator from "mdi-material-ui/Calculator";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js";

class CrossValidation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            displayedData: [],
            display: 0,
            foldNumber: 1,
            foldIndex: 0,
            folds: [],
            openSettings: false,
            snackbarProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        console.log("Fetching cross-validation from server...");
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
                foldNumber: Number(input),
            });
        }
    };

    onCalculateClick = () => {
        console.log("Calculating cross-validation on server...");
    };

    onFoldChange = (event) => {
        this.setState({
            foldIndex: event.target.value,
        })
    };

    onDisplayChange = (event, newDisplay) => {
        if (typeof newDisplay !== 'number') return;

        this.setState({
            display: newDisplay,
        });
    };

    onSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            snackbarProps: undefined,
        });
    };

    renderResultsActions = () => {
        const {display, folds, foldIndex} = this.state;

        if (Array.isArray(folds) && folds.length) {
            return (
                <Fragment>
                    <RuleWorkSelect
                        label={"Choose fold"}
                        onChange={this.onFoldChange}
                        value={foldIndex}
                    >
                        {folds}
                    </RuleWorkSelect>
                    <StyledDivider />
                    <ToggleButtonGroup
                        aria-label={"display-toggle-button-group"}
                        exclusive={true}
                        onChange={this.onDisplayChange}
                        value={display}
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
        const {loading, displayedData, foldNumber, openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-cross-validation"} styleVariant={"tab"}>
                <StyledPaper
                    id={"cross-validation-bar"}
                    paperRef={this.upperBar}
                    styleVariant={"bar"}
                    square={true}
                    variant={"outlined"}
                >
                    <RuleWorkTooltip title={"Click to customize number of folds"}>
                        <StyledButton
                            aria-label={"cross-validation-settings-button"}
                            isIcon={true}
                            onClick={this.onSettingsClick}
                        >
                            <SvgIcon><path d={mdiCog} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={`Current number of folds: ${foldNumber}`}>
                        <StyledButton
                            aria-label={"cross-validation-calculate"}
                            disable={!this.props.project & loading}
                            disableElevation={true}
                            onClick={this.onCalculateClick}
                            startIcon={<Calculator />}
                            themeVariant={"primary"}
                            variant={"contained"}
                        >
                            Calculate
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    {this.renderResultsActions()}
                </StyledPaper>
                <RuleWorkDrawer
                    height={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                    id={"cross-validation-settings-drawer"}
                    open={openSettings}
                >
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"fold-number-selector"} >
                        <RuleWorkTextField
                            value={foldNumber}
                            onChange={this.onFoldNumberChange}
                            style={{maxWidth: 128}}
                        >
                            Choose number of folds
                        </RuleWorkTextField>
                    </RuleWorkSmallBox>
                    <RuleWorkSmallBox id={"cross-validation-footer"} styleVariant={"footer"}>
                        <StyledButton
                            isIcon={true}
                            onClick={this.onSettingsClose}
                            themeVariant={"secondary"}
                        >
                            <ChevronLeftIcon />
                        </StyledButton>
                    </RuleWorkSmallBox>
                </RuleWorkDrawer>
                <RuleWorkBox id={"cross-validation-body"} styleVariant={"tab-body"}>
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
        )
    }
}

CrossValidation.propTypes = {
    changed: PropTypes.arrayOf(PropTypes.bool),
    project: PropTypes.object,
    updateProject: PropTypes.func,
    value: PropTypes.number,
};

export default CrossValidation;