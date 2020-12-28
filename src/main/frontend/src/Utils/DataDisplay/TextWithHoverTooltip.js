import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CustomTooltip from "./CustomTooltip";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";

export const PlainText = withStyles({
    root: {
        fontSize: "unset",
        fontWeight: "unset",
    }
}, {name: "PlainText"})(props => <Typography component={"p"} {...props} />);

const useStyles = makeStyles({
    wrapper: {
        overflow: "hidden"
    },
    wrapperFlex: {
        alignItems: "center",
        display: "flex",
        overflow: "hidden",
        '& > p ~ p': {
            marginLeft: 4
        }
    }
}, {name: "HoverTooltip"});

/**
 * <h3>Overview</h3>
 * The {@link CustomTooltip} component with wrapper element that hides overly long content.
 *
 * <h3>Usage</h3>
 * You can override default Typography element that wraps the text property via <code>children</code> property.
 * You can provide your own tooltip for a component via <code>tooltipTitle</code> property.
 *
 * @constructor
 * @category Utils
 * @subcategory Data Display
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - The content of the component.
 * @param {boolean} [props.roundNumbers=true] - If <code>true</code> any numbers will have 2 digits after decimal point.
 * @param {React.ReactNode} props.text - The content of the component and tooltip.
 * @param {Object} [props.TooltipProps] - Props applied to the {@link CustomTooltip} element.
 * @param {React.ReactNode} [props.tooltipTitle] - Optional title of the component.
 * @param {Object} [props.TypographyProps] - Props applied to the Typography component.
 * @returns {React.ReactElement}
 */
function TextWithHoverTooltip(props) {
    const { children, roundNumbers, TooltipProps, tooltipTitle, TypographyProps } = props;
    let { text } = props;

    let classes = useStyles();

    let displayedTitle = text;

    if (typeof text === "number" && roundNumbers) {
        if (text.toFixed(2).length < text.toString().length) {
            text = text.toFixed(2) + "...";
        }
    }

    return (
        <CustomTooltip
            classes={{wrapper: children ? classes.wrapperFlex : classes.wrapper}}
            disableMaxWidth={true}
            enterDelay={1500}
            enterNextDelay={1500}
            disableFocusListener={true}
            disableTouchListener={true}
            interactive={true}
            leaveDelay={200}
            title={!tooltipTitle ? displayedTitle : tooltipTitle}
            TransitionComponent={Fade}
            {...TooltipProps}
        >
            {!children ?
                <PlainText noWrap={true} {...TypographyProps}>
                    {text}
                </PlainText>
                :
                children
            }
        </CustomTooltip>
    )
}

TextWithHoverTooltip.propTypes = {
    children: PropTypes.node,
    roundNumbers: PropTypes.bool,
    text: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
    tooltipTitle: PropTypes.node,
    TypographyProps: PropTypes.object,
};

TextWithHoverTooltip.defaultProps = {
    roundNumbers: true,
};

export default TextWithHoverTooltip;
