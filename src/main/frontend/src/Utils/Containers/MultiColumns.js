import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import styles from "./styles/MultiColumns.module.css";

const useStyles = makeStyles({
    Children: {
        '& > *': {
            width: props => { return (90 / props.number) + "%" }
        }
    }
}, {name: "MultiColumns"});

/**
 * <h3>Overview</h3>
 * A component that is going to display an array of elements inside of a 'div'
 * and assign width property to each one of them.
 *
 * <h3>Usage</h3>
 * Children have 90% of available width. Then each child gets (90% / number of columns) of width.
 *
 * @constructor
 * @category Utils
 * @subcategory Containers
 * @param {Object} props - Any other props will be forwarded to root element.
 * @param {React.ReactNode} [props.children] - The content of the component.
 * @param {Object} [props.classes] - Override or extend the styles applied to the component.
 * @param {number} [props.numberOfColumns=3] - Preferable number of columns in the component.
 * @returns {React.ReactElement}
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
