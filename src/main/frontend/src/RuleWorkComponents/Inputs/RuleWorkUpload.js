import React from "react"
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
    input: {
        display: "none",
    },
    label: {
        margin: 0,
    },
}, {name: "rule-work-upload"});

function RuleWorkUpload(props) {
    const {children, id, ...other} = props;
    const classes = useStyles();

    return (
        <div id={"rule-work-upload"}>
            <input className={classes.input} id={id} type={"file"} value={""} {...other}/>
            <label className={classes.label} htmlFor={id}>
                {children}
            </label>
        </div>
    )
}

RuleWorkUpload.propTypes = {
    children: PropTypes.node,
    accept: PropTypes.string,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func,
};

RuleWorkUpload.defaultProps = {
    accept: "*",
};

export default RuleWorkUpload;