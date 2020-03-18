import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import RuleWorkSmallBox from "../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTooltip from "../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import StyledButton from "../RuleWorkComponents/Inputs/StyledButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import RenameBox from "mdi-material-ui/RenameBox";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js";

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
                    <RuleWorkTooltip title={"Project settings"}>
                        <StyledButton
                            aria-label={"project-settings"}
                            isIcon={true}
                            onClick={this.props.onProjectSettings}
                        >
                            <SvgIcon><path d={mdiCog} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <RuleWorkTooltip title={"Rename project"}>
                        <StyledButton
                            aria-label={"rename-project-button"}
                            isIcon={true}
                            onClick={this.props.onProjectRename}
                        >
                            <RenameBox />
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <RuleWorkTooltip title={"Delete project"}>
                        <StyledButton
                            aria-label={"delete-project-button"}
                            isIcon={true}
                            onClick={this.props.onProjectDelete}>
                            <DeleteIcon />
                        </StyledButton>
                    </RuleWorkTooltip>
                </Fragment>
            )
        }  else {
            return <span style={{flexGrow: 1}} />;
        }
    };

    render() {
        const anchorE1 = this.state.anchorE1;
        const {currentProject, projects} = this.props;

        let primaryText = "Select your project";
        if (currentProject > 0) {
            primaryText = "Active project " + projects[currentProject].result.name;
        }

        return (
            <RuleWorkSmallBox id={"project-menu"} style={{flexGrow: 1}}>
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
                    {projects && projects.map((project, index) => (
                        <MenuItem
                            key={index}
                            disabled={index === 0}
                            selected={index === currentProject}
                            onClick={event => this.onMenuItemClick(event, index)}>
                            {typeof project === "string" ? project : project.result.name}
                        </MenuItem>
                    ))}
                </Menu>
                {this.renderProjectButtons()}
            </RuleWorkSmallBox>
        )
    }
}

ProjectMenu.propTypes = {
    currentProject: PropTypes.number,
    onProjectClick: PropTypes.func,
    onProjectDelete: PropTypes.func,
    onProjectRename: PropTypes.func,
    onProjectSettings: PropTypes.func,
    projects: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            result: PropTypes.object,
            externalRules: PropTypes.bool,
            threshold: PropTypes.number,
            measure: PropTypes.string,
            ruleType: PropTypes.string,
            foldDisplay: PropTypes.number,
            foldIndex: PropTypes.number,
            foldNumber: PropTypes.number,
        })
    ])),
};

export default ProjectMenu;