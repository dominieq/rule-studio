import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import FilesDetails from "./FilesDetails";
import CustomTooltip from "../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../Utils/Inputs/StyledButton";
import StyledDivider from "../../Utils/DataDisplay/StyledDivider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import RenameBox from "mdi-material-ui/RenameBox";
import SaveAlt from "@material-ui/icons/SaveAlt";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCog} from "@mdi/js";
import styles from "../styles/ProjectMenu.module.css";

const menuStyles = makeStyles(theme => ({
    list: {
        backgroundColor: theme.palette.background.sub,
        color: theme.palette.text.main2
    }
}), {name: "ProjectMenu"});

function ProjectMenu(props) {
    const [anchorE1, setAnchorE1] = useState(null);
    const list = useRef(null);
    const menuClasses = menuStyles();

    const { currentProject, projects } = props;

    let primaryText = projects[0];
    let files = []
    if (currentProject > 0) {
        primaryText = "Active project -";

        const { result } = projects[currentProject];

        if (result.hasOwnProperty("metadataFileName")) {
            files = [ ...files, { label: "Metadata", value: result.metadataFileName }];
        }
        if (result.hasOwnProperty("dataFileName")) {
            files = [ ...files, { label: "Data", value: result.dataFileName }];
        }

        if (result.rules && result.rules.hasOwnProperty("rulesFileName")) {
            files = [ ...files, { label: "Rules", value: result.rules.rulesFileName}];
        }
        if (result.classification && result.classification.hasOwnProperty("externalDataFileName")) {
            files = [ ...files, { label: "Classified data", value: result.classification.externalDataFileName }];
        }
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
        <section id={"project-panel"} className={styles.Root}>
            <StyledDivider margin={16} />
            <List component={"div"} disablePadding={true}>
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
                <section className={styles.Buttons}>
                    <FilesDetails
                        files={files}
                        WrapperProps={{ id: "files-details-button" }}
                    />
                    <CustomTooltip
                        title={"Project settings"}
                        WrapperProps={{ id: "project-settings-button" }}
                    >
                        <StyledIconButton
                            aria-label={"project-settings-button"}
                            onClick={() => props.onDialogOpen("settingsDialog")}
                        >
                            <SvgIcon><path d={mdiCog} /></SvgIcon>
                        </StyledIconButton>
                    </CustomTooltip>
                    <CustomTooltip
                        title={"Rename project"}
                        WrapperProps={{ id: "rename-project-button" }}
                    >
                        <StyledIconButton
                            aria-label={"rename-project-button"}
                            onClick={() => props.onDialogOpen("renameDialog")}
                        >
                            <RenameBox />
                        </StyledIconButton>
                    </CustomTooltip>
                    <CustomTooltip
                        title={"Save project to ZIP file"}
                        WrapperProps={{ id: "save-project-button" }}
                    >
                        <StyledIconButton
                            aria-label={"save-project-button"}
                            onClick={props.onSaveProject}
                        >
                            <SaveAlt />
                        </StyledIconButton>
                    </CustomTooltip>
                    <CustomTooltip
                        title={"Delete project"}
                        WrapperProps={{
                            id: "delete-project-button",
                            style: { marginLeft: "auto" }
                        }}
                    >
                        <StyledIconButton
                            aria-label={"delete-project-button"}
                            onClick={() => props.onDialogOpen("deleteDialog")}>
                            <DeleteIcon />
                        </StyledIconButton>
                    </CustomTooltip>
                </section>
                :
                <span style={{ flexGrow: 1 }} />
            }
            <StyledDivider margin={16} />
        </section>
    );
}

ProjectMenu.propTypes = {
    currentProject: PropTypes.number,
    onProjectClick: PropTypes.func,
    onDialogOpen: PropTypes.func,
    onSaveProject: PropTypes.func,
    projects: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            result: PropTypes.object,
        })
    ]))
};

export default ProjectMenu;
