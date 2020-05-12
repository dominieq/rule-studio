import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { mergeClasses } from "../../utilFunctions";
import UploadOutline from "mdi-material-ui/UploadOutline";
import CustomTooltip from "../../DataDisplay/CustomTooltip";

const useStyles = makeStyles(theme => ({
    icon: {
        color: theme.palette.button.secondary
    },
    wrapper: {
        marginRight: 8,
        display: "flex",
        alignItems: "center"
    }
}), {name: "ExternalRules"});

function ExternalRules(props) {
    const { classes: propsClasses, IconProps, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <CustomTooltip
            classes={{wrapper: classes.wrapper}}
            enterDelay={500}
            enterNextDelay={500}
            title={"You are currently using rule set from external file."}
            {...other}
        >
            <UploadOutline classes={{root: classes.icon}} {...IconProps} />
        </CustomTooltip>
    );
}

ExternalRules.propTypes = {
    classes: PropTypes.object,
    IconProps: PropTypes.object
};

export default ExternalRules;
