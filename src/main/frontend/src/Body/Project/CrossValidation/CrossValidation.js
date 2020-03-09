import React, {Component} from "react";
import PropTypes from "prop-types";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkButton from "../../../RuleWorkComponents/Inputs/RuleWorkButton";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSelect from "../../../RuleWorkComponents/Inputs/RuleWorkSelect";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import Divider from "@material-ui/core/Divider";
import Cog from "mdi-material-ui/Cogs";
import "./CrossValidation.css"

class CrossValidation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            displayedData: [],
            foldIndex: 0,
            folds: [],
            openSettings: false,
            snackbarProps: undefined,
        };
    }

    componentDidMount() {
        console.log("Fetching cross-validation from server...");
    }

    onCalculateClick = () => {
        console.log("Calculating cross-validation on server...");
    };

    onSettingsClick = () => {
        this.setState(prevState => ({
            openSettings: !prevState.openSettings,
        }));
    };

    onFoldChange = (event) => {
        this.setState({
            foldIndex: event.target.value,
        })
    };

    onSnackbarProps = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            snackbarProps: undefined,
        });
    };

    render() {
        const {loading, displayedData, foldIndex, folds, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-cross-validation"} styleVariant={"tab"}>
                <StyledPaper id={"cross-validation-bar"} styleVariant={"bar"} square={true} variant={"outlined"}>
                    <RuleWorkButton
                        ariaLabel={"toggle-settings-button"}
                        buttonVariant={"icon"}
                        onClick={this.onSettingsClick}
                        title={"Click to customize other settings"}
                    >
                        <Cog />
                    </RuleWorkButton>
                    <Divider flexItem={true} orientation={"vertical"} />
                    <RuleWorkSelect
                        label={"Choose fold"}
                        onChange={this.onFoldChange}
                        value={foldIndex}
                    >
                        {folds}
                    </RuleWorkSelect>
                    <span style={{flexGrow: 1}} />
                    <StyledButton
                        buttonVariant={"contained"}
                        onClick={this.onCalculateClick}
                        styleVariant={"green"}
                    >
                        Calculate
                    </StyledButton>
                </StyledPaper>
                <RuleWorkBox id={"cross-validation-body"} styleVariant={"tab-body1"}>
                    {loading ?
                        <StyledCircularProgress />
                        :
                        <RuleWorkList>
                            {displayedData}
                        </RuleWorkList>
                    }
                </RuleWorkBox>
                <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarProps} />
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