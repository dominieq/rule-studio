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

/**
 * <h3>Overview</h3>
 * The component consists of <code>input</code> and <code>label</code> tags
 * that are connected by <code>id</code> and <code>htmlFor</code> attributes.
 * Input's <code>display</code> is set to <code>none</code> so that only label is visible.
 *
 * <h3>Goal</h3>
 * The goal of this component is to enable any passed children to serve as an upload button.
 *
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props  - Any other props will be forwarded to the input element.
 * @param {React.ReactNode} [props.children] - The content of the component.
 * @param {string} [props.accept = *] - Specifies what file types the user can pick from the file input dialog box
 * @param {string} props.id - The id attributes of an input element and htmlFor attributes of an label element.
 * @param {function} [props.onChange] - Callback fired when a file was chosen.
 * @returns {React.ReactElement}
 */
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
