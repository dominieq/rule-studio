import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../../DataDisplay/CustomTooltip";
import { StyledIconButton } from "../StyledButton";
import Badge from "@material-ui/core/Badge";
import Sort from "@material-ui/icons/Sort";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.text.special1
    }
}), {name: "SortDot"});

/**
 * The Badge component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/badge/" target="_blank">Badge</a>.
 *
 * @name Dot Badge
 * @constructor
 * @category Utils
 * @subcategory Sort Menu
 * @param props {Object} - Any other props will be forwarded to the Badge component.
 * @returns {React.ReactElement} - The Badge component from Material-UI library.
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
 * The {@link StyledIconButton} wrapped around in {@link DotBadge} and {@link CustomTooltip}.
 * Use badge to signal that sorting parameters has changed.
 *
 * @name Sort Button
 * @constructor
 * @category Utils
 * @subcategory Sort Menu
 * @param props {Object}
 * @param [props.ButtonProps] {Object} - Props applied to the {@link StyledIconButton} element.
 * @param [props.icon] {React.ReactNode} - The content of the {@link StyledIconButton} element.
 * @param [props.invisible] {boolean} - If <code>true</code> the {@link DotBadge} element will be hidden.
 * @param props.tooltip {React.ReactNode} - The content of the {@link CustomTooltip} element.
 * @param [props.TooltipProps] {Object} - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement}
 */
function SortButton(props) {
    const { ButtonProps, icon, invisible, tooltip, TooltipProps } = props;

    return (
        <CustomTooltip title={tooltip} {...TooltipProps}>
            <DotBadge invisible={invisible}>
                <StyledIconButton
                    aria-label={"sort button"}
                    color={"secondary"}
                    {...ButtonProps}
                >
                    { Boolean(icon) ? icon : <Sort /> }
                </StyledIconButton>
            </DotBadge>
        </CustomTooltip>
    )
}

SortButton.propTypes = {
    ButtonProps: PropTypes.shape({
        'aria-label': PropTypes.any,
        'aria-controls': PropTypes.any,
        'aria-haspopup': PropTypes.bool,
        onClick: PropTypes.func,
    }),
    icon: PropTypes.node,
    invisible: PropTypes.bool,
    tooltip: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
};

export default SortButton;
