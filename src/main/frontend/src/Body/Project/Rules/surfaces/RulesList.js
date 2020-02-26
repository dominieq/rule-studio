import React from 'react';
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import "./RulesList.css";

function RulesList(props) {
    const children = props.children;

    return (
        <Paper
            className={"rules-list"}
            square={true}
            elevation={2}
        >
            <List component={"nav"} aria-label={"rules-list"}>
                {children}
            </List>
        </Paper>
    )
}

RulesList.propTypes = {
    children: PropTypes.array.isRequired,
};

export default RulesList