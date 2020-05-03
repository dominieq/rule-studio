import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { addSubheaders } from "../../../Body/Project/Utils/parseData";
import { CenteredColumn } from "./Elements";
import VirtualizedMatrix, { estimateMatrixHeight, estimateMatrixWidth } from "../VirtualizedMatrix";
import { estimateTableHeight } from "../VirtualizedTable";
import TraitsTable from "../../Feedback/DetailsDialog/Elements/TraitsTable";
import FullscreenDialog from "../FullscreenDialog";
import FullscreenDialogTitleBar from "../FullscreenDialogTitleBar";
import MultiColDialogContent from "../MultiColDialogContent";
import TextWithHoverTooltip from "../TextWithHoverTooltip";
import Fade from "@material-ui/core/Fade";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const StyledMenu = withStyles(theme => ({
    list: {
        backgroundColor: theme.palette.popper.background,
        color: theme.palette.popper.text
    }
}), {name: "MuiMenu"})(props => <Menu {...props} />);

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
                <FullscreenDialogTitleBar
                    onClose={onClose}
                    title={title}
                />
                <MultiColDialogContent numberOfColumns={numberOfColumns}>
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
                </MultiColDialogContent>
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
    subheaders: PropTypes.arrayOf(PropTypes.object),
    saveMatrix: PropTypes.func,
    title: PropTypes.node.isRequired
};

MatrixDialog.defaultProps = {
    disableDeviation: true,
};

export default MatrixDialog;