import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { StyledPaperPropTypes } from "./propTypes";
import { mergeClasses } from "../utilFunctions";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1,
    }
}), {name: "StyledPaper"});

/**
 * <h3>Overview</h3>
 * The Paper component from Material-UI with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/paper/" target="_blank">Paper</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Surfaces
 * @param {Object} props - Any other props will be forwarded to the Paper component.
 * @returns {React.ReactElement}
 */
function StyledPaper(props) {
    const { classes: propsClasses, paperRef, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
            <Paper classes={{root: classes.root}} ref={paperRef} {...other} />
    );
}

StyledPaper.propTypes = { ...StyledPaperPropTypes };

export default StyledPaper;
