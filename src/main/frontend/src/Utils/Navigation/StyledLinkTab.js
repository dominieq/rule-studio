import React from "react";
import { LinkPropTypes, MuiTabPropTypes } from "./propTypes";
import StyledTab from "./StyledTab";
import { Link } from "react-router-dom";

/**
 * <h3>Overview</h3>
 * The {@link StyledTab} component with Link from react-router as root element.
 *
 * @constructor
 * @category Utils
 * @subcategory Navigation
 * @param {Object} props - All props will be forwarded to the {@link StyledTab} element.
 * @return {React.ReactElement}
 */
function StyledLinkTab(props) {
    return (
        <StyledTab component={Link} {...props} />
    );
}

StyledLinkTab.propTypes = {
    ...MuiTabPropTypes,
    ...LinkPropTypes
}

export default StyledLinkTab;
