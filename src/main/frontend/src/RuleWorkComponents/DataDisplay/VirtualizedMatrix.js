import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { AutoSizer, Grid } from "react-virtualized";

const matrixStyles = makeStyles(theme => ({
    root: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            backgroundColor: theme.palette.paper.background
        }
    },
    cell: {
        alignItems: "center",
        border: `1px solid ${theme.palette.text.default}`,
        color: theme.palette.button.secondary,
        display: "flex",
        justifyContent: "center",
        padding: 16
    }
}), {name: "virtualized-matrix"});

function VirtualizedMatrix(props) {
    const { cellDimensions, gridRef, matrix } = props;
    const matrixClasses = matrixStyles();

    const cellRenderer = ({columnIndex, key, rowIndex, style}) => {
        return (
            <div className={matrixClasses.cell} key={key} style={style}>
                {matrix[rowIndex][columnIndex]}
            </div>
        )
    };

    return (
        <AutoSizer>
            {({height, width}) => (
                <Grid
                    cellRenderer={cellRenderer}
                    className={matrixClasses.root}
                    columnCount={matrix[0].length}
                    columnWidth={Number.isNaN(Number(cellDimensions)) ? cellDimensions.x : cellDimensions}
                    height={height}
                    ref={gridRef}
                    rowCount={matrix.length}
                    rowHeight={Number.isNaN(Number(cellDimensions)) ? cellDimensions.y : cellDimensions}
                    width={width}
                />
            )}
        </AutoSizer>
    )
}

VirtualizedMatrix.propTypes = {
    cellDimensions: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.exact({
            x: PropTypes.number,
            y: PropTypes.number
        })
    ]),
    gridRef: PropTypes.object,
    matrix: PropTypes.arrayOf(PropTypes.array),
};

VirtualizedMatrix.defaultProps = {
    cellDimensions: 64
};

export default VirtualizedMatrix;