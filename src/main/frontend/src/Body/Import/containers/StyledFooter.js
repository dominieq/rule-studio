import React from "react";
import PropTypes from "prop-types";
import "./StyledFooter.css";

function StyledFooter(props) {
    const {children, ...other} = props;

    return (
        <div {...other} className={"rule-work-styled-footer"}>
            {children}
        </div>
    );
}

StyledFooter.propTypes = {
    children: PropTypes.any,
};

export default StyledFooter;