import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import ProjectMenu from "./ProjectMenu";
import StyledButton from "../RuleWorkComponents/Inputs/StyledButton";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import HomeIcon from "@material-ui/icons/Home";

const useStyles = makeStyles({
    colorPrimary: {
        color: "#2A3439",
        backgroundColor: "#66FF66",
    }
}, {name: "MuiAppBar"});

function Header(props) {
    const {onButtonClick, ...other} = props;
    const classes = useStyles();

    return (
        <AppBar classes={{colorPrimary: classes.colorPrimary}} position={"relative"}>
            <Toolbar>
                <StyledButton buttonVariant={"icon"} onClick={() => onButtonClick("Home")}>
                    <HomeIcon />
                </StyledButton>
                <StyledButton onClick={() => onButtonClick("Import")}>
                    Import
                </StyledButton>
                <ProjectMenu {...other}/>
                <StyledButton onClick={() => onButtonClick("Help")}>
                    Help
                </StyledButton>
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