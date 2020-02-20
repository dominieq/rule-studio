import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper";
import "./UnionsBar.css"

class UnionsBar extends Component {

    render() {
        return (
            <Paper className={"unions-bar"} square elevation={2}>
                {this.props.children}
            </Paper>
        )
    };
}

UnionsBar.propTypes = {
    children: PropTypes.array.isRequired,
};

export default UnionsBar;