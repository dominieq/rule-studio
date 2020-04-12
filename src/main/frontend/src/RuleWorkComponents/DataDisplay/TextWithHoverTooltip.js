import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import RuleWorkTooltip from "./RuleWorkTooltip";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";

export const PlainText = withStyles({
    root: {
        fontSize: "unset",
        fontWeight: "unset",
    }
}, {name: "text"})(props => <Typography component={"p"} {...props} />);

const wrapperStyles = makeStyles({
    wrapper: {
        overflow: "hidden"
    }
}, {name: "MuiTooltip"});

function TextWithHoverTooltip(props) {
    const { roundNumbers, TooltipProps, tooltipText, TypographyProps } = props;
    let { text } = props;
    const wrapperClasses = wrapperStyles();

    let displayedTooltip = text;

    if (typeof text === "number" && roundNumbers) {
        if (text.toFixed(2).length <= text.toString().length) {
            text = text.toFixed(2) + "...";
        }
    }

    return (
        <RuleWorkTooltip
            classes={{wrapper: wrapperClasses.wrapper}}
            enterDelay={1500}
            enterNextDelay={1500}
            disableFocusListener={true}
            disableTouchListener={true}
            interactive={true}
            leaveDelay={200}
            title={!tooltipText ? displayedTooltip : tooltipText}
            TransitionComponent={Fade}
            {...TooltipProps}
        >
            <PlainText noWrap={true} {...TypographyProps}>
                {text}
            </PlainText>
        </RuleWorkTooltip>
    )
}

TextWithHoverTooltip.propTypes = {
    roundNumbers: PropTypes.bool,
    text: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
    tooltipText: PropTypes.node,
    TypographyProps: PropTypes.object,
};

TextWithHoverTooltip.defaultProps = {
    roundNumbers: true,
};

export default TextWithHoverTooltip;