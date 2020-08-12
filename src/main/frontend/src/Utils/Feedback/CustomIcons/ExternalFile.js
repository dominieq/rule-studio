import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { mergeClasses } from "../../utilFunctions";
import UploadOutline from "mdi-material-ui/UploadOutline";
import CustomTooltip from "../../DataDisplay/CustomTooltip";

const useStyles = makeStyles(theme => ({
    icon: {
        color: theme.palette.text.special1
    },
    wrapper: {
        display: "flex",
        alignItems: "center"
    }
}), {name: "ExternalFile"});

/**
 * Used to signal that results shown in a particular tab are from an external source.
 *
 * @name External File
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param props {Object} - Any other props will be forwarded to the {@link CustomTooltip} element.
 * @param [props.IconProps] - Props applied to the icon element.
 * @returns {React.ReactElement}
 */
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
