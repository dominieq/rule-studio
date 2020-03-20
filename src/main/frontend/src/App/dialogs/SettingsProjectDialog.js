import React, {Component} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Accept from "./Utils/Accept";
import Cancel from "./Utils/Cancel";
import RuleWorkTextField from "../../RuleWorkComponents/Inputs/RuleWorkTextField";
import RuleWorkHelper from "../../RuleWorkComponents/Feedback/RuleWorkHelper";
import StyledDialog from "../../RuleWorkComponents/Feedback/StyledDialog";
import StyledDialogContent from "../../RuleWorkComponents/Feedback/StyledDialogContent"
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


class SettingsProjectDialog extends Component {
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

    render() {
        const attributes = this.props.attributes;
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
            <StyledDialog
                aria-labelledby={"settings-project-dialog"}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onClose={this.props.onClose}
                onEnter={this.onEnter}
                open={this.props.open}
            >
                <DialogTitle>
                    Customize project settings
                </DialogTitle>
                <StyledDialogContent>
                    <List style={{width: "100%"}}>
                        <ListItem disableGutters={true}>
                            <SettingsIcons>
                                <EyeSettings />
                            </SettingsIcons>
                            <RuleWorkTextField
                                hasOutsideLabel={true}
                                onChange={this.onIndexOptionChange}
                                outsideLabel={"Choose object's visible description"}
                                select={true}
                                value={this.state.indexOption}
                            >
                                {options}
                            </RuleWorkTextField>
                            <RuleWorkHelper style={{marginLeft: 16}} >
                                Sets names of objects that will be displayed in tabs.
                            </RuleWorkHelper>
                        </ListItem>
                    </List>
                </StyledDialogContent>
                <DialogActions>
                    <Cancel onClick={this.onCancelClick} />
                    <Accept disabled={false} onClick={this.onAcceptClick} />
                </DialogActions>
                {this.props.children}
            </StyledDialog>
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