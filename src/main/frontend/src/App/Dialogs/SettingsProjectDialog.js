import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { fetchDescriptiveAttributes } from "../../Utils/utilFunctions/fetchFunctions";
import Accept from "./Utils/Accept";
import Cancel from "./Utils/Cancel";
import SimpleContent from "./Utils/SimpleContent"
import SimpleDialog from "./Utils/SimpleDialog";
import CustomTextField from "../../Utils/Inputs/CustomTextField";
import CircleHelper from "../../Utils/Feedback/CircleHelper";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EyeSettings from  "mdi-material-ui/EyeSettings";

/**
 * The ListItemIcon from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href=https://material-ui.com/api/list-item-icon/ target="_blank">ListItemIcon</a>.
 *
 * @class
 * @inner
 * @memberOf SettingsProjectDialog
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props - Any other props will be forwarded to the ListItemIcon component.
 * @returns {React.ReactElement}
 */
const SettingsIcons = withStyles({
    root: {
        color: "inherit",
        marginRight: 16,
        minWidth: 0,
    }

}, {name: "MuiListItemIcon"})(props => <ListItemIcon {...props}>{props.children}</ListItemIcon>);

/**
 * Allows the user to choose index option in current project.
 * Index option determines what should be displayed as an object's name.
 * If there are no description or identification attributes in current information table,
 * only default option is available.
 *
 * @class
 * @category Utils
 * @subcategory Feedback
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
            objectVisibleName: "Default"
        };

        this._attributes = ["Default"];
    };

    processResult = (result, setStateCallback) => {
        if (this._isMounted && result != null && result.hasOwnProperty("available")
            && result.hasOwnProperty("actual")) {

            const objectVisibleName = result.actual === null ? "Default" : result.actual;

            this.setState({
                attributes: [ ...this._attributes, ...result.available ],
                objectVisibleName: objectVisibleName
            }, () => {
                if (typeof setStateCallback === "function") setStateCallback(objectVisibleName);
            });
        }
    };

    getDescriptiveAttributes = () => {
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
            ).then(
                this.processResult
            ).catch(
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

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // TODO prepare more sophisticated conditions to get descriptive attributes
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onIndexOptionChange = (event) => {
        this.setState({
            objectVisibleName: event.target.value
        });
    };

    onAcceptClick = () => {
        this.setState(({loading}) => ({
            loading: { ...loading, attributes: true }
        }), () => {
            const { projectId, serverBase } = this.props;
            const { objectVisibleName } = this.state;
            const resource = "metadata"
            const pathParams = { projectId };
            const queryParams = { objectVisibleName: objectVisibleName === "Default" ? undefined : objectVisibleName };
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
                    }));
                }

                this.props.onClose();
            });
        });
    };

    onEnterKeyPress = (event) => {
        if (event.which === 13 ) {
            event.preventDefault();
            this.onAcceptClick();
        }
    };

    render() {
        const { attributes, objectVisibleName } = this.state;
        const { open } = this.props;

        return (
            <SimpleDialog
                aria-labelledby={"settings-project-dialog"}
                onBackdropClick={this.props.onClose}
                onEnter={this.getDescriptiveAttributes}
                onEscapeKeyDown={this.props.onClose}
                onKeyPress={this.onEnterKeyPress}
                open={open}
            >
                <DialogTitle>
                    Customize project settings
                </DialogTitle>
                <SimpleContent style={{overflow: "hidden"}}>
                    <List style={{width: "100%"}}>
                        <ListItem disableGutters={true}>
                            <SettingsIcons>
                                <EyeSettings />
                            </SettingsIcons>
                            <CustomTextField
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
                </SimpleContent>
                <DialogActions>
                    <Cancel onClick={this.props.onClose} />
                    <Accept onClick={this.onAcceptClick} />
                </DialogActions>
            </SimpleDialog>
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
