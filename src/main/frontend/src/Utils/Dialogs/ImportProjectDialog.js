import React from "react";
import PropTypes from "prop-types";
import StyledDialogContent from "./StyledDialogContent";
import { AcceptButton, CancelButton } from "../Buttons";
import FileSelectZone from "../../Body/Import/Elements/FileSelectZone";
import StyledPaper from "../Surfaces/StyledPaper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

/**
 * <h3>Overview</h3>
 * Allows a user to choose and import a ZIP file with theirs project.
 *
 * @constructor
 * @category Dialogs
 * @param {Object} props
 * @param {function} props.onImportProject - Callback fired when project was requested to be imported.
 * @param {boolean} props.open - If <code>true</code> the Dialog is open.
 * @returns {React.PureComponent}
 */
class ImportProjectDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            file: null
        };
    }

    onFileChange = (file) => {
        if (file.hasOwnProperty("file")) {
            this.setState({ file: file.file });
        }
    };

    onFileDelete = () => {
        this.setState({ file: null });
    };

    onAccept = () => {
        const { file } = this.state;
        this.props.onImportProject(file);
    };

    onCancel = () => {
        this.props.onImportProject(null)
    };

    onEnterKeyPressed = (event) => {
        const { file } = this.state;

        if (event.which === 13 && file != null) {
            event.preventDefault();
            this.props.onImportProject(file);
        }
    };

    render() {
        const { file } = this.state;
        const { open } = this.props;

        return (
            <Dialog
                aria-labelledby={"import-project-dialog"}
                maxWidth={false}
                onBackdropClick={this.onCancel}
                onEnter={this.onFileDelete}
                onEscapeKeyDown={this.onCancel}
                onKeyPress={this.onEnterKeyPressed}
                open={open}
                PaperComponent={StyledPaper}
                PaperProps={file == null ? { style: { minWidth: "30%" }} : undefined}
            >
                <DialogTitle id={"import-project-dialog"}>
                    Open project
                </DialogTitle>
                <StyledDialogContent>
                    <FileSelectZone
                        accept={".zip"}
                        id={"upload-project"}
                        label={"Choose project file:"}
                        onInputChange={this.onFileChange}
                        onInputDelete={this.onFileDelete}
                        title={"Upload project"}
                        TooltipProps={{
                            enterDelay: 500,
                            enterNextDelay: 500,
                            placement: "top"
                        }}
                        type={"project"}
                    />
                </StyledDialogContent>
                <DialogActions>
                    <CancelButton onClick={this.onCancel} />
                    <AcceptButton disabled={file == null} onClick={this.onAccept} />
                </DialogActions>
            </Dialog>
        );
    }
}

ImportProjectDialog.propTypes = {
    onImportProject: PropTypes.func,
    open: PropTypes.bool.isRequired
};

export default ImportProjectDialog;
