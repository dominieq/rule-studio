import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Accept from "./Utils/Accept";
import Cancel from "./Utils/Cancel"
import SimpleContent from "./Utils/SimpleContent";
import SimpleDialog from "./Utils/SimpleDialog";
import RuleWorkTextField from "../../RuleWorkComponents/Inputs/RuleWorkTextField";
import DialogActions from  "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle";

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
        const { children, open } = this.props;

        return (
            <SimpleDialog
                aria-labelledby={"rename-project-dialog"}
                maxWidth={"sm"}
                onBackdropClick={this.onCancelClick}
                onEnter={this.onEnter}
                onEscapeKeyDown={this.onCancelClick}
                onKeyPress={this.onEnterKeyPress}
                open={open}
            >
                <DialogTitle id={"rename-project-dialog"}>
                    Rename project
                </DialogTitle>
                <SimpleContent>
                    <RuleWorkTextField
                        fullWidth={true}
                        onChange={this.onInputChange}
                        outsideLabel={"Type new name"}
                        value={name}
                    />
                </SimpleContent>
                <DialogActions>
                    <Cancel onClick={this.onCancelClick} />
                    <Accept disabled={!name} onClick={this.onAcceptClick} />
                </DialogActions>
                {children}
            </SimpleDialog>
        )
    }
}

RenameProjectDialog.propTypes = {
    children: PropTypes.node,
    currentName: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default RenameProjectDialog;