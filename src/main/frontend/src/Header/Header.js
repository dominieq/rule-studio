import React from 'react';
import {makeStyles} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import ProjectMenu from "./ProjectMenu/ProjectMenu";


const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1
    },
    projectMenu: {
        flexGrow: 1
    }
}));

function Header(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position={"static"} >
                <Toolbar>
                    <IconButton edge={"start"}>
                        <HomeIcon />
                    </IconButton>
                    <Button >
                        Import
                    </Button>
                    <ProjectMenu
                        currentProject={props.currentProject}
                        projects={props.projects}
                        className={classes.projectMenu}
                    />
                    <Button edge={"end"}>
                        Help
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header;