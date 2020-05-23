import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import CustomTooltip from "../Utils/DataDisplay/CustomTooltip";
import StyledButton from "../Utils/Inputs/StyledButton";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import HomeIcon from "@material-ui/icons/Home";
import Palette from "mdi-material-ui/Palette";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.main2,
        color: theme.palette.text.main2,
        zIndex: theme.zIndex.drawer + 100
    }
}), {name: "CustomAppBar"});

function Header(props) {
    const { appBarRef, children, onBodyChange, onColorsChange } = props;
    const classes = useStyles();

    return (
        <AppBar classes={{root: classes.root}} color={"default"} position={"sticky"} ref={appBarRef}>
            <Toolbar>
                <StyledButton color={"inherit"} isIcon={true} name={"home"} onClick={() => onBodyChange("Home")}>
                    <HomeIcon />
                </StyledButton>
                <StyledButton name={"new project"} onClick={() => onBodyChange("Import")}>
                    New Project
                </StyledButton>
                {children}
                <StyledButton name={"help"} onClick={() => onBodyChange("Help")}>
                    Help
                </StyledButton>
                <CustomTooltip title={"Change colors"}>
                    <StyledButton color={"inherit"} isIcon={true} name={"change colors"} onClick={onColorsChange}>
                        <Palette />
                    </StyledButton>
                </CustomTooltip>
            </Toolbar>
        </AppBar>
    );
}

Header.propTypes = {
    appBarRef: PropTypes.object,
    children: PropTypes.element,
    onBodyChange: PropTypes.func,
    onColorsChange: PropTypes.func
};

export default Header;