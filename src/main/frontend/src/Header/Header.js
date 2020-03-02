import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import HomeIcon from "@material-ui/icons/Home";
import ProjectMenu from "./ProjectMenu";

const useStyles = makeStyles({
    colorPrimary: {
        color: "#2A3439",
        backgroundColor: "#66FF66",
    }
});

function Header(props) {
    const {onButtonClick, ...other} = props;
    const classes = useStyles();

    return (
        <AppBar classes={{colorPrimary: classes.colorPrimary}} position={"static"}>
            <Toolbar>
                <Button color={"inherit"} onClick={() => onButtonClick("Home")}>
                    <HomeIcon />
                </Button>
                <Button  color={"inherit"} onClick={() => onButtonClick("Import")}>
                    Import
                </Button>
                <ProjectMenu {...other}/>
                <Button color={"inherit"} onClick={() => onButtonClick("Help")}>
                    Help
                </Button>
            </Toolbar>
        </AppBar>
    );
}

Header.propTypes = {
    onButtonClick: PropTypes.func.isRequired,
    currentProject: PropTypes.number.isRequired,
    projects: PropTypes.array.isRequired,
    onProjectClick: PropTypes.func.isRequired,
    onProjectDelete: PropTypes.func.isRequired,
    onProjectRename: PropTypes.func.isRequired,
};

export default Header;