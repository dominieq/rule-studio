import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";

const useStyles = makeStyles({
    root: {
        backgroundColor: "#545F66",
        color: "#ABFAA9",
        "&:hover": {
            color: "#6BD425"
        }
    }
}, {name: "ExpansionPanel"});

function StyledExpansionPanel(props) {
    const {children, ...other} = props;
    const classes = useStyles();

    return (
        <ExpansionPanel {...other} classes={{root: classes.root}} square={true}>
            {children}
        </ExpansionPanel>
    );
}

StyledExpansionPanel.propTypes = {
    children: PropTypes.node,
};

export default StyledExpansionPanel;