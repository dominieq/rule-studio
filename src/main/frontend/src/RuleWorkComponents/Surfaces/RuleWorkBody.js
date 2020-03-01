import React from "react";
import PropTypes from "prop-types";
import "./RuleWorkBody.css"

function RuleWorkBody(props) {
    const {children, ...other} =  props;

    return (
        <div {...other} className={"rule-work-body"}>
            {children}
        </div>
    )
}

RuleWorkBody.propTypes = {
    children: PropTypes.any,
};

export default RuleWorkBody;