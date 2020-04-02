import React, {useRef, useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import VirtualizedMatrix from "./VirtualizedMatrix";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";

function PaperComponent(props) {
    return (
        <Draggable handle={"#draggable-matrix"}>
            <Paper {...props} />
        </Draggable>
    )
}

const dialogStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.background.default,
        maxHeight: "calc(75% - 64px)",
        padding: 16,
        '&:hover': {
            cursor: "grab",
        },
        '&:active': {
            cursor: "grabbing",
        },
    }
}), {name: "matrix-dialog"});

function MatrixDialog(props) {
    const { cellDimensions, matrix, ...other } = props;
    const dialogClasses = dialogStyles();
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const matrixRef = useRef(null);

    const onEnter = () => {
        setHeight(matrixRef.current.getTotalRowsHeight());
        setWidth(matrixRef.current.getTotalColumnsWidth());
    };

    return (
        <Dialog
            maxWidth={false}
            onEnter={onEnter}
            PaperComponent={PaperComponent}
            PaperProps={{
                className: dialogClasses.paper,
                id: "draggable-matrix",
                style: {
                    height: height + 32,
                    width: width + 32
                },
            }}
            {...other}
        >
            <VirtualizedMatrix
                cellDimensions={cellDimensions}
                gridRef={matrixRef}
                matrix={matrix}
            />
        </Dialog>
    )
}

MatrixDialog.propTypes = {
    cellDimensions: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.exact({
            x: PropTypes.number,
            y: PropTypes.number,
        })
    ]),
    deviation: PropTypes.arrayOf(PropTypes.array),
    matrix: PropTypes.arrayOf(PropTypes.array),
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
};

export default MatrixDialog;