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
