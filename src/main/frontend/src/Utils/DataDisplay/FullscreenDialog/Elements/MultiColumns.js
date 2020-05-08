import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";

const contentStyles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "space-between",
        margin: "2.5%",
        overflow: "hidden",
        padding: 0,
        '& > *': {
            paddingBottom: 1,
            width: props => { return (90 / props.number) + "%" }
        }
    }
}, {name: "MultiColumns"});

function MultiColumns(props) {
    const contentClasses = contentStyles({number: props.numberOfColumns});

    return (
        <DialogContent classes={{root: contentClasses.root}}>
            {props.children}
        </DialogContent>
    )
}

MultiColumns.propTypes = {
    children: PropTypes.node,
    numberOfColumns: PropTypes.number,
};

MultiColumns.defaultProps = {
    numberOfColumns: 3
};

export default MultiColumns;
