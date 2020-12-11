import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { fetchDescriptiveAttributes } from "../utilFunctions/fetchFunctions";
import { AcceptButton, CancelButton } from "../Inputs/StyledButton";
import StyledDialogContent from "./StyledDialogContent"
import CustomTextField from "../Inputs/CustomTextField";
import CircleHelper from "../Feedback/CircleHelper";
import { StyledButton } from "../Inputs/StyledButton";
import StyledPaper from "../Surfaces/StyledPaper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EyeSettings from  "mdi-material-ui/EyeSettings";


const SettingsIcons = withStyles({
    root: {
        color: "inherit",
        marginRight: 16,
        minWidth: 0,
    }

}, {name: "MuiListItemIcon"})(props => <ListItemIcon {...props}>{props.children}</ListItemIcon>);

const useStyles = makeStyles(theme => ({
    root: {
        padding: 0,
        textAlign: "center",
        textTransform: "none"
    },
    warning: {
        color: theme.palette.warning.main
    },
}), {name: "UpdateHelperText"});

function UpdateAlert(props, ref) {
    const { children, onClick } = props;

    const classes = useStyles();

    return (
        <StyledButton
            ButtonRef={ref}
            className={clsx("MuiFormHelperText-root", classes.root, classes.warning)}
            onClick={onClick}
        >
            {children}
        </StyledButton>
    );
}

const UpdateAlertForwardRef = React.forwardRef(UpdateAlert);

/**
 * Allows the user to choose index option in current project.
 * Index option determines what should be displayed as an object's name.
 * If there are no description or identification attributes in current information table,
 * only default option is available.
 *
 * @constructor
 * @category Dialogs
 * @param {Object} props
 * @param {function} props.onClose - Callback fired when the component requests to be closed.
 * @param {function} props.onObjectNamesChanges - Callback fired when global object names have been changed.
 * @param {function} props.onSnackbarOpen - Callback fired when the component requests to display an error.
 * @param {boolean} props.open - If <code>true</code> the dialog is open.
 * @param {string} props.projectId - The identifier of a selected project.
 * @param {string} props.serverBase - The host and port in the URL of an API call.
 * @returns {React.PureComponent}
 */
class SettingsProjectDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: {
                attributes: false,
                objectVisibleName: false
            },
            attributes: ["Default"],
            objectVisibleName: "Default",
            isEverywhere: true,
            hasChanged: false
        };

        this._attributes = ["Default"];
    };

    processResult = (result, setStateCallback) => {
        if (this._isMounted && result != null && result.hasOwnProperty("available")
            && result.hasOwnProperty("actual")) {

            const objectVisibleName = result.actual === null ? "Default" : result.actual;

            this.setState(({isEverywhere}) => ({
                attributes: [ ...this._attributes, ...result.available ],
                objectVisibleName: objectVisibleName,
                isEverywhere: result.hasOwnProperty("isEverywhere") ? result.isEverywhere : isEverywhere
            }), () => {
                if (typeof setStateCallback === "function") setStateCallback(objectVisibleName);
            });
        }
    };

    getDescriptiveAttributes = (processResultCallback) => {
        this.setState(({loading}) => ({
            loading: { ...loading, objectVisibleName: true }
        }), () => {
            const { projectId, serverBase } = this.props;
            const resource = "metadata";
            const pathParams = { projectId };
            const queryParams = { objectVisibleName: undefined };
            const method = "GET";

            fetchDescriptiveAttributes(
                resource, pathParams, queryParams, method, serverBase
            ).then(result => {
                this.processResult(result, processResultCallback);
            }).catch(
                this.props.onSnackbarOpen
            ).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, objectVisibleName: false }
                    }));
                }
            });
        });
    };

    postDescriptiveAttributes = (finallyCallback) => {
        this.setState(({loading}) => ({
            loading: { ...loading, attributes: true }
        }), () => {
            const { projectId, serverBase } = this.props;
            const { objectVisibleName } = this.state;
            const resource = "metadata"
            const pathParams = { projectId };
            const queryParams = { objectVisibleName: objectVisibleName === "Default"
                    ? undefined : objectVisibleName };
            const method = "POST";

            fetchDescriptiveAttributes(
                resource, pathParams, queryParams, method, serverBase
            ).then(result => {
                this.processResult(result, this.props.onObjectNamesChange);
            }).catch(
                this.props.onSnackbarOpen
            ).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, attributes: false }
                    }), () => {
                        if (typeof finallyCallback === "function") finallyCallback();
                    });
                }
            });
        });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onIndexOptionChange = (event) => {
        this.setState({
            objectVisibleName: event.target.value,
            hasChanged: true
        });
    };

    onAcceptClick = (setStateCallback) => {
        const { hasChanged } = this.state;

        if (hasChanged) {
            this.postDescriptiveAttributes(() => {
                this.setState({
                    hasChanged: false
                }, () => {
                    if (typeof setStateCallback === "function") setStateCallback();
                });
            });
        } else {
            this.props.onClose();
        }
    };

    onEnterKeyPress = (event) => {
        if (event.which === 13 ) {
            event.preventDefault();
            this.onAcceptClick();
        }
    };

    getHelperText = (isEverywhere) => {
        if (isEverywhere) {
            return undefined;
        }

        return "Visible object name has changed in some tabs. Click to refresh."
    }

    render() {
        const { attributes, objectVisibleName, isEverywhere } = this.state;
        const { open } = this.props;

        return (
            <Dialog
                aria-labelledby={"settings-project-dialog"}
                onBackdropClick={this.props.onClose}
                onEnter={() => this.getDescriptiveAttributes(() => {
                    const {isEverywhere} = this.state;
                    if (!isEverywhere) this.props.onObjectNamesChange(null);
                })}
                onEscapeKeyDown={this.props.onClose}
                onKeyPress={this.onEnterKeyPress}
                open={open}
                PaperComponent={StyledPaper}
            >
                <DialogTitle>
                    Customize project settings
                </DialogTitle>
                <StyledDialogContent style={{overflow: "hidden"}}>
                    <List style={{width: "100%"}}>
                        <ListItem disableGutters={true}>
                            <SettingsIcons>
                                <EyeSettings />
                            </SettingsIcons>
                            <CustomTextField
                                helperText={this.getHelperText(isEverywhere)}
                                FormHelperTextProps={{
                                    component: UpdateAlertForwardRef,
                                    onClick: this.postDescriptiveAttributes
                                }}
                                onChange={this.onIndexOptionChange}
                                outsideLabel={"Choose objects visible name"}
                                select={true}
                                value={objectVisibleName}
                            >
                                {attributes}
                            </CustomTextField>
                            <CircleHelper
                                title={"Sets default names of objects."}
                                TooltipProps={{
                                    placement: "top-end"
                                }}
                                WrapperProps={{
                                    style: {marginLeft: 16}
                                }}
                            />
                        </ListItem>
                    </List>
                </StyledDialogContent>
                <DialogActions>
                    <CancelButton onClick={this.props.onClose} />
                    <AcceptButton onClick={() => this.onAcceptClick(this.props.onClose)} />
                </DialogActions>
            </Dialog>
        );
    }
}

SettingsProjectDialog.propTypes = {
    onClose: PropTypes.func,
    onObjectNamesChange: PropTypes.func,
    onSnackbarOpen: PropTypes.func,
    open: PropTypes.bool.isRequired,
    projectId: PropTypes.string,
    serverBase: PropTypes.string
};

export default SettingsProjectDialog;
