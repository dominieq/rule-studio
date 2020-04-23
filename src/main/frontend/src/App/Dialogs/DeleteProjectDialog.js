import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Accept from "./Utils/Accept";
import Cancel from "./Utils/Cancel";
import SimpleContent from "./Utils/SimpleContent";
import SimpleDialog from "./Utils/SimpleDialog";
import RuleWorkTextField from "../../RuleWorkComponents/Inputs/RuleWorkTextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

class DeleteProjectDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            correct: false,
        };
    }

    onEnter = () => {
        this.setState({
            name: "",
            correct: false,
        });
    };

    onInputChange = (event) => {
        this.setState({
            name: event.target.value,
        }, () => {
            const { currentName } = this.props;
            const { name } = this.state;

            if (currentName === name) {
                this.setState({ correct: true });
            } else {
                this.setState({ correct: false });
            }
        });
    };

    onCancelClick = () => {
        this.props.onClose(false);
    };

    onDeleteClick = () => {
        this.props.onClose(true);
    };

    onEnterKeyPress = (event) => {
        const { correct } =  this.state;
        if (event.which === 13 && correct) {
            event.preventDefault();
            this.onDeleteClick();
        }
    };

    render() {
        const { name, correct } = this.state;
        const { children, currentName, open } = this.props;

        return (
            <SimpleDialog
                aria-labelledby={"delete-project-dialog"}
                maxWidth={"sm"}
                onBackdropClick={this.onCancelClick}
                onEnter={this.onEnter}
                onEscapeKeyDown={this.onCancelClick}
                onKeyPress={this.onEnterKeyPress}
                open={open}
            >
                <DialogTitle id={"delete-project-dialog"}>
                    Confirm deletion of {currentName}
                </DialogTitle>
                <SimpleContent>
                    <RuleWorkTextField
                        fullWidth={true}
                        onChange={this.onInputChange}
                        outsideLabel={"Type project name"}
                        value={name}
                    />
                </SimpleContent>
                <DialogActions>
                    <Cancel onClick={this.onCancelClick} themeVariant={"primary"} />
                    <Accept
                        disabled={!correct}
                        onClick={this.onDeleteClick}
                        themeVariant={"secondary"}
                    >
                        Delete
                    </Accept>
                </DialogActions>
                {children}
            </SimpleDialog>
        )
    }
}

DeleteProjectDialog.propTypes = {
    children: PropTypes.any,
    currentName: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default DeleteProjectDialog;
