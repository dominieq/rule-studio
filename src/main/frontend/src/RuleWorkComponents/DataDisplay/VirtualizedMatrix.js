import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TextWithHoverTooltip from "./TextWithHoverTooltip";
import { AutoSizer, MultiGrid } from "react-virtualized";

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
    }
}), {name: "virtualized-matrix"});

export const estimateMatrixHeight = (matrix, cellHeight = 64) => {
    if (Array.isArray(matrix) && matrix.length) {
        return matrix.length * cellHeight;
    } else {
        return 0;
    }
};

export const estimateMatrixWidth = (matrix, cellWidth = 64) => {
    if (Array.isArray(matrix) && matrix.length) {
        return matrix[0].length * cellWidth;
    } else {
        return 0;
    }
};

function VirtualizedMatrix(props) {
    const { cellDimensions, matrix } = props;
    const matrixClasses = matrixStyles();

    const cellRenderer = ({columnIndex, key, rowIndex, style}) => {
        return (
            <div className={matrixClasses.cell} key={key} style={style}>
                <TextWithHoverTooltip
                    text={matrix[rowIndex][columnIndex]}
                />
            </div>
        )
    };

    return (
        <AutoSizer>
            {({height, width}) => (
                <MultiGrid
                    cellRenderer={cellRenderer}
                    classNameBottomLeftGrid={matrixClasses.root}
                    classNameBottomRightGrid={matrixClasses.root}
                    classNameTopLeftGrid={matrixClasses.root}
                    classNameTopRightGrid={matrixClasses.root}
                    columnCount={matrix[0].length}
                    columnWidth={Number.isNaN(Number(cellDimensions)) ? cellDimensions.x : cellDimensions}
                    height={height}
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
    matrix: PropTypes.arrayOf(PropTypes.array),
};

VirtualizedMatrix.defaultProps = {
    cellDimensions: 64
};

export default VirtualizedMatrix;