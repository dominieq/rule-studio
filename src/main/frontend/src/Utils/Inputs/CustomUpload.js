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
 * Wrapper component that enables any passed element to serve as an upload button.
 * CustomUpload consists of input and label elements that are connected by id and htmlFor tags.
 * Input's display is set to "none" so that only label is visible.
 *
 * @name Custom Upload
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param props {Object} - Any other props will be forwarded to the input element.
 * @param [props.children] {React.ReactNode} - The content of the component.
 * @param [props.accept=*] {string} - Specifies what file types the user can pick from the file input dialog box
 * @param props.id {string} - The id tag of an input element and htmlFor tag of an label element.
 * @param [props.onChange] - Callback fired when a file was chosen.
 * @returns {React.ReactElement} - The CustomUpload component.
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