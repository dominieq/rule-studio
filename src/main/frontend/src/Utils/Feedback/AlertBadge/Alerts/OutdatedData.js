import React from "react";
import PropTypes from "prop-types";
import AlertBadge from "../AlertBadge";
import AlertCircle from "mdi-material-ui/AlertCircle";

function OutdatedData(props) {
    return (
        <AlertBadge
            icon={<AlertCircle style={{height: "0.75em", width: "0.75em"}} />}
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
            severity={"error"}
        >
            {props.children}
        </AlertBadge>
    );
}

OutdatedData.propTypes = {
    children: PropTypes.node,
};

export default OutdatedData;
