import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FileSelectZone from "./FileSelectZone";
import RuleWorkBox from "../../RuleWorkComponents/Containers/RuleWorkBox"
import RuleWorkSmallBox from "../../RuleWorkComponents/Containers/RuleWorkSmallBox"
import StyledDivider from "../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTextField from "../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledButton  from "../../RuleWorkComponents/Inputs/StyledButton"
import CollapsibleDivider from "../../RuleWorkComponents/DataDisplay/CollapsibleDivider";
import RuleWorkSwitch from "../../RuleWorkComponents/Inputs/RuleWorkSwitch";
import StyledPaper from "../../RuleWorkComponents/Surfaces/StyledPaper";
import Collapse from "@material-ui/core/Collapse";

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

    onProjectNameFocus = (event) => {
        event.target.select();
    }

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
                <StyledPaper id={"import-panel"} elevation={6} styleVariant={"panel"}>
                    <RuleWorkSmallBox>
                        <RuleWorkTextField
                            fullWidth={true}
                            onChange={this.onProjectNameChange}
                            onFocus={this.onProjectNameFocus}
                            outsideLabel={"Project name"}
                            value={name}
                        />
                    </RuleWorkSmallBox>
                    <StyledDivider
                        color={"secondary"}
                        flexItem={false}
                        margin={12}
                        orientation={"horizontal"}
                    />
                    <RuleWorkSmallBox>
                        <RuleWorkSwitch
                            label={"Create project with metadata"}
                            checked={checked}
                            onChange={this.onCheckboxChange}
                        />
                    </RuleWorkSmallBox>
                    <Collapse in={checked} unmountOnExit={true}>
                        <RuleWorkSmallBox styleVariant={"multi-row"}>
                            <FileSelectZone
                                variant={"metadata"}
                                accept={".json"}
                                onInputChange={this.onInputChange}
                                onInputDelete={this.onInputDelete}
                                title={"A file defining structure of attributes"}
                            />
                            <CollapsibleDivider
                                onClick={this.onExpandClick}
                                expanded={expand}
                            />
                            <Collapse in={expand} unmountOnExit={true}>
                                <RuleWorkSmallBox styleVariant={"multi-row"}>
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
                                </RuleWorkSmallBox>
                            </Collapse>
                        </RuleWorkSmallBox>
                    </Collapse>
                    <StyledDivider
                        color={"secondary"}
                        flexItem={false}
                        hidden={!expand}
                        margin={12}
                        orientation={"horizontal"}
                    />
                    <RuleWorkSmallBox styleVariant={"footer"}>
                        <StyledButton
                            id={"footer-accept-button"}
                            onClick={this.onAcceptButtonClick}
                            themeVariant={"primary"}
                            variant={"outlined"}
                        >
                            Accept
                        </StyledButton>
                        <StyledButton
                            id={"footer-cancel-button"}
                            onClick={this.onClearClick}
                            style={{marginRight: 12}}
                            themeVariant={"secondary"}
                            variant={"outlined"}
                        >
                            Clear
                        </StyledButton>
                    </RuleWorkSmallBox>
                </StyledPaper>
            </RuleWorkBox>
        );
    }
}

Import.propTypes = {
    onFilesAccepted: PropTypes.func.isRequired,
};

export default Import;