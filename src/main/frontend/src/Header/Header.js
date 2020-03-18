import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import RuleWorkTooltip from "../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import StyledButton from "../RuleWorkComponents/Inputs/StyledButton";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import HomeIcon from "@material-ui/icons/Home";
import Palette from "mdi-material-ui/Palette";

const useStyles = makeStyles({
    colorPrimary: {
        color: "#2A3439",
        backgroundColor: "#66FF66",
    }
}, {name: "MuiAppBar"});

function Header(props) {
    const {children, onBodyChange, onColorsChange} = props;
    const classes = useStyles();

    return (
        <AppBar classes={{colorPrimary: classes.colorPrimary}} position={"relative"}>
            <Toolbar>
                <StyledButton color={"inherit"} isIcon={true} onClick={() => onBodyChange("Home")}>
                    <HomeIcon />
                </StyledButton>
                <StyledButton onClick={() => onBodyChange("Import")}>
                    New Project
                </StyledButton>
                {children}
                <StyledButton onClick={() => onBodyChange("Help")}>
                    Help
                </StyledButton>
                <RuleWorkTooltip title={"Change colors"}>
                    <StyledButton color={"inherit"} isIcon={true} onClick={onColorsChange}>
                        <Palette />
                    </StyledButton>
                </RuleWorkTooltip>
            </Toolbar>
        </AppBar>
    );
}

Header.propTypes = {
    children: PropTypes.element,
    onBodyChange: PropTypes.func,
    onColorsChange: PropTypes.func,
};

export default Header;