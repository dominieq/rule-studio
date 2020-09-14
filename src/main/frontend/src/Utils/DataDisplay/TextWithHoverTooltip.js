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
 * The {@link CustomTooltip} component with wrapper element that hides overly long content.
 * You can override default Typography element that wraps the text property by using the children property.
 * You can provide your own title (tooltip) for a component by using the tooltipTitle property.
 *
 * @name Text with Hover Tooltip
 * @constructor
 * @category Utils
 * @subcategory Data Display
 * @param props {Object}
 * @param [props.children] {React.ReactNode} - The content of the component. <br>
 *     This property is optional and if present will override text property.
 * @param [props.roundNumbers=true] {boolean} - If <code>true</code> any numbers will have only 2 digits after decimal point.
 * @param props.text {React.ReactNode} - The content of the component. <br>
 *     The value from this property is transferred to the tooltip as well.
 * @param [props.TooltipProps] {Object} - Props applied to the {@link CustomTooltip} element.
 * @param [props.tooltipTitle] {React.ReactNode} - The title of the component. <br>
 *     This property is optional and if present will override text property.
 * @param [props.TypographyProps] {Object} - Props applied to the Typography component.
 * @returns {React.Component} {@link CustomTooltip}
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
