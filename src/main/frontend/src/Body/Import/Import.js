import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RuleWorkBox from "../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkTextField from "../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledCollapsibleDivider from "./data-display/StyledCollapsibleDivider";
import StyledContent from "./containers/StyledContent";
import StyledDivider from "./data-display/StyledDivider";
import StyledFooter from "./containers/StyledFooter";
import StyledHeader from "./containers/StyledHeader";
import StyledPaper from "../../RuleWorkComponents/Surfaces/StyledPaper";
import StyledSwitch from "./inputs/StyledSwitch";
import Collapse from "@material-ui/core/Collapse";
import FileSelectZone from "./inputs/FileSelectZone";
import StyledButton from "../../RuleWorkComponents/Inputs/StyledButton";

class Import extends Component{
    constructor(props) {
        super(props);

        this.state = {
            checked: false,
            expand: false,
            name: "new project",
            files: [],
        };
    }

    onProjectNameChange = (event) => {
        this.setState({
            name: event.target.value,
        });
    };

    onCheckboxChange = () => {
        this.setState( prevState => ({
            checked: !prevState.checked,
        }), () => {
            if (!this.state.checked) {
                this.setState({
                    expand: false,
                });
            }
        });
    };

    onExpandClick = () => {
        this.setState(prevState => ({
            expand: !prevState.expand,
        }));
    };

    onInputChange = (message) => {
        let newFiles = this.state.files;
        for (let i = 0; i <  newFiles.length; i++) {
            if (newFiles[i].type === message.type) {
                newFiles.splice(i, 1);
                break;
            }
        }
        this.setState({
            files: [...newFiles, message],
        });
    };

    onInputDelete = (message) => {
        let newFiles = this.state.files;
        for (let i = 0; i <  newFiles.length; i++) {
            if (newFiles[i].type === message.type) {
                newFiles.splice(i, 1);
                this.setState({
                    files: newFiles,
                });
                break;
            }
        }
    };

    onEnterClick = (event) => {
        if (event.which === 13) {
            event.preventDefault();
            this.onAcceptButtonClick();
        }
    };

    onAcceptButtonClick = () => {
        const projectName = this.state.name;
        let projectFiles = [];
        if (this.state.checked) {
            projectFiles = this.state.files;
        }

        this.props.onFilesAccepted(projectName, projectFiles);
    };

    onClearClick = () => {
        this.setState({
            checked: false,
            expand: false,
            name: "new project",
            files: [],
        })
    };

    render() {
        const {checked, expand, name} = this.state;

        return (
            <RuleWorkBox id={"rule-work-import"} onKeyPress={this.onEnterClick} styleVariant={"body"}>
                <StyledPaper id={"import-panel"} elevation={6} styleVariant={"panel"} square={true}>
                    <StyledHeader>
                        <RuleWorkTextField
                            fullWidth={true}
                            onChange={this.onProjectNameChange}
                            value={name}
                        >
                            Project name
                        </RuleWorkTextField>
                    </StyledHeader>
                    <StyledDivider flexItem={true} />
                    <StyledSwitch
                        label={"Create project with metadata"}
                        checked={checked}
                        onChange={this.onCheckboxChange}
                    />
                    <Collapse in={checked} unmountOnExit={true}>
                        <StyledContent>
                            <FileSelectZone
                                variant={"metadata"}
                                accept={".json"}
                                onInputChange={this.onInputChange}
                                onInputDelete={this.onInputDelete}
                            />
                            <StyledCollapsibleDivider
                                onClick={this.onExpandClick}
                                expanded={expand}
                            />
                            <Collapse in={expand} unmountOnExit={true}>
                                <StyledContent>
                                    <FileSelectZone
                                        variant={"data"}
                                        accept={".json,.csv"}
                                        onInputChange={this.onInputChange}
                                        onInputDelete={this.onInputDelete}
                                    />
                                    <FileSelectZone
                                        variant={"rules"}
                                        accept={".xml"}
                                        onInputChange={this.onInputChange}
                                        onInputDelete={this.onInputDelete}
                                    />
                                </StyledContent>
                            </Collapse>
                        </StyledContent>
                    </Collapse>
                    <StyledDivider flexItem={true} hidden={!expand} />
                    <StyledFooter >
                        <StyledButton
                            buttonVariant={"outlined"}
                            id={"footer-accept-button"}
                            onClick={this.onAcceptButtonClick}
                            styleVariant={"green"}
                        >
                            Accept
                        </StyledButton>
                        <StyledButton
                            buttonVariant={"outlined"}
                            id={"footer-cancel-button"}
                            onClick={this.onClearClick}
                            styleVariant={"red"}
                        >
                            Clear
                        </StyledButton>
                    </StyledFooter>
                </StyledPaper>
            </RuleWorkBox>
        );
    }
}

Import.propTypes = {
    onFilesAccepted: PropTypes.func.isRequired,
};

export default Import;