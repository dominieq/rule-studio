import React from "react";
import PropTypes from "prop-types";
import "./RuleWorkBody.css"

function RuleWorkBody(props) {
    const {children, variant, ...other} =  props;

    return (
        {
            "body": <div {...other} className={"rule-work-body"}>
                {children}
            </div>,
            "tab":  <div {...other} className={"rule-work-tab-body"}>
                {children}
            </div>,
        }[variant]
    )
}

RuleWorkBody.propTypes = {
    children: PropTypes.any,
    variant: PropTypes.oneOf(["body", "tab"])
};

RuleWorkBody.defualtProps = {
    variant: "body",
};

export default RuleWorkBody;