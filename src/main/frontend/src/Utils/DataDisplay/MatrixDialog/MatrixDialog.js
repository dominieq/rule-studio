import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { CenteredColumn } from "./Elements";
import { FullscreenDialog, MultiColumns, FullscreenHeader } from "../FullscreenDialog";
import TextWithHoverTooltip from "../TextWithHoverTooltip";
import VirtualizedMatrix, { estimateMatrixHeight, estimateMatrixWidth } from "../VirtualizedMatrix";
import { estimateTableHeight } from "../VirtualizedTable";
import TraitsTable from "../../Feedback/DetailsDialog/Elements/TraitsTable";
import { addSubheaders } from "../../utilFunctions/parseMatrix/parseElements";
import Fade from "@material-ui/core/Fade";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const StyledMenu = withStyles(theme => ({
    list: {
        backgroundColor: theme.palette.background.sub,
        color: theme.palette.text.main2
    }
}), {name: "ContextMenu"})(props => <Menu {...props} />);

/**
 * Uses the {@link VirtualizedMatrix} and {@link VirtualizedTable} to display misclassification matrix.
 * It's possible to hide deviations as sometimes they don't provide useful information.
 * All tables are going to be vertically centered. A context menu is going to pop up after right clicking on a matrix.
 *
 * @name Matrix Dialog
 * @constructor
 * @category Utils
 * @subcategory Matrix Dialog
 * @param props {Object}
 * @param [props.cellDimensions] {number|Object} - Dimensions of a cell from the {@link VirtualizedMatrix}.
 * @param props.cellDimensions.x {number} - The width of a matrix cell.
 * @param props.cellDimensions.y {number} - The height of a matrix cell.
 * @param [props.disableDeviation=true] {boolean} - If <code>true</code> deviations won't be visible.
 * @param props.matrix {Object} - An entity that consists of a matrix, it's possible deviations and traits.
 * @param props.matrix.value {Array[]} - The matrix itself. Displayed on the left side of the dialog.
 * @param [props.matrix.deviation] {Array[]} - The deviations of a matrix. Displayed in the middle of the dialog.
 * @param props.matrix.traits {Object} - The traits of a matrix. Displayed on the right side of the dialog.
 * @param [props.matrix.tables] {Object} - Other traits in the form of an array. Aren't displayed in this version.
 * @param [props.onClose] {function} - Callback fired when dialog requests to be closed.
 * @param props.open {boolean} - If <code>true</code> the dialog will show up.
 * @param [props.subheaders] {string[]} - Simple description of every row and column in a matrix.
 * @param [props.saveMatrix] {function} - Callback fired when user requests to save matrix.
 * @param props.title {React.ReactNode} - The content of the {@link FullscreenHeader}.
 * @returns {React.ReactElement}
 */
class MatrixDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            heightDeviation: 0,
            heightMatrix: 0,
            heightTraits: 0,
            mouseX: null,
            mouseY: null,
            widthDeviation: 0,
            widthMatrix: 0
        };
    }

    getTooltip = (abbrev) => {
        switch(abbrev) {
            case "gmean": return { text: "GMean", tooltip: "Geometric Mean"};
            case "mae": return { text: "MAE", tooltip: "Mean Absolute Error"};
            case "rmse": return { text: "RMSE", tooltip: "Root Mean Square Error"};
            default: return {};
        }
    };

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

    onContextMenuOpen = (event) => {
        event.preventDefault();

        this.setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4
        });
    };

    onContextMenuClose = () => {
        this.setState({
            mouseX: null,
            mouseY: null
        });
    };

    onEntering = () => {
        const { disableDeviation, matrix: { value, deviation, traits } } = this.props;

        let displayedTraits = traits;
        if (disableDeviation) {
            displayedTraits = this.prepareTraitsWithoutDeviation(traits);
        }

        this.setState({
            heightMatrix: estimateMatrixHeight(value),
            widthMatrix: estimateMatrixWidth(value),
            heightDeviation: !disableDeviation ? estimateMatrixHeight(deviation) : 0,
            widthDeviation: !disableDeviation ? estimateMatrixWidth(deviation) : 0,
            heightTraits: estimateTableHeight(Object.keys(displayedTraits))
        });
    };

    onSave = () => {
        this.props.saveMatrix();
        this.onContextMenuClose();
    };

    prepareTraitsWithoutDeviation = (traits) => {
        return  Object.keys(traits).map(key => {
            if (!key.toLowerCase().includes("deviation")) {
                return {
                    [key]: traits[key]
                };
            } else {
                return {};
            }
        }).reduce((previousValue, currentValue) => {
            return {...previousValue, ...currentValue};
        });
    };

    render() {
        const {
            heightDeviation,
            heightMatrix,
            heightTraits,
            mouseX,
            mouseY,
            widthDeviation,
            widthMatrix,
        } = this.state;

        const {
            cellDimensions,
            disableDeviation,
            matrix,
            open,
            onClose,
            subheaders,
            title
        } = this.props;

        const numberOfColumns = disableDeviation ? 2 : 3;
        const displayedTraits = disableDeviation ? this.prepareTraitsWithoutDeviation(matrix.traits) : matrix.traits;

        return (
            <FullscreenDialog open={open} onEntering={this.onEntering} onClose={onClose}>
                <FullscreenHeader
                    id={"matrix-details-header"}
                    onClose={onClose}
                    title={title}
                />
                <MultiColumns numberOfColumns={numberOfColumns}>
                    <CenteredColumn
                        height={heightMatrix}
                        InnerWrapperProps={{
                            onContextMenu: this.onContextMenuOpen
                        }}
                        maxWidth={`${90 / numberOfColumns}%`}
                        width={widthMatrix}
                    >
                        <VirtualizedMatrix
                            cellDimensions={cellDimensions}
                            matrix={addSubheaders(subheaders, matrix.value)}
                            type={"Misclassification matrix"}
                        />
                    </CenteredColumn>
                    {!disableDeviation &&
                        <CenteredColumn
                            height={heightDeviation}
                            InnerWrapperProps={{
                                onContextMenu: this.onContextMenuOpen
                            }}
                            maxWidth={`${90 / numberOfColumns}%`}
                            width={widthDeviation}
                        >
                            <VirtualizedMatrix
                                cellDimensions={cellDimensions}
                                matrix={addSubheaders(subheaders, matrix.deviation)}
                                type={"Deviations"}
                            />
                        </CenteredColumn>
                    }
                    <CenteredColumn
                        height={heightTraits}
                        minWidth={`${90 / numberOfColumns}%`}
                        width={`calc(90% - ${widthMatrix + widthDeviation}px)`}
                    >
                        <TraitsTable
                            cellRenderer={this.cellRenderer}
                            columnsLabels={{key: "Name", value: "Value"}}
                            ratio={0.9}
                            traits={displayedTraits}
                        />
                    </CenteredColumn>
                </MultiColumns>
                <StyledMenu
                    anchorPosition={
                       mouseX !== null && mouseY !== null
                        ? { top: mouseY, left: mouseX }
                        : undefined
                    }
                    anchorReference={"anchorPosition"}
                    keepMounted={true}
                    onClose={this.onContextMenuClose}
                    open={mouseY !== null}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={this.onSave}>Save to file</MenuItem>
                </StyledMenu>
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
    subheaders: PropTypes.arrayOf(PropTypes.string),
    saveMatrix: PropTypes.func,
    title: PropTypes.node.isRequired
};

MatrixDialog.defaultProps = {
    disableDeviation: true,
};

export default MatrixDialog;
