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
}, {name: "CustomUpload"});

function CustomUpload(props) {
    const {children, id, ...other} = props;
    const classes = useStyles();

    return (
        <div aria-label={"custom upload"}>
            <input className={classes.input} id={id} type={"file"} value={""} {...other}/>
            <label className={classes.label} htmlFor={id}>
                {children}
            </label>
        </div>
    )
}

CustomUpload.propTypes = {
    children: PropTypes.node,
    accept: PropTypes.string,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func,
};

CustomUpload.defaultProps = {
    accept: "*",
};

export default CustomUpload;