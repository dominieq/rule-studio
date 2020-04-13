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
}, {name: "plain-text"})(props => <Typography component={"p"} {...props} />);

const wrapperStyles = makeStyles({
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
}, {name: "text-with-hover-tooltip"});

function TextWithHoverTooltip(props) {
    const { children, roundNumbers, TooltipProps, tooltipTitle, TypographyProps } = props;
    let { text } = props;
    const wrapperClasses = wrapperStyles();

    let displayedTitle = text;

    if (typeof text === "number" && roundNumbers) {
        if (text.toFixed(2).length <= text.toString().length) {
            text = text.toFixed(2) + "...";
        }
    }

    return (
        <RuleWorkTooltip
            classes={{wrapper: children ? wrapperClasses.wrapperFlex : wrapperClasses.wrapper}}
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
        </RuleWorkTooltip>
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