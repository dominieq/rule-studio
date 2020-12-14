import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AcceptButton, CancelButton } from "../Buttons";
import StyledDialogContent from "./StyledDialogContent";
import CustomTextField from "../Inputs/CustomTextField";
import StyledPaper from "../Surfaces/StyledPaper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from  "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle";
import styles from "./styles/StyledContent.module.css";

/**
 * Allows the user to change the name of the current project.
 *
 * @constructor
 * @category Dialogs
 * @param {Object} props
 * @param {string} props.currentName - The name of the current project.
 * @param {boolean} props.open - If <code>true</code> the dialog is open.
 * @param {function} props.onClose - Callback fired when the dialog requests to be closed.
 * @returns {React.PureComponent}
 */
class RenameProjectDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
        }
    }

    onEnter = () => {
       this.setState({
           name: this.props.currentName,
       }, () => {
            const element = document.getElementById("rename-project-input");
            element.focus();
       });
    };

    onCancelClick = () => {
        this.props.onClose();
    };

    onAcceptClick = () => {
        const { name } = this.state;
        this.props.onClose(name);
    };

    onInputChange = (event) => {
        this.setState({
            name: event.target.value,
        })
    };

    onEnterKeyPress = (event) => {
        const { name } = this.state;
        if (event.which === 13 && name) {
            event.preventDefault();
            this.onAcceptClick();
        }
    };

    render() {
        const { name } = this.state;
        const { open } = this.props;

        return (
            <Dialog
                aria-labelledby={"rename-project-dialog"}
                maxWidth={"sm"}
                onBackdropClick={this.onCancelClick}
                onEnter={this.onEnter}
                onEscapeKeyDown={this.onCancelClick}
                onKeyPress={this.onEnterKeyPress}
                open={open}
                PaperComponent={StyledPaper}
            >
                <DialogTitle id={"rename-project-dialog"}>
                    Rename project
                </DialogTitle>
                <StyledDialogContent className={styles.Root}>
                    <CustomTextField
                        autoComplete={"off"}
                        fullWidth={true}
                        InputProps={{
                            id: "rename-project-input"
                        }}
                        onChange={this.onInputChange}
                        outsideLabel={"Type new name"}
                        value={name}
                    />
                </StyledDialogContent>
                <DialogActions>
                    <CancelButton onClick={this.onCancelClick} />
                    <AcceptButton disabled={!name} onClick={this.onAcceptClick} />
                </DialogActions>
            </Dialog>
        )
    }
}

RenameProjectDialog.propTypes = {
    currentName: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

export default RenameProjectDialog;
