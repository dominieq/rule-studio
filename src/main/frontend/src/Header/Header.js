import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import CustomTooltip from "../Utils/DataDisplay/CustomTooltip";
import { StyledButton, StyledIconButton } from "../Utils/Inputs/StyledButton";
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
    const classes = useStyles();

    return (
        <AppBar
            classes={{root: classes.root}}
            color={"default"}
            position={"sticky"}
            ref={props.appBarRef}
        >
            <Toolbar component={"section"}>
                <StyledIconButton
                    name={"home"}
                    onClick={() => props.onBodyChange("Home")}
                >
                    <HomeIcon />
                </StyledIconButton>
                <StyledButton
                    name={"new project"}
                    onClick={() => props.onBodyChange("Import")}
                    style={{ marginLeft: 8, marginRight: 8 }}
                >
                    New Project
                </StyledButton>
                <StyledButton
                    name={"open project"}
                    onClick={() => props.onImportOpen}
                >
                    Open Project
                </StyledButton>
                { props.children }
                <StyledButton
                    name={"help"}
                    onClick={() => props.onBodyChange("Help")}
                    style={{ marginRight: 8 }}
                >
                    Help
                </StyledButton>
                <CustomTooltip title={"Change colors"}>
                    <StyledIconButton
                        name={"change colors"}
                        onClick={props.onColorsChange}
                    >
                        <Palette />
                    </StyledIconButton>
                </CustomTooltip>
            </Toolbar>
        </AppBar>
    );
}

Header.propTypes = {
    appBarRef: PropTypes.object,
    children: PropTypes.element,
    onBodyChange: PropTypes.func,
    onColorsChange: PropTypes.func,
    onImportOpen: PropTypes.func
};

export default Header;
