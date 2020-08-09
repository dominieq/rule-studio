import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../../../utilFunctions";
import styles from "../styles/MultiColumns.module.css";

const useStyles = makeStyles({
    Children: {
        '& > *': {
            width: props => { return (90 / props.number) + "%" }
        }
    }
}, {name: "MultiColumns"});

/**
 * A component that is going to display an array of elements inside of a 'div'
 * and assign width property to each one of them.
 *
 * @name Multi Columns
 * @constructor
 * @category Utils
 * @subcategory Fullscreen Dialog
 * @param props {Object} - Any other props will be forwarded to 'div' element.
 * @param [props.children] {React.ReactNode} - The content of the component. <br>
 *     Preferably, it should be an array of elements.
 * @param [props.classes] {Object} - Override or extend the styles applied to the component.
 * @param [props.numberOfColumns=3] {number} - Determines how much space should each column have: <br>
 *     <code>90% / numberOfColumns</code>.
 * @returns {React.ReactElement} A 'div' element with content inside of it.
 */
function MultiColumns(props) {
    const { classes: propsClasses, numberOfColumns, ...other } = props;
    let classes = useStyles({ number: numberOfColumns });

    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <div className={clsx(styles.Root, classes.Children)} {...other} />
    );
}

MultiColumns.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.shape({
        Children: PropTypes.string
    }),
    numberOfColumns: PropTypes.number,
};

MultiColumns.defaultProps = {
    numberOfColumns: 3
};

export default MultiColumns;
