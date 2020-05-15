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
        display: "flex",
        alignItems: "center"
    }
}), {name: "ExternalFile"});

function ExternalFile(props) {
    const { classes: propsClasses, IconProps, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <CustomTooltip
            classes={{wrapper: classes.wrapper}}
            enterDelay={500}
            enterNextDelay={500}
            title={"Results in this tab are based on an external file."}
            {...other}
        >
            <UploadOutline classes={{root: classes.icon}} {...IconProps} />
        </CustomTooltip>
    );
}

ExternalFile.propTypes = {
    classes: PropTypes.shape({
        icon: PropTypes.string,
        wrapper: PropTypes.string
    }),
    IconProps: PropTypes.object
};

export default ExternalFile;
