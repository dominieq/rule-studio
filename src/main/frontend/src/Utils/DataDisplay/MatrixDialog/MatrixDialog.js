import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { fetchMatrix } from "../../utilFunctions/fetchFunctions";
import { addSubheaders } from "../../utilFunctions/parseMatrix/parseElements";
import { CenteredColumn } from "./Elements";
import { FullscreenDialog, MultiColumns, FullscreenHeader } from "../FullscreenDialog";
import TextWithHoverTooltip from "../TextWithHoverTooltip";
import VirtualizedMatrix, { estimateMatrixHeight, estimateMatrixWidth } from "../VirtualizedMatrix";
import { estimateTableHeight } from "../VirtualizedTable";
import TraitsTable from "../../Feedback/DetailsDialog/Elements/TraitsTable";
import StyledCircularProgress from "../../Feedback/StyledCircularProgress";
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
 * @constructor
 * @category Dialogs
 * @param props {Object}
 * @param {number|Object} [props.cellDimensions]  - Dimensions of a cell from the {@link VirtualizedMatrix}.
 * @param {number} props.cellDimensions.x - The width of a matrix cell.
 * @param {number} props.cellDimensions.y - The height of a matrix cell.
 * @param {function} props.onClose - Callback fired when dialog requests to be closed.
 * @param {function} props.onSnackbarOpen - Callback fired when the component request to display an error.
 * @param {boolean} props.open - If <code>true</code> the dialog will show up.
 * @param {string} props.projectId - The identifier of a selected project.
 * @param {string} props.resource - The name of a selected resource.
 * @param {function} [props.saveMatrix] - Callback fired when user requests to save matrix.
 * @param {string} props.serverBase - The host in the URL of an API call.
 * @param {React.ReactNode} props.title  - The content of the {@link FullscreenHeader}.
 * @param {Object} [props.queryParams] - The query parameters in the URL of an API call.
 * @param {string} props.queryParams.typeOfMatrix - The type of a matrix to fetch.
 * @param {number} [props.queryParams.numberOfFold] - The index of a selected fold.
 * @returns {React.PureComponent}
 */
class MatrixDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: {
                matrix: false
            },
            requestIndex: {
                matrix: 0
            },
            misclassification: [],
            deviations: [],
            traits: null,
            domain: [],
            heightDeviation: 0,
            heightMatrix: 0,
            heightTraits: 0,
            mouseX: null,
            mouseY: null,
            widthDeviation: 0,
            widthMatrix: 0
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.projectId !== this.props.projectId) {
            this.setState({
                misclassification: [],
                deviations: [],
                traits: null,
                domain: []
            });
        }

        if (!prevProps.open && this.props.open) {
            const { misclassification } = this.state;
            if (misclassification.length === 0) this.getMatrix();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getMatrix = () => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.matrix;

            return {
                loading: { ...loading, matrix: true },
                requestIndex: { ...requestIndex, matrix: localRequestIndex + 1 }
            };
        }, () => {
            const { projectId, resource, serverBase, queryParams } = this.props;
            const pathParams = { projectId };

            fetchMatrix(
                resource, pathParams, queryParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null && result.hasOwnProperty("value")
                    && result.hasOwnProperty("decisionsDomain") &&  result.hasOwnProperty("traits")) {

                    this.setState(({requestIndex}) => {
                        if (requestIndex.matrix !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, matrix: 0 },
                            misclassification: result.value,
                            deviations: result.hasOwnProperty("Deviation of value") ? result["Deviation of value"] : [],
                            domain: result.decisionsDomain,
                            traits: result.traits
                        }
                    }, this.updateTablesHeight);
                } else {
                    this.setState(({requestIndex}) => ({
                        requestIndex: { ...requestIndex, matrix: 0 }
                    }));
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, matrix: false }
                    }));
                }
            });
        });
    };

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
            const tooltip = this.getTooltip(cellData);

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

    onSave = () => {
        this.props.saveMatrix();
        this.onContextMenuClose();
    };

    updateTablesHeight = () => {
        const { misclassification, deviations, traits } = this.state;
        const displayedTraits = deviations.length === 0 ? this.prepareTraitsWithoutDeviation(traits) : { ...traits };

        this.setState({
            heightMatrix: estimateMatrixHeight(misclassification),
            widthMatrix: estimateMatrixWidth(misclassification),
            heightDeviation: deviations.length > 0 ? estimateMatrixHeight(deviations) : 0,
            widthDeviation: deviations.length > 0 ? estimateMatrixWidth(deviations) : 0,
            heightTraits: estimateTableHeight(Object.keys(displayedTraits))
        });
    };

    prepareTraitsWithoutDeviation = (traits) => {
        return  Object.keys(traits).map(key => {
            if (key.toLowerCase().includes("deviation")) {
                return { };
            }

            return { [key]: traits[key] };
        }).reduce((previousValue, currentValue) => {
            return { ...previousValue, ...currentValue};
        });
    };

    render() {
        const {
            loading,
            misclassification,
            deviations,
            traits,
            domain,
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
            open,
            onClose,
            title
        } = this.props;

        const numberOfColumns = deviations.length === 0 ? 2 : 3;

        return (
            <FullscreenDialog open={open} onClose={onClose}>
                <FullscreenHeader
                    id={"matrix-details-header"}
                    onClose={onClose}
                    title={title}
                />
                <MultiColumns numberOfColumns={loading.matrix ? 1 : numberOfColumns}>
                    {loading.matrix &&
                        <StyledCircularProgress />
                    }
                    {!loading.matrix && Array.isArray(misclassification) && misclassification.length > 0 &&
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
                                matrix={addSubheaders(domain, misclassification)}
                                type={"Misclassification matrix"}
                            />
                        </CenteredColumn>
                    }
                    {!loading.matrix && Array.isArray(deviations) && deviations.length > 0 &&
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
                                matrix={addSubheaders(domain, deviations)}
                                type={"Deviations"}
                            />
                        </CenteredColumn>
                    }
                    {!loading.matrix && traits != null &&
                        <CenteredColumn
                            height={heightTraits}
                            minWidth={`${90 / numberOfColumns}%`}
                            width={`calc(90% - ${widthMatrix + widthDeviation}px)`}
                        >
                            <TraitsTable
                                cellRenderer={this.cellRenderer}
                                columnsLabels={{key: "Name", value: "Value"}}
                                ratio={0.9}
                                traits={traits}
                            />
                        </CenteredColumn>
                    }
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
    onClose: PropTypes.func,
    onSnackbarOpen: PropTypes.func,
    open: PropTypes.bool.isRequired,
    projectId: PropTypes.string,
    resource: PropTypes.string,
    saveMatrix: PropTypes.func,
    serverBase: PropTypes.string,
    title: PropTypes.node.isRequired,
    queryParams: PropTypes.shape({
        typeOfMatrix: PropTypes.string,
        numberOfFold: PropTypes.number
    })
};

export default MatrixDialog;
