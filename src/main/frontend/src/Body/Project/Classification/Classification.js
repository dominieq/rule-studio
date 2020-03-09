import React, {Component} from "react";
import PropTypes from "prop-types";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkButton from "../../../RuleWorkComponents/Inputs/RuleWorkButton";
import RuleWorkButtonGroup from "../../../RuleWorkComponents/Inputs/RuleWorkButtonGroup";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSelect from "../../../RuleWorkComponents/Inputs/RuleWorkSelect";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import Divider from "@material-ui/core/Divider";
import "./Classification.css";

class Classification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            displayedData: [],
            ruleType: "certain",
            snackbarProps: undefined,
        };
    }

    componentDidMount() {
        console.log("Fetching classification from server...");
    }

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
        const {loading, displayedData, ruleType, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-classification"} styleVariant={"tab"}>
                <StyledPaper id={"classification-bar"} styleVariant={"bar"} square={true} variant={"outlined"}>
                    <RuleWorkTextField
                        type={"search"}
                        onChange={this.onFilterChange}
                    >
                        Filter objects
                    </RuleWorkTextField>
                    <span style={{flexGrow: 1}} />
                    <RuleWorkSelect
                        disabledChildren={["possible"]}
                        label={"Choose rule type"}
                        onChange={this.onRuleTypeChange}
                        value={ruleType}
                    >
                        {["certain", "possible"]}
                    </RuleWorkSelect>
                    <Divider flexItem={true} orientation={"vertical"} />
                    <RuleWorkButtonGroup
                        id={"classification-button-group"}
                        options={["Classify current data", "Choose new data & classify"]}
                    >
                        <RuleWorkButton
                            ariaLabel={"classify-current-file"}
                            buttonVariant={"contained"}
                            onClick={this.onCalculateClick}
                            styleVariant={"green"}
                            title={"Temporary tooltip"}
                        >
                            Classify current data
                        </RuleWorkButton>
                        <RuleWorkButton
                            accept={".json,.csv"}
                            ariaLabel={"classify-new-file"}
                            buttonVariant={"contained"}
                            isUpload={true}
                            onClick={this.onCalculateClick}
                            styleVariant={"green"}
                            title={"Temporary tooltip"}
                        >
                            Choose new data & classify
                        </RuleWorkButton>
                    </RuleWorkButtonGroup>
                </StyledPaper>
                <RuleWorkBox id={"classification-body"} styleVariant={"tab-body1"} >
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