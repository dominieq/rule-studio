import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Checkbox from "@material-ui/core/Checkbox";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FileSelectZone from "./FileSelectZone";
import "./Import.css";

function getOptionalStyleClasses() {
    return [
        "import-project-files-optional-visible",
        "import-project-files-optional-invisible",
    ]
}

class Import extends Component{
    constructor(props) {
        super(props);

        const styleClass = getOptionalStyleClasses();

        this.state = {
            checked: false,
            optionalStyling: styleClass[1],
            projectName: "new project",
            projectFiles: [],
        };

        this.setProjectName = this.setProjectName.bind(this);
        this.setChecked = this.setChecked.bind(this);
    }

    setProjectName(newValue) {
        this.setState({
            projectName: newValue,
        });
    }

    setChecked(event) {
        const styleClass = getOptionalStyleClasses();

        this.setState({
            checked: event.target.checked,
            optionalStyling: event.target.checked ? styleClass[0] : styleClass[1]
        });
    }

    render() {
        return (
            <div className={"import-root"}>
                <Paper square={true} className={"import-panel"}>
                    <Grid container direction={"column"} spacing={2}>
                        <Grid item component={"div"}
                              className={"import-project-row"}>

                            <Typography component={"div"}>
                                Project name:
                            </Typography>
                            <form noValidate={true} autoComplete={"off"}>
                                <FormControl variant={"outlined"}>
                                    <OutlinedInput
                                        id={"component-outlined"}
                                        defaultValue={this.state.projectName}
                                        onChange={this.setProjectName}
                                        labelWidth={0}/>
                                </FormControl>
                            </form>
                        </Grid>
                        <Grid item component={"div"}
                              className={"import-project-row"}>

                            <Checkbox
                                checked={this.state.checked}
                                onChange={this.setChecked}
                                value={"primary"}
                                color={"primary"}
                            />
                            <Typography component={"div"}>
                                Create project with metadata.
                            </Typography>
                        </Grid>
                        <Grid item component={"div"}
                              className={this.state.optionalStyling} hidden={!this.state.checked}>

                            <FileSelectZone
                                textField={"standard-read-only-metadata-input"}
                                input={"icon-button-metadata"}>
                                Choose metadata file:
                            </FileSelectZone>
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls={"optional-panel-content"}
                                >
                                    <Typography component={"p"}>Choose optional files</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails className={this.state.optionalStyling}>
                                    <FileSelectZone
                                        textField={"standard-read-only-data-input"}
                                        input={"icon-button-data"}>
                                        Choose data file:
                                    </FileSelectZone>
                                    <FileSelectZone
                                        textField={"standard-read-only-rules-input"}
                                        input={"icon-button-rules"}>
                                        Choose rules file:
                                    </FileSelectZone>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

export default Import;