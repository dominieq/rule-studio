import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import CustomTooltip from "../Utils/DataDisplay/CustomTooltip";
import { StyledButton, StyledIconButton } from "../Utils/Buttons";
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

/**
 * The AppBar and Toolbar components from Material-UI with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/app-bar/" target="_blank">AppBar</a>
 * and
 * <a href="https://material-ui.com/api/toolbar/" target="_blank">Toolbar</a>.
 *
 * @category Header
 * @constructor
 * @param {Object} props
 * @param {Object} props.appBarRef - A reference object forwarded to the AppBar component.
 * @param {React.ReactElement} props.children - Should be the {@link ProjectMenu} element.
 * @param {function} props.onBodyChange - Callback fired when body was changed.
 * @param {function} props.onColorsChange - Callback fired when colours were changed.
 * @returns {React.ReactElement}
 */
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
                    onClick={props.onImportOpen}
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
