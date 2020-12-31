import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../DataDisplay/CustomTooltip";
import StyledIconButton from "./StyledButton/StyledIconButton";
import { ButtonWithTooltipPropTypes, StyledIconButtonPropTypes } from "./StyledButton/propTypes";
import Badge from "@material-ui/core/Badge";
import Sort from "@material-ui/icons/Sort";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.text.special1
    }
}), {name: "SortDot"});

/**
 * <h3>Overview</h3>
 * The Badge component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/badge/" target="_blank">Badge</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props - Any other props will be forwarded to the Badge component.
 * @returns {React.ReactElement}
 */
function DotBadge(props) {
    const classes = useStyles();

    return (
        <Badge
            aria-label={"sort-dot"}
            anchorOrigin={{horizontal: "right", vertical: "bottom"}}
            classes={{dot: classes.root}}
            component={"div"}
            overlap={"circle"}
            variant={"dot"}
            {...props}
        />
    );
}

/**
 * <h3>Overview</h3>
 * The {@link StyledIconButton} wrapped around in {@link DotBadge} and {@link CustomTooltip}.
 * Use badge to signal that sorting parameters has changed.
 *
 * @constructor
 * @category Buttons
 * @param {Object} props - Any other props will be forwarded to the {@link StyledIconButton} element.
 * @param {React.ReactNode} [props.icon] - The content of the {@link StyledIconButton} element.
 * @param {boolean} [props.invisible] - If <code>true</code> the {@link DotBadge} element will be hidden.
 * @param {React.ReactNode} props.tooltip - The content of the {@link CustomTooltip} element.
 * @param {string} props.tooltipId - The id of the {@link CustomTooltip} element.
 * @param {Object} [props.TooltipProps] - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement}
 */
function SortButton(props) {
    const { icon, invisible, tooltip, tooltipId, TooltipProps, ...other } = props;

    return (
        <CustomTooltip id={tooltipId} title={tooltip} {...TooltipProps}>
            <DotBadge invisible={invisible}>
                <StyledIconButton aria-label={"sort-button"} color={"secondary"} {...other}>
                    { icon != null ? icon : <Sort /> }
                </StyledIconButton>
            </DotBadge>
        </CustomTooltip>
    );
}

SortButton.propTypes = {
    'aria-label': PropTypes.any,
    'aria-controls': PropTypes.any,
    'aria-haspopup': PropTypes.bool,
    ...StyledIconButtonPropTypes,
    icon: PropTypes.node,
    invisible: PropTypes.bool,
    ...ButtonWithTooltipPropTypes,
};

export default SortButton;
