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

        this.list = React.createRef();
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
            this.props.onProjectClick(index);
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
                            onClick={() => this.props.onDialogOpen("settingsDialog")}
                        >
                            <SvgIcon><path d={mdiCog} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <RuleWorkTooltip title={"Rename project"}>
                        <StyledButton
                            aria-label={"rename-project-button"}
                            isIcon={true}
                            onClick={() => this.props.onDialogOpen("renameDialog")}
                        >
                            <RenameBox />
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <RuleWorkTooltip title={"Delete project"}>
                        <StyledButton
                            aria-label={"delete-project-button"}
                            isIcon={true}
                            onClick={() => this.props.onDialogOpen("deleteDialog")}>
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

        let primaryText = projects[0];
        if (currentProject > 0) {
            primaryText = "Active project :";
        }

        let displayedProjects = projects.slice(1);

        return (
            <RuleWorkSmallBox id={"project-menu"} style={{flexGrow: 1, margin: "0 16px"}}>
                <List component={"nav"} disablePadding={true}>
                    <ListItem
                        aria-controls={"project-menu"}
                        aria-haspopup={"true"}
                        button={true}
                        onClick={this.onListItemClick}
                        ref={this.list}
                        style={{borderRadius: 4}}
                    >
                        <Typography color={"inherit"} style={{marginRight: 8}} variant={"button"}>
                            {primaryText}
                        </Typography>
                        {currentProject > 0 &&
                            <Typography color={"inherit"}>
                                {projects[currentProject].result.name}
                            </Typography>
                        }
                    </ListItem>
                </List>
                {Boolean(displayedProjects.length) &&
                    <Menu
                        anchorEl={anchorE1}
                        anchorOrigin={{
                            horizontal: "center",
                            vertical: "bottom"
                        }}
                        getContentAnchorEl={null}
                        id={"project-menu"}
                        keepMounted={true}
                        onClose={this.onMenuClose}
                        open={Boolean(anchorE1)}
                        PaperProps={{
                            style: {minWidth: this.list.current.offsetWidth}
                        }}
                        transformOrigin={{
                            horizontal: "center",
                            vertical: "top",
                        }}
                    >
                        {displayedProjects.map((project, index) => (
                            <MenuItem
                                key={index}
                                selected={index === currentProject}
                                onClick={event => this.onMenuItemClick(event, index)}
                            >
                                {project.result.name}
                            </MenuItem>
                        ))}
                    </Menu>
                }
                {this.renderProjectButtons()}
            </RuleWorkSmallBox>
        )
    }
}

ProjectMenu.propTypes = {
    currentProject: PropTypes.number,
    onProjectClick: PropTypes.func,
    onDialogOpen: PropTypes.func,
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