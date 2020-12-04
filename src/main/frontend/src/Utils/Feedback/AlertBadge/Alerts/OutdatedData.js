import React from "react";
import PropTypes from "prop-types";
import AlertBadge from "../AlertBadge";
import AlertCircle from "mdi-material-ui/AlertCircle";

function DefaultMessage() {
    return (
        <React.Fragment>
            <header style={{textAlign: "left"}}>
                Results in this tab are outdated.
            </header>
            <footer style={{textAlign: "left"}}>
                Please recalculate to refresh results.
            </footer>
        </React.Fragment>
    );
}

function Messages(props) {
    const { messages } = props;
    const style = {
        marginTop: 0,
        marginBottom: "0.5em",
        textAlign: "left"
    };

    return (
        <React.Fragment>
            {messages.map((message, index) => (
                <p key={index} style={index === messages.length - 1 ? { ...style, marginBottom: 0 } : style}>
                    {message}
                </p>
            ))}
        </React.Fragment>
    );
}

Messages.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.string)
};

/**
 * Used to signal that results shown in a particular tab are outdated.
 *
 * @name Outdated Data
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props - Any other props will be forwarded to the {@link AlertBadge} element.
 * @param {string[]} props.messages - Optional messages displayed in alert.
 * @returns {React.ReactElement}
 */
function OutdatedData(props) {
    const { messages, ...other } = props;

    return (
        <AlertBadge
            icon={<AlertCircle style={{height: "0.75em", width: "0.75em"}} />}
            title={
                <React.Fragment>
                    {Array.isArray(messages) && messages.length > 0 ?
                        <Messages messages={messages} />
                        :
                        <DefaultMessage />
                    }
                </React.Fragment>

            }
            severity={"error"}
            {...other}
        />
    );
}

OutdatedData.propTypes = {
    anchorOrigin: PropTypes.shape({
        horizontal: PropTypes.oneOf(["left", "right"]),
        vertical: PropTypes.oneOf(["bottom", "top"])
    }),
    badgeContent: PropTypes.node,
    children: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["default", "error", "primary", "secondary"]),
    component: PropTypes.elementType,
    invisible: PropTypes.bool,
    max: PropTypes.number,
    messages: PropTypes.arrayOf(PropTypes.string),
    overlap: PropTypes.oneOf(["circle", "rectangle"]),
    severity: PropTypes.oneOf(["error", "info", "success", "warning"]),
    showZero: PropTypes.bool,
    TooltipProps: PropTypes.object,
    variant: PropTypes.oneOf(["dot", "standard"])
};

export default OutdatedData;
