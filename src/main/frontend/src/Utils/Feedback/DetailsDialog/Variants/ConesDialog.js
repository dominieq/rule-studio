import React from "react";
import PropTypes from "prop-types";
import { fetchConeObjects } from "../../../utilFunctions/fetchFunctions";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import { FullscreenDialog, MultiColumns, FullscreenHeader } from "../../../DataDisplay/FullscreenDialog";
import StyledCircularProgress from "../../StyledCircularProgress";
import TablesList from "../Elements/TablesList";
import ObjectsComparisonTable from "../Elements/ObjectsComparisonTable";
import TableItemsList from "../Elements/TableItemsList";

/**
 * The fullscreen dialog with details of dominance cones of a selected object.
 *
 * @name Cones Details Dialog
 * @constructor
 * @category Details Dialog
 * @param props {Object} - Any other props will be forwarded to the {@link FullscreenDialog} element.
 * @param props.item {Object} - The selected object with it's dominance cones.
 * @param props.item.id {number} - The id of a selected object.
 * @param props.item.name {Object} - The name of a selected object.
 * @param props.item.name.primary {number|string} - The part of a name coloured with a primary colour.
 * @param props.item.name.secondary {number|string} - The part of a name coloured with a secondary colour.
 * @param props.item.name.toString {function} - Returns name as a single string.
 * @param props.item.traits {Object} - Contains the dominance cones of an item.
 * @param props.item.traits.Positive_dominance_cone {number} - The number of objects that belong to this cone.
 * @param props.item.traits.Negative_dominance_cone {number} - The number of objects that belong to this cone.
 * @param props.item.traits.Positive_inverse_dominance_cone {number} - The number of objects that belong to this cone.
 * @param props.item.traits.Negative_inverse_dominance_cone {number} - The number of objects that belong to this cone.
 * @param props.item.toFilter {function} - Returns item in an easy to filter form.
 * @param props.items {Object[]} - Should be an array of all objects.
 * @param props.open {boolean} - If <code>true</code> the Dialog is open.
 * @param props.onClose {function} - Callback fired when the component requests to be closed.
 * @param props.projectResult {Object} - Part of a project received from server.
 * @returns {React.PureComponent}
 */
class ConesDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: {
                coneObjects: false,
                objectsComparison: false,
            },
            callIndex: 0,
            coneIndex: undefined,
            coneContent: [],
            objectInConeIndex: undefined
        };

        this._cones = [
            "positive",
            "negative",
            "positiveInverted",
            "negativeInverted"
        ];
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.item.id !== this.props.item.id) {
            this.setState({
                coneIndex: undefined,
                objectInConeIndex: undefined
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getConeObject = () => {
        let localCallIndex = 0;

        this.setState(({loading, callIndex}) => {
            localCallIndex = callIndex;

            return {
                loading: { ...loading, coneObjects: true },
                callIndex: callIndex + 1
            }
        }, () => {
            const { item: { id }, projectId } = this.props;
            const { coneIndex } = this.state;

            fetchConeObjects(
                { projectId, objectIndex: id, coneType: this._cones[coneIndex] }
            ).then(result => {
                if (this._isMounted && Array.isArray(result)) {
                    this.setState(({callIndex}) => {
                        if (callIndex === localCallIndex + 1) {
                            return {
                                coneContent: result.slice()
                            };
                        } else {
                            return { };
                        }
                    });
                }
            }).catch((exception) => {
                if (!exception.hasOwnProperty("open")) {
                    console.error(exception);
                }
                // TODO use forwarded callback to show error
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, coneObjects: false }
                    }));
                }
            })
        })
    }

    onTableSelected = (index) => {
        this.setState({
            coneIndex: index,
            objectInConeIndex: undefined
        }, () => this.getConeObject());
    };

    onItemInTableSelected = (index) => {
        this.setState({
            objectInConeIndex: index
        });
    };

    getConesTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: "Selected object:" },
                    { ...item.name, brackets: false, }
                ]}
            />
        );
    };

    getName = (index) => {
        const { items } = this.props;
        return items[index].name.toString();
    };

    render() {
        const { loading, coneIndex, coneContent, objectInConeIndex } = this.state;
        const { item, items, projectId, projectResult, ...other } = this.props;

        return (
            <FullscreenDialog {...other}>
                <FullscreenHeader
                    id={"cones-details-header"}
                    onClose={this.props.onClose}
                    title={this.getConesTitle()}
                />
                <MultiColumns>
                    <div id={"cones-tables"} style={{width: "22.5%"}}>
                        <TablesList
                            headerText={"Dominance cones"}
                            onTableSelected={this.onTableSelected}
                            tableIndex={coneIndex}
                            tables={item.traits}
                        />
                    </div>
                    <div id={"cones-table-content"} style={{display: "flex", flexDirection: "column", width: "22.5%"}}>
                        {loading.coneObjects &&
                            <StyledCircularProgress />
                        }
                        {!loading.coneObjects && !Number.isNaN(Number(coneIndex)) &&
                            <TableItemsList
                                getName={this.getName}
                                headerText={Object.keys(item.traits)[coneIndex]}
                                itemIndex={objectInConeIndex}
                                onItemInTableSelected={this.onItemInTableSelected}
                                table={coneContent}
                            />
                        }
                    </div>
                    <div id={"cones-comparison"} style={{width: "50%"}}>
                        {!Number.isNaN(Number(objectInConeIndex)) &&
                            <ObjectsComparisonTable
                                informationTable={projectResult.informationTable}
                                objectIndex={item.id}
                                objectHeader={item.name.toString()}
                                objectInTableIndex={objectInConeIndex}
                                objectInTableHeader={items ? items[objectInConeIndex].name.toString() : undefined}
                                tableIndex={coneIndex}
                            />
                        }
                    </div>
                </MultiColumns>
            </FullscreenDialog>
        );
    }
}

ConesDialog.propTypes = {
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.shape({
            primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            toString: PropTypes.func
        }),
        traits: PropTypes.shape({
            'Positive dominance cone': PropTypes.number,
            'Negative dominance cone': PropTypes.number,
            'Positive inverse dominance cone': PropTypes.number,
            'Negative inverse dominance cone': PropTypes.number,
        }),
        toFilter: PropTypes.func
    }),
    items: PropTypes.arrayOf(PropTypes.object),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    projectId: PropTypes.string.isRequired,
    projectResult: PropTypes.object,
};

export default ConesDialog;