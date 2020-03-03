import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStylesDefault = makeStyles({
    root: {
        position: "relative",
        padding: "2px 15px 2px",
        color: "#ABFAA9",
        backgroundColor: "#545F66",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
    },
}, {name: "StyledRuleWorkBar"});

function StyledRuleWorkBar(props) {
    const {children, variant, ...other} = props;
    const classesDefault = useStylesDefault();

    return (
        {
            "default":
                <Paper
                    {...other}
                    classes={{root: classesDefault.root}}
                    square={true}
                    variant={"outlined"}
                >
                    {children}
                </Paper>,
        }[variant]
    )
}

StyledRuleWorkBar.propTypes = {
    children: PropTypes.any,
    variant: PropTypes.oneOf(["default"]),
};

StyledRuleWorkBar.defaultProps = {
    variant: "default",
};

export default StyledRuleWorkBar;