import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import RuleWorkButton from "../RuleWorkComponents/Inputs/RuleWorkButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import RenameBox from "mdi-material-ui/RenameBox";
import "./ProjectMenu.css";

class ProjectMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorE1: null,
        };
    }

    onListItemClick = (event) => {
        this.setState({
            anchorE1: event.currentTarget,
        });
    };

    onMenuItemClick = (event, index) => {
        this.setState({
            anchorE1: null,
        }, () => {
            this.props.onProjectClick(index - 1);
        });
    };

    onMenuClose = () => {
        this.setState({
            anchorE1: null,
        });
    };

    renderProjectButtons = () => {
        if (this.props.currentProject > 0) {
            return (
                <Fragment>
                    <RuleWorkButton
                        ariaLabel={"rename-project-button"}
                        buttonVariant={"icon"}
                        onClick={this.props.onProjectRename}
                        title={"Rename project"}
                    >
                        <RenameBox />
                    </RuleWorkButton>
                    <span />
                    <RuleWorkButton
                        ariaLabel={"delete-project-button"}
                        buttonVariant={"icon"}
                        onClick={this.props.onProjectDelete}
                        title={"Delete project"}
                    >
                        <DeleteIcon />
                    </RuleWorkButton>
                </Fragment>
            )
        }  else {
            return null;
        }
    };

    render() {
        const anchorE1 = this.state.anchorE1;
        const {currentProject, projects} = this.props;

        let primaryText = "Select your project";
        if (currentProject > 0) {
            primaryText = "Active project: " + projects[currentProject].name;
        }

        return (
            <div className={"rule-work-project-panel"}>
                <List component={"nav"} >
                    <ListItem
                        button
                        aria-haspopup={"true"}
                        aria-controls={"lock-menu"}
                        onClick={this.onListItemClick}>
                        <Typography color={"inherit"} variant={"button"}>{primaryText}</Typography>
                    </ListItem>
                </List>
                <Menu
                    anchorEl={anchorE1}
                    keepMounted
                    open={Boolean(anchorE1)}
                    onClose={this.onMenuClose}
                >
                    {projects.map((project, index) => (
                        <MenuItem
                            key={index}
                            disabled={index === 0}
                            selected={index === currentProject}
                            onClick={event => this.onMenuItemClick(event, index)}>
                            {typeof project === "string" ? project : project.name}
                        </MenuItem>
                    ))}
                </Menu>
                {this.renderProjectButtons()}
            </div>
        )
    }
}

ProjectMenu.propTypes = {
    currentProject: PropTypes.number.isRequired,
    projects: PropTypes.array.isRequired,
    onProjectClick: PropTypes.func.isRequired,
    onProjectDelete: PropTypes.func.isRequired,
    onProjectRename: PropTypes.func.isRequired,
};

export default ProjectMenu;