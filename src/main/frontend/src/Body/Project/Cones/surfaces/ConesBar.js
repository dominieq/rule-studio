import React from 'react';
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import "./ConesBar.css";

function ConesBar(props) {
    const children = props.children;

    return (
        <Paper className={"cones-bar"} component={"span"} square elevation={3}>
            {children}
        </Paper>
    );
}

ConesBar.propTypes = {
    children: PropTypes.array.isRequired,
};

export default ConesBar;