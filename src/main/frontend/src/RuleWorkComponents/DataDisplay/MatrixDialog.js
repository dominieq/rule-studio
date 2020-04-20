import React from "react";
import PropTypes from "prop-types";
import { addSubheaders } from "../../Body/Project/Utils/parseData";
import VirtualizedMatrix, { estimateMatrixHeight, estimateMatrixWidth } from "./VirtualizedMatrix";
import TraitsTable from "../Feedback/RuleWorkDialog/Elements/TraitsTable";
import FullscreenDialog from "./FullscreenDialog";
import FullscreenDialogTitleBar from "./FullscreenDialogTitleBar";
import MultiColDialogContent from "./MultiColDialogContent";
import TextWithHoverTooltip from "./TextWithHoverTooltip";

class MatrixDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            heightMatrix: 0,
            widthMatrix: 0,
            heightDeviation: 0,
            widthDeviation: 0,
        };
    }

    getTooltip = (abbrev) => {
        switch(abbrev) {
            case "gmean": return { text: "GMean", tooltip: "Geometric Mean"};
            case "mae": return { text: "MAE", tooltip: "Mean Absolute Error"};
            case "rmse": return { text: "RMSE", tooltip: "Root Mean Square Error"}
        }
    }

    cellRenderer = ({cellData, dataKey}) => {
        const abbrevs = ["gmean", "mae", "rmse"];

        let displayedText = cellData;
        let displayedTooltip = cellData
        if (abbrevs.includes(cellData)) {
            let tooltip = this.getTooltip(cellData);
            displayedText = tooltip.text;
            displayedTooltip = tooltip.tooltip;
        }

        return (
            <React.Fragment>
                {cellData &&
                    <TextWithHoverTooltip
                        roundNumbers={false}
                        text={displayedText}
                        TooltipProps={{
                            id: dataKey
                        }}
                        tooltipTitle={displayedTooltip}
                        TypographyProps={{
                            style: {cursor: "default"}
                        }}
                    />
                }
            </React.Fragment>
        )
    }

    onEntered = () => {
        const { disableDeviation, matrix: { value, deviation } } = this.props;

        this.setState({
            heightMatrix: estimateMatrixHeight(value),
            widthMatrix: estimateMatrixWidth(value),
            heightDeviation: !disableDeviation ? estimateMatrixHeight(deviation) : 0,
            widthDeviation: !disableDeviation ? estimateMatrixWidth(deviation) : 0,
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
        const { heightMatrix, widthMatrix, heightDeviation, widthDeviation } = this.state;
        const { cellDimensions, disableDeviation, matrix, open, onClose, subheaders, title } = this.props;

        const numberOfColumns = disableDeviation ? 2 : 3;
        const displayedTraits = disableDeviation ? this.prepareTraitsWithoutDeviation(matrix.traits) : matrix.traits;

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
                                matrix={addSubheaders(subheaders, matrix.value)}
                                type={"Misclassification matrix"}
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
                                maxWidth: `${90 / numberOfColumns}%`,
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
                                    matrix={addSubheaders(subheaders, matrix.deviation)}
                                    type={"Deviations"}
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
                            cellRenderer={this.cellRenderer}
                            columnsLabels={{key: "Name", value: "Value"}}
                            ratio={0.9}
                            traits={displayedTraits}
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
    subheaders: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
};

MatrixDialog.defaultProps = {
    disableDeviation: true,
};

export default MatrixDialog;