import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileSelectZone from "./FileSelectZone";
import RuleWorkBox from "../../RuleWorkComponents/Containers/RuleWorkBox";
import CollapsibleDivider from "../../RuleWorkComponents/DataDisplay/CollapsibleDivider";
import StyledDivider from "../../RuleWorkComponents/DataDisplay/StyledDivider";
import { CSVDialog } from "../../RuleWorkComponents/Feedback/CSVDialog";
import RuleWorkSwitch from "../../RuleWorkComponents/Inputs/RuleWorkSwitch";
import RuleWorkTextField from "../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledButton  from "../../RuleWorkComponents/Inputs/StyledButton"
import StyledPaper from "../../RuleWorkComponents/Surfaces/StyledPaper";
import Collapse from "@material-ui/core/Collapse";
import styles from "./styles/Import.module.css";

class Import extends Component{
    constructor(props) {
        super(props);

        this.state = {
            checked: false,
            csvFile: false,
            expand: false,
            files: [],
            name: "new project",
            open: false
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

    onInputChange = (file) => {
        let { files } = this.state;

        for (let i = 0; i <  files.length; i++) {
            if (files[i].type === file.type) {
                files.splice(i, 1);
                break;
            }
        }

        this.setState(({csvFile}) => {
            let csv = csvFile;

            if ( file.type === "data" ) {
                if ( file.file.type !== 'application/json' ) {
                    csv = true;
                } else if ( csv && file.file.type === 'application/json' ) {
                    csv = false;
                }
            }

            return {
                files: [ ...files, file ],
                csvFile: csv
            };
        });
    };

    onInputDelete = (file) => {
        let { files } = this.state;

        for (let i = 0; i <  files.length; i++) {
            if (files[i].type === file.type) {
                let removed = files.splice(i, 1);

                this.setState(({csvFile}) => ({
                    files: files,
                    csvFile: removed[0].type === "data" && removed[0].file.type !== 'application/json'
                        ? false : csvFile
                }));
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
        const { name, files, csvFile } = this.state;

        if (csvFile) {
            this.setState({ open: true });
        } else {
            this.props.onFilesAccepted(name, files, null);
        }
    };

    onClearClick = () => {
        this.setState({
            checked: false,
            csvFile: false,
            expand: false,
            files: [],
            name: "new project"
        })
    };

    onCSVDialogClose = (csvSpecs) => {
        this.setState({
            open: false
        }, () => {
            if (csvSpecs && Object.keys(csvSpecs).length) {
                const { name, files } = this.state;

                this.props.onFilesAccepted(name, files, csvSpecs);
            }
        });
    };

    render() {
        const { checked, expand, name, open } = this.state;

        return (
            <RuleWorkBox id={"rule-work-import"} onKeyPress={this.onEnterClick} styleVariant={"body"}>
                <StyledPaper id={"import-panel"} elevation={6} styleVariant={"panel"}>
                    <div aria-label={"text field row"} className={styles.Row}>
                        <RuleWorkTextField
                            fullWidth={true}
                            onChange={this.onProjectNameChange}
                            onFocus={this.onProjectNameFocus}
                            outsideLabel={"Project name"}
                            value={name}
                        />
                    </div>
                    <StyledDivider
                        color={"secondary"}
                        flexItem={false}
                        margin={12}
                        orientation={"horizontal"}
                    />
                    <div aria-label={"switch row"} className={styles.Row} style={{paddingBottom: 8}}>
                        <RuleWorkSwitch
                            label={"Create project with metadata"}
                            checked={checked}
                            onChange={this.onCheckboxChange}
                        />
                    </div>
                    <Collapse in={checked} unmountOnExit={true}>
                        <div aria-label={"outer collapse"} className={styles.Collapse}>
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
                                <div aria-label={"inner collapse"} className={styles.Collapse}>
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
                                </div>
                            </Collapse>
                        </div>
                    </Collapse>
                    <StyledDivider
                        color={"secondary"}
                        flexItem={false}
                        hidden={!expand}
                        margin={12}
                        orientation={"horizontal"}
                    />
                    <div aria-label={"footer"} className={styles.Footer}>
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
                    </div>
                </StyledPaper>
                <CSVDialog onConfirm={this.onCSVDialogClose} open={open} />
            </RuleWorkBox>
        );
    }
}

Import.propTypes = {
    onFilesAccepted: PropTypes.func.isRequired,
};

export default Import;