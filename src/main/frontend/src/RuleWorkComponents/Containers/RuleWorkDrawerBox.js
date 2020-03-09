import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    row: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
    },
    footer: {
        marginTop: 8,
        display: "flex",
        flexDirection: "row-reverse"
    }
},{name: "rule-work-drawer-box"});

function RuleWorkDrawerBox(props) {
    const {children, styleVariant, ...other} = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes[styleVariant])} {...other}>
            {children}
        </div>
    )
}

RuleWorkDrawerBox.propTypes = {
    children: PropTypes.node,
    styleVariant: PropTypes.oneOf(["header", "row", "footer"])
};

RuleWorkDrawerBox.defaultProps = {
    styleVariant: "row",
};

export default RuleWorkDrawerBox;