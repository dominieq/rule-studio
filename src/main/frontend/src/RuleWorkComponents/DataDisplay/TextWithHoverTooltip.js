import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import RuleWorkTooltip from "./RuleWorkTooltip";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";

export const PlainText = withStyles({
    root: {
        fontSize: "unset"
    }
}, {name: "text"})(props => <Typography component={"p"} {...props} />);

const wrapperStyles = makeStyles({
    wrapper: {
        overflow: "hidden"
    }
}, {name: "MuiTooltip"});

function TextWithHoverTooltip(props) {
    const { text, TooltipProps, TypographyProps } = props;
    const wrapperClasses = wrapperStyles();

    return (
        <RuleWorkTooltip
            classes={{wrapper: wrapperClasses.wrapper}}
            enterDelay={1500}
            enterNextDelay={1500}
            disableFocusListener={true}
            disableTouchListener={true}
            interactive={true}
            leaveDelay={200}
            title={text}
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
    text: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
    TypographyProps: PropTypes.object,
};

export default TextWithHoverTooltip;