import React from "react";
import PropTypes from "prop-types";
import AlertBadge from "./AlertBadge";
import AlertCircle from "mdi-material-ui/AlertCircle";

function OutdatedDataAlert(props) {
    return (
        <AlertBadge
            icon={<AlertCircle />}
            title={"Results in this tab are based on old data. Recalculate to refresh results."}
        >
            {props.children}
        </AlertBadge>
    );
}

OutdatedDataAlert.propTypes = {
    children: PropTypes.node,
};

export default OutdatedDataAlert;

