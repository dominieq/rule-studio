import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StyledDialog from "../../RuleWorkComponents/Feedback/StyledDialog";
import StyledDialogContent from "../../RuleWorkComponents/Feedback/StyledDialogContent";
import RuleWorkTextField from "../../RuleWorkComponents/Inputs/RuleWorkTextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

class RenameProjectDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
        }
    }

    onEnter = () => {
       this.setState({
           name: this.props.currentName,
       });
    };

    onCancelClick = () => {
        this.props.onClose();
    };

    onOkClick = () => {
        this.props.onClose(this.state.name);
    };

    onTextFieldChange = (event) => {
        this.setState({
            name: event.target.value,
        })
    };

    onEnterPress = (event) => {
        if (event.which === 13 && this.state.name) {
            event.preventDefault();
            this.onOkClick(this.state.name);
        }
    };

    render() {
        const name = this.state.name;
        const {children, open} = this.props;

        return (
            <StyledDialog
                open={open}
                onEnter={this.onEnter}
                onKeyPress={this.onEnterPress}
                aria-labelledby={"rename-project-dialog"}
                maxWidth={"sm"}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
            >
                <DialogTitle id={"rename-project-dialog"}>
                    Rename project
                </DialogTitle>
                <StyledDialogContent
                    direction={"row"}
                    dividers={true}
                >
                    <RuleWorkTextField
                        label={"Type new name:"}
                        value={name}
                        onChange={this.onTextFieldChange}
                    />
                </StyledDialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={this.onCancelClick}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!name}
                        onClick={this.onOkClick}
                    >
                        Ok
                    </Button>
                </DialogActions>
                {children}
            </StyledDialog>
        )
    }
}

RenameProjectDialog.propTypes = {
    children: PropTypes.any,
    currentName: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default RenameProjectDialog;