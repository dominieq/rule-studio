import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    label: {
        minWidth: "fit-content",
        marginRight: "16px"
    },
    "filter-no-results": {
        color: theme.palette.text.default,
    }
}), {name: "rule-work"});

function StyledTypography(props) {
    const {children, styleVariant, ...other} = props;
    const classes = useStyles();

    return (
        <Typography className={classes[styleVariant]} component={"p"} {...other}>
            {children}
        </Typography>
    )
}

StyledTypography.propTypes = {
    children: PropTypes.node,
    styleVariant: PropTypes.oneOf(["label", "filter-no-results"]),
};

export default StyledTypography;