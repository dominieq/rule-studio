import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
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
 * @param {React.ReactNode} [props.children] - The optional content of the dialog.
 * @param {Array.<string|number>} props.indexOptions - The list of all possible options.
 * @param {function} props.onClose - Callback fired when the dialog requests to be closed.
 * @parma {boolean} props.open - If <code>true</code> the dialog is open.
 * @param {Object} props.settings - The settings from current project.
 * @param {string} props.setting.indexOption - Determines what should be displayed as an object's name.
 * @returns {React.PureComponent}
 */
class SettingsProjectDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            attributes: ["Default"],
            visibleObjectName: "Default"
        };

        this._attributes = ["Default"];
    };

    onEnter = () => {
        // TODO GET descriptive attributes
    };

    onIndexOptionChange = (event) => {
        this.setState({
            visibleObjectName: event.target.value
        });
    };

    onAcceptClick = () => {
        // TODO POST visible object name
    };

    onEnterKeyPress = (event) => {
        if (event.which === 13 ) {
            event.preventDefault();
            this.onAcceptClick();
        }
    };

    render() {
        const { attributes, visibleObjectName } = this.state;
        const { open } = this.props;

        return (
            <SimpleDialog
                aria-labelledby={"settings-project-dialog"}
                onBackdropClick={this.props.onClose}
                onEnter={this.onEnter}
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
                                value={visibleObjectName}
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
    open: PropTypes.bool.isRequired,
};

export default SettingsProjectDialog;
