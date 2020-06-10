import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Accept from "./Utils/Accept";
import Cancel from "./Utils/Cancel";
import FileSelectZone from "../../Body/Import/Elements/FileSelectZone";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import StyledPaper from "../../Utils/Surfaces/StyledPaper";

const StyledContent = withStyles(theme => ({
    dividers: {
        borderTopColor: theme.palette.text.main1,
        borderBottomColor: theme.palette.text.main1
    }
}), {name: "StyledContent"})(props => <DialogContent dividers={true} {...props} />);

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
                <StyledContent>
                    <FileSelectZone
                        accept={".json"}
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
                </StyledContent>
                <DialogActions>
                    <Cancel onClick={this.onCancel} />
                    <Accept disabled={file == null} onClick={this.onAccept} />
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
