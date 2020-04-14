import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Accept from "./Utils/Accept";
import Cancel from "./Utils/Cancel";
import SimpleContent from "./Utils/SimpleContent"
import SimpleDialog from "./Utils/SimpleDialog";
import RuleWorkTextField from "../../RuleWorkComponents/Inputs/RuleWorkTextField";
import CircleHelper from "../../RuleWorkComponents/Feedback/CircleHelper";
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


class SettingsProjectDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            indexOption: "default",
        };
    };

    onEnter = () => {
        this.setState({...this.props.settings})
    };

    onIndexOptionChange = (event) => {
        this.setState({
            indexOption: event.target.value
        });
    };

    onAcceptClick = () => {
        this.props.onClose({...this.state})
    };

    onCancelClick = () => {
        this.props.onClose({...this.props.settings});
    };

    onEnterKeyPress = (event) => {
        if (event.which === 13 ) {
            event.preventDefault();
            this.onAcceptClick();
        }
    };

    render() {
        const { indexOption } = this.state;
        const { attributes, children, open } = this.props;
        let options = ["default"];
        if (attributes) {
            for (let i = 0; i < attributes.length; i++) {
                if (Object.keys(attributes[i]).includes("identifierType") && attributes[i].active) {
                    options = [...options, attributes[i].name];
                } else if (Object.keys(attributes[i]).includes("type") && attributes[i].type === "description") {
                    options = [...options, attributes[i].name]
                }
            }
        }

        return (
            <SimpleDialog
                aria-labelledby={"settings-project-dialog"}
                onBackdropClick={this.onCancelClick}
                onEnter={this.onEnter}
                onEscapeKeyDown={this.onCancelClick}
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
                            <RuleWorkTextField
                                onChange={this.onIndexOptionChange}
                                outsideLabel={"Choose object's visible description"}
                                select={true}
                                value={indexOption}
                            >
                                {options}
                            </RuleWorkTextField>
                            <CircleHelper
                                title={"Sets names of objects that will be displayed in tabs."}
                                TooltipProps={{
                                    placement: "top-start"
                                }}
                                WrapperProps={{
                                    style: {marginLeft: 16}
                                }}
                            />
                        </ListItem>
                    </List>
                </SimpleContent>
                <DialogActions>
                    <Cancel onClick={this.onCancelClick} />
                    <Accept disabled={false} onClick={this.onAcceptClick} />
                </DialogActions>
                {children}
            </SimpleDialog>
        );
    }
}

SettingsProjectDialog.propTypes = {
    attributes: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.node,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    settings: PropTypes.shape({
        indexOption: PropTypes.string,
    }),
};

export default SettingsProjectDialog;
