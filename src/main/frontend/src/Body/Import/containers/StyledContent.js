import React from "react";
import PropTypes from "prop-types";
import "./StyledContent.css";

function StyledContent(props) {
    const {children, ...other} = props;

    return (
        <div {...other} className={"rule-work-styled-content"}>
            {children}
        </div>
    )
}

StyledContent.propTypes = {
    children: PropTypes.any,
};

export default StyledContent;