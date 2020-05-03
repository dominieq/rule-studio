import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../Feedback/CircleHelper";
import TextWithHoverTooltip from "./TextWithHoverTooltip";
import { AutoSizer, MultiGrid } from "react-virtualized";

const matrixStyles = makeStyles(theme => ({
    matrix: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            backgroundColor: theme.palette.paper.background
        }
    },
    subheader: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            backgroundColor: theme.palette.list.subheader.background
        }
    },
    cellFlex: {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
    },
    cellMatrix: {
        border: `1px solid ${theme.palette.text.default}`,
        color: theme.palette.button.secondary,
    },
    cellSubheader: {
        border: `1px solid ${theme.palette.list.subheader.text}`,
        color: theme.palette.list.subheader.text
    },
    tooltip: {
        display: "flex",
        flexDirection: "column",
        '& > *:first-child': {
            marginBottom: "1em"
        },
        '& > *:last-child': {
            marginTop: "1em"
        }
    }
}), {name: "virtualized-matrix"});

export const estimateMatrixHeight = (matrix, cellHeight = 64) => {
    if (Array.isArray(matrix) && matrix.length) {
        return (matrix.length + 1) * cellHeight;
    } else {
        return 0;
    }
};

export const estimateMatrixWidth = (matrix, cellWidth = 64) => {
    if (Array.isArray(matrix) && matrix.length) {
        return (matrix[0].length + 1) * cellWidth;
    } else {
        return 0;
    }
};

function VirtualizedMatrix(props) {
    const { cellDimensions, matrix, type } = props;
    const matrixClasses = matrixStyles();

    const cellRenderer = ({columnIndex, key, rowIndex, style}) => {
        return (
            <div
                className={clsx(
                    matrixClasses.cellFlex,
                    {[matrixClasses.cellMatrix]: columnIndex * rowIndex !== 0 || columnIndex + rowIndex === 0},
                    {[matrixClasses.cellSubheader]: columnIndex + rowIndex !== 0 && columnIndex * rowIndex === 0}
                )}
                key={key}
                style={style}
            >
                {columnIndex + rowIndex > 0 &&
                    <TextWithHoverTooltip
                        text={matrix[rowIndex][columnIndex]}
                    />
                }
                {columnIndex + rowIndex === 0 &&
                    <CircleHelper
                        title={
                            <React.Fragment>
                                <span aria-label={"tile"} style={{textAlign: "center"}}>
                                    <b>{type}</b>
                                </span>
                                <span aria-label={"columns"} style={{textAlign: "left"}}>
                                    <b>Columns:</b>
                                    {" suggested decisions"}
                                </span>
                                <span aria-label={"rows"} style={{textAlign: "left"}}>
                                    <b>Rows:</b>
                                    {" original decisions"}
                                </span>
                                <span aria-label={"save-info"} style={{textAlign: "left"}}>
                                    <b>{"Right click to save to file"}</b>
                                </span>
                            </React.Fragment>
                            }
                        TooltipProps={{
                            classes: {tooltip: matrixClasses.tooltip},
                            placement: "top",
                            PopperProps: {
                                disablePortal: false
                            }
                        }}
                    />
                }
            </div>
        )
    };

    return (
        <AutoSizer>
            {({height, width}) => (
                <MultiGrid
                    cellRenderer={cellRenderer}
                    classNameBottomLeftGrid={matrixClasses.subheader}
                    classNameBottomRightGrid={matrixClasses.matrix}
                    classNameTopLeftGrid={matrixClasses.matrix}
                    classNameTopRightGrid={matrixClasses.subheader}
                    columnCount={matrix[0].length}
                    columnWidth={Number.isNaN(Number(cellDimensions)) ? cellDimensions.x : cellDimensions}
                    fixedColumnCount={1}
                    fixedRowCount={1}
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
    type: PropTypes.oneOf(["Misclassification matrix", "Deviations"])
};

VirtualizedMatrix.defaultProps = {
    cellDimensions: 64,
};

export default VirtualizedMatrix;