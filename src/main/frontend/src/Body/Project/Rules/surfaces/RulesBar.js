import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import "./RulesBar.css";

function RulesBar(props) {
    const children = props.children;

    return (
        <Paper className={"rules-bar"} square elevation={2}>
            {children}
        </Paper>
    );
}

RulesBar.propTypes = {
    children: PropTypes.any.isRequired,
};

export default RulesBar;