import React, {Component} from "react";
import PropTypes from "prop-types";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkButtonGroup from "../../../RuleWorkComponents/Inputs/RuleWorkButtonGroup";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSelect from "../../../RuleWorkComponents/Inputs/RuleWorkSelect";
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import RuleWorkTooltip from "../../../RuleWorkComponents/Inputs/RuleWorkTooltip";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js"
import "./Classification.css";

class Classification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            displayedData: [],
            openSettings: false,
            ruleType: "certain",
            snackbarProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        console.log("Fetching classification from server...");
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
        console.log("Fetching classification from server...");
    };

    onRuleTypeChange = (event) => {
        this.setState({
            ruleType: event.target.value,
        });
    };

    onFilterChange = (event) => {
        console.log(event.target.value);
    };

    onSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            snackbarProps: undefined,
        });
    };

    render() {
        const {loading, displayedData, openSettings, ruleType, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-classification"} styleVariant={"tab"}>
                <StyledPaper
                    id={"classification-bar"}
                    paperRef={this.upperBar}
                    styleVariant={"bar"}
                    square={true}
                    variant={"outlined"}
                >
                    <RuleWorkTooltip title={"Click to choose rule type"}>
                        <StyledButton
                            isIcon={true}
                            onClick={this.onSettingsClick}
                        >
                            <SvgIcon><path d={mdiCog}/></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkButtonGroup
                        id={"classification-button-group"}
                        options={["Classify current data", "Choose new data & classify"]}
                    >
                        <StyledButton
                            aria-label={"classify-current-file"}
                            disableElevation={true}
                            onClick={this.onCalculateClick}
                            themeVariant={"primary"}
                            variant={"contained"}
                        >
                            Classify current data
                        </StyledButton>
                        <RuleWorkUpload
                            accept={".json,.csv"}
                            id={"classify-new-file"}
                            onChange={this.onCalculateClick}
                        >
                            <StyledButton
                                aria-label={"classify-new-file"}
                                disableElevation={true}
                                component={"span"}
                                themeVariant={"primary"}
                                variant={"contained"}
                            >
                                Choose new data & classify
                            </StyledButton>
                        </RuleWorkUpload>
                    </RuleWorkButtonGroup>
                    <span style={{flexGrow: 1}} />
                    <RuleWorkTextField
                        type={"search"}
                        onChange={this.onFilterChange}
                    >
                        Filter objects
                    </RuleWorkTextField>
                </StyledPaper>
                <RuleWorkDrawer
                    height={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                    id={"classification-settings-drawer"}
                    open={openSettings}
                >
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"rule-type-selector"}>
                        <RuleWorkSelect
                            disabledChildren={["possible"]}
                            label={"Choose rule type"}
                            onChange={this.onRuleTypeChange}
                            value={ruleType}
                        >
                            {["certain", "possible"]}
                        </RuleWorkSelect>
                    </RuleWorkSmallBox>
                    <RuleWorkSmallBox id={"classification-settings-footer"} styleVariant={"footer"}>
                        <StyledButton
                            isIcon={true}
                            onClick={this.onSettingsClose}
                            themeVariant={"secondary"}
                        >
                            <ChevronLeftIcon />
                        </StyledButton>
                    </RuleWorkSmallBox>
                </RuleWorkDrawer>
                <RuleWorkBox id={"classification-body"} styleVariant={"tab-body"} >
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

Classification.propTypes = {
    changed: PropTypes.arrayOf(PropTypes.bool),
    project: PropTypes.object,
    updateProject: PropTypes.func,
    value: PropTypes.number,
};

export default Classification;