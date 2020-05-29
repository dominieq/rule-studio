import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FileSelectZone } from "./Elements";
import CustomBox from "../../Utils/Containers/CustomBox";
import CollapsibleDivider from "../../Utils/DataDisplay/CollapsibleDivider";
import StyledDivider from "../../Utils/DataDisplay/StyledDivider";
import { CSVDialog } from "../../Utils/Feedback/CSVDialog";
import CustomSwitch from "../../Utils/Inputs/CustomSwitch";
import CustomTextField from "../../Utils/Inputs/CustomTextField";
import { StyledButton }  from "../../Utils/Inputs/StyledButton"
import CustomSection from "../../Utils/Surfaces/CustomSection";
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
            name: event.target.value
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
                    expand: false
                });
            }
        });
    };

    onExpandClick = () => {
        this.setState(prevState => ({
            expand: !prevState.expand
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
            this.props.onFilesAccepted(name.toString().trim(), files, null);
        }
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

    onClearClick = () => {
        this.setState({
            checked: false,
            csvFile: false,
            expand: false,
            files: [],
            name: "new project"
        })
    };

    render() {
        const { checked, expand, name, open } = this.state;

        return (
            <CustomBox id={"import"} onKeyPress={this.onEnterClick} variant={"Body"}>
                <CustomSection id={"import-section"}>
                    <div aria-label={"text field row"} className={styles.Row}>
                        <CustomTextField
                            autoComplete={"off"}
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
                        <CustomSwitch
                            label={"Create project with metadata"}
                            checked={checked}
                            onChange={this.onCheckboxChange}
                        />
                    </div>
                    <Collapse in={checked} mountOnEnter={true} unmountOnExit={true}>
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
                            <Collapse in={expand} mountOnEnter={true} unmountOnExit={true}>
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
                            color={"primary"}
                            id={"footer-accept-button"}
                            onClick={this.onAcceptButtonClick}
                            variant={"outlined"}
                        >
                            Accept
                        </StyledButton>
                        <StyledButton
                            color={"secondary"}
                            id={"footer-cancel-button"}
                            onClick={this.onClearClick}
                            style={{marginRight: 12}}
                            variant={"outlined"}
                        >
                            Clear
                        </StyledButton>
                    </div>
                </CustomSection>
                <CSVDialog onConfirm={this.onCSVDialogClose} open={open} />
            </CustomBox>
        );
    }
}

Import.propTypes = {
    onFilesAccepted: PropTypes.func.isRequired,
};

export default Import;