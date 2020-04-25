import React, { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import RuleWorkTooltip from "../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import StyledButton from "../../RuleWorkComponents/Inputs/StyledButton";
import StyledDivider from "../../RuleWorkComponents/DataDisplay/StyledDivider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import RenameBox from "mdi-material-ui/RenameBox";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js";
import styles from "../styles/ProjectMenu.module.css";

const menuStyles = makeStyles(theme => ({
    list: {
        backgroundColor: theme.palette.popper.background,
        color: theme.palette.popper.text
    }
}), {name: "ProjectMenu"});

function ProjectMenu(props) {
    const [anchorE1, setAnchorE1] = useState(null);
    const list = useRef(null);
    const menuClasses = menuStyles();

    const { currentProject, projects } = props;

    let primaryText = projects[0];
    if (currentProject > 0) {
        primaryText = "Active project -";
    }

    let displayedProjects = projects.slice(1);

    const onListItemClick = (event) => {
        setAnchorE1(event.currentTarget);
    };

    const onMenuItemClick = (event, index) => {
        setAnchorE1(null);
        props.onProjectClick(index);
    };

    const onMenuClose = () => {
        setAnchorE1(null);
    };

    return (
        <div aria-label={"project-menu"} className={styles.Root}>
            <StyledDivider margin={16} />
            <List component={"nav"} disablePadding={true}>
                <ListItem
                    aria-controls={"project-menu"}
                    aria-haspopup={"true"}
                    button={true}
                    disableGutters={true}
                    onClick={onListItemClick}
                    ref={list}
                    style={{
                        borderRadius: 4,
                        paddingLeft: 8,
                        paddingRight: 8
                    }}
                >
                    <Typography style={{marginRight: "0.25em"}} color={"inherit"} variant={"button"}>
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
                    classes={{
                        list: menuClasses.list
                    }}
                    getContentAnchorEl={null}
                    id={"project-menu"}
                    keepMounted={true}
                    onClose={onMenuClose}
                    open={Boolean(anchorE1)}
                    PaperProps={{
                        style: {minWidth: list.current.offsetWidth}
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
                            onClick={event => onMenuItemClick(event, index)}
                        >
                            {project.result.name}
                        </MenuItem>
                    ))}
                </Menu>
            }
            {currentProject > 0 ?
                <Fragment>
                    <RuleWorkTooltip title={"Project settings"}>
                        <StyledButton
                            aria-label={"project-settings"}
                            isIcon={true}
                            onClick={() => props.onDialogOpen("settingsDialog")}
                        >
                            <SvgIcon><path d={mdiCog} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <RuleWorkTooltip title={"Rename project"}>
                        <StyledButton
                            aria-label={"rename-project-button"}
                            isIcon={true}
                            onClick={() => props.onDialogOpen("renameDialog")}
                        >
                            <RenameBox />
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{ flexGrow: 1 }} />
                    <RuleWorkTooltip title={"Delete project"}>
                        <StyledButton
                            aria-label={"delete-project-button"}
                            isIcon={true}
                            onClick={() => props.onDialogOpen("deleteDialog")}>
                            <DeleteIcon />
                        </StyledButton>
                    </RuleWorkTooltip>
                </Fragment>
                :
                <span style={{ flexGrow: 1 }} />
            }
            <StyledDivider margin={16} />
        </div>
    );
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