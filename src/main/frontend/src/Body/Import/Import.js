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

/**
 * The Import section of RuLeStudio. Allows user to customise and create their project.
 *
 * @constructor
 * @category Import
 * @param {Object} props
 * @param {function} props.onFilesAccepted - Callback fired when user accepts selection and requests to create project.
 * @return{React.Component}
 */
class Import extends Component {
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

    /**
     * If a file of the same type was already stored in the state, it is deleted.
     * Then, method checks if the uploaded file is a CSV file and changes state accordingly.
     * Eventually the file is stored in the state.
     *
     * @function
     * @memberOf Import
     * @param {Object} file - A file that was chosen by a user.
     * @param {string} file.type - The type of data.
     * @param {Object} file.file - An actual file uploaded by a user.
     */
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

    /**
     * Method removes file from the state.
     * Then, checks whether the deleted file was a CSV file and changes state accordingly.
     *
     * @function
     * @memberOf Import
     * @param {Object} file - A file that is going to be deleted.
     * @param {string} file.type - The type of data.
     * @param {Object} file.file - An actual file uploaded by a user.
     */
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
                                accept={".json"}
                                id={"upload-metadata"}
                                label={"Choose metadata file:"}
                                onInputChange={this.onInputChange}
                                onInputDelete={this.onInputDelete}
                                title={"Upload metadata"}
                                type={"metadata"}
                            />
                            <CollapsibleDivider
                                onClick={this.onExpandClick}
                                expanded={expand}
                            />
                            <Collapse in={expand} mountOnEnter={true} unmountOnExit={true}>
                                <div aria-label={"inner collapse"} className={styles.Collapse}>
                                    <FileSelectZone
                                        accept={".json,.csv"}
                                        id={"upload-data"}
                                        label={"Choose data file:"}
                                        onInputChange={this.onInputChange}
                                        onInputDelete={this.onInputDelete}
                                        title={"Upload data"}
                                        type={"data"}
                                    />
                                    <FileSelectZone
                                        accept={".xml"}
                                        id={"upload-rules"}
                                        label={"Choose rules file:"}
                                        onInputChange={this.onInputChange}
                                        onInputDelete={this.onInputDelete}
                                        title={"Upload rules"}
                                        type={"rules"}
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