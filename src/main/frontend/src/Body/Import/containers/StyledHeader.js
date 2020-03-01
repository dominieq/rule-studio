import React from "react";
import PropTypes from "prop-types";
import "./StyledHeader.css";

function StyledHeader(props) {
    const {children, ...other} = props;

    return (
        <div {...other} className={"rule-work-styled-header"}>
            {children}
        </div>
    )
}

StyledHeader.propTypes = {
    children: PropTypes.any,
};

export default StyledHeader;