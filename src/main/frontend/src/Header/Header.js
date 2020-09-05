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
    const { appBarRef, children, onBodyChange, onColorsChange } = props;
    const classes = useStyles();

    return (
        <AppBar classes={{root: classes.root}} color={"default"} position={"sticky"} ref={appBarRef}>
            <Toolbar>
                <StyledIconButton name={"home"} onClick={() => onBodyChange("Home")}>
                    <HomeIcon />
                </StyledIconButton>
                <StyledButton name={"new project"} onClick={() => onBodyChange("Import")}>
                    New Project
                </StyledButton>
                {children}
                <StyledButton name={"help"} onClick={() => onBodyChange("Help")}>
                    Help
                </StyledButton>
                <CustomTooltip title={"Change colors"}>
                    <StyledIconButton name={"change colors"} onClick={onColorsChange}>
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
    onColorsChange: PropTypes.func
};

export default Header;