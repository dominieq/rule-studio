import React from "react";
import PropTypes from "prop-types";
import AlertBadge from "./AlertBadge";
import FileAlert from "mdi-material-ui/FileAlert";

function OutdatedRulesAlert(props) {
    return (
        <AlertBadge
            icon={<FileAlert />}
            title={"You've just uploaded your own rules. However, results in this tab are based on different rule set."}
        >
            {props.children}
        </AlertBadge>
    );
}

OutdatedRulesAlert.propTypes = {
    children: PropTypes.node,
};

export default OutdatedRulesAlert;