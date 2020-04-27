import React from "react";
import {makeStyles} from "@material-ui/core";
import {UploadOutline} from "mdi-material-ui";
import RuleWorkTooltip from "../../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";

const iconStyle = makeStyles(theme => ({
    root: {
        color: theme.palette.button.secondary,
    }
}), {name: "MuiSvgRoot"});

const tooltipStyle = makeStyles({
    wrapper: {
        marginRight: 8,
        display: "flex",
        alignItems: "center",
    },
}, {name: "MuiTooltip"});

function ExternalRulesAlert() {
    const iconClasses = iconStyle();
    const tooltipClasses = tooltipStyle();

    return (
        <RuleWorkTooltip
            classes={{wrapper: tooltipClasses.wrapper}}
            leaveDelay={1000}
            title={"You are currently using rule set from external file"}
        >
            <UploadOutline classes={{...iconClasses}} />
        </RuleWorkTooltip>
    )
}

export default ExternalRulesAlert;