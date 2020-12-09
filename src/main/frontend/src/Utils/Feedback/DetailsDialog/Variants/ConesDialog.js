import React from "react";
import PropTypes from "prop-types";
import { fetchConeObjects, fetchObject } from "../../../utilFunctions/fetchFunctions";
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
 * @param props.onClose {function} - Callback fired when the component requests to be closed.
 * @param props.onSnackbarOpen {function} - Callback fired when the component requests to display an error.
 * @param props.open {boolean} - If <code>true</code> the Dialog is open.
 * @param props.projectId {string} - The identifier of a selected project.
 * @param {string} props.serverBase - The host in the URL of an API call.
 * @returns {React.PureComponent}
 */
class ConesDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: {
                firstObject: false,
                secondObject: false,
                coneObjects: false
            },
            requestIndex: {
                firstObject: 0,
                secondObject: 0,
                coneObjects: 0
            },
            firstObject: null,
            secondObject: null,
            coneObjects: [],
            attributes: [],
            coneIndex: -1,
            coneObjectIndex: -1
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

        const objectIndex = this.props.item.id;
        this.getObject(objectIndex, true, "firstObject");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.projectId !== this.props.projectId) {
            this.setState({
                firstObject: null,
                secondObject: null,
                coneObjects: [],
                attributes: [],
                coneIndex: -1,
                coneObjectIndex: -1,
            });

            return;
        }

        if (prevProps.item.id !== this.props.item.id) {
            this.setState({
                secondObject: null,
                coneObjects: [],
                coneIndex: -1,
                coneObjectIndex: -1
            }, () =>  {
                const objectIndex = this.props.item.id;
                this.getObject(objectIndex, false, "firstObject")
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getObject = (objectIndex, isAttributes, whichObject, finallyCallback) => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex[whichObject];

            return {
                loading: { ...loading, [whichObject]: true },
                requestIndex: { ...requestIndex, [whichObject]: localRequestIndex + 1 }
            };
        }, () => {
            const { projectId, serverBase } = this.props;
            const resource = "cones"
            const pathParams = { projectId }
            const queryParams = { objectIndex, isAttributes }

            fetchObject(
                resource, pathParams, queryParams, serverBase
            ).then(result => {
                if (this._isMounted &&  result != null) {
                    this.setState(({requestIndex, attributes}) => {
                        if (requestIndex[whichObject] !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, [whichObject]: 0 },
                            [whichObject]: result.value,
                            attributes: result.hasOwnProperty("attributes") ? result.attributes : attributes
                        };
                    });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, [whichObject]: false }
                    }), () => {
                        if (typeof finallyCallback === "function") {
                            finallyCallback();
                        }
                    });
                }
            });
        });
    }

    getConeObjects = () => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.coneObjects;

            return {
                loading: { ...loading, coneObjects: true },
                requestIndex: { ...requestIndex, coneObjects: localRequestIndex + 1 }
            }
        }, () => {
            const { item: { id }, projectId, serverBase } = this.props;
            const { coneIndex } = this.state;
            const pathParams = { projectId, objectIndex: id, coneType: this._cones[coneIndex] }

            fetchConeObjects(
                pathParams, serverBase
            ).then(result => {
                if (this._isMounted && Array.isArray(result)) {
                    this.setState(({requestIndex}) => {
                        if (requestIndex.coneObjects !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, coneObjects: 0 },
                            coneObjects: result.slice()
                        };
                    });
                }
            }).catch((exception) => {
                this.props.onSnackbarOpen(exception);
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
            coneObjectIndex: -1
        }, () => this.getConeObjects());
    };

    onItemInTableSelected = (index) => {
        const finallyCallback = () => this.setState({
            coneObjectIndex: index
        });

        this.getObject(index, false, "secondObject", finallyCallback);
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
        const { loading, firstObject, secondObject, attributes, coneObjects, coneIndex, coneObjectIndex } = this.state;
        const { item, items, onSnackbarOpen, projectId, serverBase, ...other } = this.props;

        return (
            <FullscreenDialog keepMounted={true} {...other}>
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
                        {!loading.coneObjects && coneIndex > -1 &&
                            <TableItemsList
                                customisable={false}
                                getName={this.getName}
                                headerText={Object.keys(item.traits)[coneIndex]}
                                itemIndex={coneObjectIndex}
                                onItemInTableSelected={this.onItemInTableSelected}
                                table={coneObjects}
                            />
                        }
                    </div>
                    <div id={"cones-comparison"} style={{display: "flex", flexDirection: "column", width: "50%"}}>
                        {loading.secondObject &&
                            <StyledCircularProgress />
                        }
                        {!loading.secondObject && coneObjectIndex > -1 &&
                            <ObjectsComparisonTable
                                attributes={attributes}
                                coneIndex={coneIndex}
                                firstObject={firstObject}
                                firstObjectHeader={this.getName(item.id)}
                                secondObject={secondObject}
                                secondObjectHeader={this.getName(coneObjectIndex)}
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
    onClose: PropTypes.func,
    onSnackbarOpen: PropTypes.func,
    open: PropTypes.bool.isRequired,
    projectId: PropTypes.string.isRequired,
    serverBase: PropTypes.string
};

export default ConesDialog;
