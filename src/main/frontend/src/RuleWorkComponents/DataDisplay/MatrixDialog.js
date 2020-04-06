import React from "react";
import PropTypes from "prop-types";
import VirtualizedMatrix from "./VirtualizedMatrix";
import TraitsTable from "../Feedback/RuleWorkDialog/Elements/TraitsTable";
import FullscreenDialog from "./FullscreenDialog";
import FullscreenDialogTitleBar from "./FullscreenDialogTitleBar";
import MultiColDialogContent from "./MultiColDialogContent";

class MatrixDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            heightMatrix: 0,
            widthMatrix: 0,
            heightDeviation: 0,
            widthDeviation: 0,
        };

        this.matrixRef = React.createRef();
        this.deviationRef = React.createRef();
    }

    onEntered = () => {
        this.setState({
            heightMatrix: this.matrixRef.current ? this.matrixRef.current.getTotalRowsHeight() : 0,
            widthMatrix: this.matrixRef.current ? this.matrixRef.current.getTotalColumnsWidth() : 0,
            heightDeviation: this.deviationRef.current ? this.deviationRef.current.getTotalRowsHeight() : 0,
            widthDeviation: this.deviationRef.current ? this.deviationRef.current.getTotalColumnsWidth() : 0,
        });
    };

    prepareTraitsWithoutDeviation = (traits) => {
        return  Object.keys(traits).map(key => {
            if (!key.toLowerCase().includes("deviation")) {
                return {
                    [key]: traits[key]
                };
            }
        }).reduce((previousValue, currentValue) => {
            return {...previousValue, ...currentValue};
        });
    };

    render() {
        const {
            heightMatrix,
            widthMatrix,
            heightDeviation,
            widthDeviation,
        } = this.state;

        const {
            cellDimensions,
            disableDeviation,
            matrix,
            open,
            onClose,
            title
        } = this.props;

        const numberOfColumns = disableDeviation ? 2 : 3;

        return (
            <FullscreenDialog open={open} onEntered={this.onEntered} onClose={onClose}>
                <FullscreenDialogTitleBar
                    onClose={onClose}
                    title={title}
                />
                <MultiColDialogContent numberOfColumns={numberOfColumns}>
                    <div
                        id={"ordinal-misclassification-matrix-value"}
                        style={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                            maxWidth: `${90 / numberOfColumns}%`,
                            width: widthMatrix
                        }}
                    >
                        <div
                            id={"value-floating-box"}
                            style={{
                                height: heightMatrix,
                                maxHeight: "100%",
                                width: "100%"
                            }}
                        >
                            <VirtualizedMatrix
                                cellDimensions={cellDimensions}
                                gridRef={this.matrixRef}
                                matrix={matrix.value}
                            />
                        </div>
                    </div>
                    {!disableDeviation &&
                        <div
                            id={"ordinal-misclassification-matrix-deviation"}
                            style={{
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "center",
                                maxWidth: `${90 / numberOfColumns}`,
                                width: widthDeviation
                            }}
                        >
                            <div
                                id={"deviation-floating-box"}
                                style={{
                                    height: heightDeviation,
                                    maxHeight: "100%",
                                    width: "100%",
                                }}
                            >
                                <VirtualizedMatrix
                                    cellDimensions={cellDimensions}
                                    gridRef={this.deviationRef}
                                    matrix={matrix.deviation}
                                />
                            </div>
                        </div>
                    }
                    <div
                        id={"ordinal-misclassification-matrix-details"}
                        style={{
                            minWidth: `${90 / numberOfColumns}%`,
                            width: `calc(90% - ${widthMatrix + widthDeviation}px)`
                        }}
                    >
                        <TraitsTable
                            ratio={0.9}
                            traits={
                                disableDeviation ? this.prepareTraitsWithoutDeviation(matrix.traits) : matrix.traits
                            }
                        />
                    </div>
                </MultiColDialogContent>
            </FullscreenDialog>

        )
    }

}

MatrixDialog.propTypes = {
    cellDimensions: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.exact({
            x: PropTypes.number,
            y: PropTypes.number,
        })
    ]),
    disableDeviation: PropTypes.bool,
    matrix: PropTypes.shape({
        value: PropTypes.arrayOf(PropTypes.array).isRequired,
        deviation: PropTypes.arrayOf(PropTypes.array),
        traits: PropTypes.object.isRequired,
        tables: PropTypes.object,
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
};

MatrixDialog.defaultProps = {
    disableDeviation: true,
};

export default MatrixDialog;