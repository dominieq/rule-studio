import React from "react";
import PropTypes from "prop-types";
import AlertBadge from "./AlertBadge";
import AlertCircle from "mdi-material-ui/AlertCircle";

function OutdatedDataAlert(props) {
    return (
        <AlertBadge
            icon={<AlertCircle />}
            title={
                <React.Fragment>
                    <header style={{textAlign: "left"}}>
                        Results in this tab are based on old data and may be invalid.
                    </header>
                    <footer style={{textAlign: "left"}}>
                        Please recalculate to refresh results.
                    </footer>
                </React.Fragment>
            }
        >
            {props.children}
        </AlertBadge>
    );
}

OutdatedDataAlert.propTypes = {
    children: PropTypes.node,
};

export default OutdatedDataAlert;

