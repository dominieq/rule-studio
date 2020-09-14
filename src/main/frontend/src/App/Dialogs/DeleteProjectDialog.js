import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Accept from "./Utils/Accept";
import Cancel from "./Utils/Cancel";
import SimpleContent from "./Utils/SimpleContent";
import SimpleDialog from "./Utils/SimpleDialog";
import CustomTextField from "../../Utils/Inputs/CustomTextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(theme => ({
    projectName: {
        color: theme.palette.text.special1
    }
}), {name: "Delete"});

/**
 * Provides special styling for the project's name.
 *
 * @class
 * @inner
 * @memberOf DeleteProjectDialog
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props - Any other props will be forwarded to the span element.
 * @returns {React.ReactElement}
 */
function ProjectName(props) {
    const classes = useStyles();

    return (
        <span aria-label={"project name"} className={classes.projectName} {...props} />
    )
}

/**
 * Allows the user to delete current project. The user has to type the project's name
 * to prevent themselves from making hasty decisions.
 *
 * @class
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - The optional content of the dialog.
 * @param {string} props.currentName - The name of the current project.
 * @param {boolean} props.open - If <code>true</code> the dialog is open.
 * @param {function} props.onClose - Callback fired when the dialog requests to be closed.
 * @returns {React.PureComponent}
 */
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
        }, () => {
            const element = document.getElementById("delete-project-input");
            element.focus();
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
                    Confirm deletion of: <ProjectName>{currentName}</ProjectName>
                </DialogTitle>
                <SimpleContent>
                    <CustomTextField
                        autoComplete={"off"}
                        fullWidth={true}
                        InputProps={{
                            id: "delete-project-input"
                        }}
                        onChange={this.onInputChange}
                        outsideLabel={"Type project name"}
                        value={name}
                    />
                </SimpleContent>
                <DialogActions>
                    <Cancel color={"primary"} onClick={this.onCancelClick} />
                    <Accept color={"secondary"} disabled={!correct} onClick={this.onDeleteClick}>
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
