import React from "react";
import PropTypes from "prop-types";
import { AlertError } from "../../../Classes";
import { fetchUnion } from "../../../utilFunctions/fetchFunctions";
import { getItemName } from "../../../utilFunctions/parseItems";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import { FullscreenDialog, FullscreenHeader, MultiColumns } from "../../../DataDisplay/FullscreenDialog";
import StyledCircularProgress from "../../StyledCircularProgress";
import ObjectTable from "../Elements/ObjectTable";
import TableItemsList from "../Elements/TableItemsList";
import TablesList from "../Elements/TablesList";
import TraitsTable from "../Elements/TraitsTable";


/**
 * The fullscreen dialog with details of a selected union.
 *
 * @name Union Details Dialog
 * @constructor
 * @category Details Dialog
 * @param props {Object} - Any other props will be forwarded to the {@link FullscreenDialog} element.
 * @param props.item {Object} - The selected union with it's characteristics.
 * @param props.item.id {number} - The id of a selected union.
 * @param props.item.name {Object} - The name of a selected union.
 * @param props.item.name.primary {number|string} - The part of a name coloured with a primary colour.
 * @param props.item.name.secondary {number|string} - The part of a name coloured with a secondary colour.
 * @param props.item.name.toString {function} - Returns name as a single string.
 * @param props.item.traits {Object} - The characteristics of a selected union in a key-value form.
 * @param props.item.traits.Accuracy_of_approximation {number}
 * @param props.item.traits.Quality_of_approximation {number}
 * @param props.item.toFilter {function} - Returns item in an easy to filter form.
 * @param props.open {boolean} - If <code>true</code> the Dialog is open.
 * @param props.onClose {function} - Callback fired when the component requests to be closed.
 * @param props.projectResult {Object} - Part of a project received from server.
 * @param props.settings {Object} - Project settings
 * @param props.settings.indexOption {string} - Determines what should be displayed as an object's name.
 * @returns {React.PureComponent}
 */
class UnionsDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: {
                unionProperties: false,
                unionPropertyContent: false,
                object: false
            },
            requestIndex: {
                unionProperties: 0,
                unionPropertyContent: 0,
                object: 0
            },
            unionProperties: {},
            unionPropertyIndex: undefined,
            unionPropertyContent: [],
            objectIndex: undefined,
        };

        this._unionPropertyKeys = [
            "objects",
            "lowerApproximation",
            "upperApproximation",
            "boundary",
            "positiveRegion",
            "negativeRegion",
            "boundaryRegion"
        ];
    }

    componentDidMount() {
        this._isMounted = true;

        this.getUnionProperties();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.item.id !== this.props.item.id) {
            this.setState({
                unionProperties: {},
                unionPropertyIndex: undefined,
                unionPropertyContent: [],
                objectIndex: undefined
            }, () => this.getUnionProperties());
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getUnionProperties = () => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.unionProperties;

            return {
                loading: { ...loading, unionProperties: true },
                requestIndex: { ...requestIndex, unionProperties: localRequestIndex + 1 }
            };
        }, () => {
            const { item: { id }, projectId } = this.props;

            fetchUnion(
                { projectId, unionIndex: id, arrayPropertyType: undefined }
            ).then(result => {
                if (this._isMounted && Object.keys(result).length === this._unionPropertyKeys.length) {
                    this.setState(({requestIndex}) => {
                        if (requestIndex.unionProperties === localRequestIndex + 1) {
                            return {
                                requestIndex: { ...requestIndex, unionProperties: 0 },
                                unionProperties: result
                            };
                        } else {
                            return { };
                        }
                    });
                }
            }).catch(exception => {
                if (!exception instanceof AlertError) {
                    console.error(exception);
                }
                // TODO use forwarded callback to show error
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, unionProperties: false }
                    }));
                }
            });
        });
    }

    getUnionPropertyContent = () => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.unionPropertyContent;

            return {
                loading: { ...loading, unionPropertyContent: true },
                requestIndex: { ...requestIndex, unionPropertyContent: localRequestIndex + 1 }
            };
        }, () => {
            const { item: { id }, projectId } = this.props;
            const { unionPropertyIndex } = this.state;

            fetchUnion(
                { projectId, unionIndex: id, arrayPropertyType: this._unionPropertyKeys[unionPropertyIndex] }
            ).then(result => {
                if (this._isMounted && Array.isArray(result)) {
                    this.setState(({requestIndex}) => {
                        if (requestIndex.unionPropertyContent === localRequestIndex + 1) {
                            return {
                                requestIndex: { ...requestIndex, unionPropertyContent: 0 },
                                unionPropertyContent: result
                            }
                        } else {
                            return { };
                        }
                    });
                }
            }).catch(exception => {
                if (!exception instanceof AlertError) {
                    console.error(exception);
                }
                // TODO use forwarded callback to show error
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                       loading: { ...loading, unionPropertyContent: false }
                    }));
                }
            });
        });
    }

    onExited = () => {
        this.setState({
            unionPropertyIndex: undefined,
            objectIndex: undefined,
        })
    };

    onUnionPropertySelected = (index) => {
        this.setState({
            unionPropertyIndex: index,
            objectIndex: undefined
        }, () => this.getUnionPropertyContent());
    };

    onObjectSelected = (index) => {
        this.setState({
            objectIndex: index
        });
    };

    getUnionsTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: "Selected union:" },
                    { ...item.name, brackets: false }
                ]}
            />
        )
    };

    getName = (index) => {
        const { projectResult: { informationTable: { objects } }, settings } = this.props;

        if (objects && settings) {
            return getItemName(index, objects, settings).toString();
        } else {
            return undefined;
        }
    }

    render() {
        const { loading, unionProperties, unionPropertyIndex, unionPropertyContent, objectIndex } = this.state;
        const { item, projectId, projectResult, ...other}  = this.props;

        return (
            <FullscreenDialog {...other}>
                <FullscreenHeader
                    id={"unions-details-header"}
                    onClose={this.props.onClose}
                    title={this.getUnionsTitle()}
                />
                <MultiColumns>
                    <div id={"unions-tables"}>
                        {loading.unionProperties ?
                            <StyledCircularProgress />
                            :
                            <TablesList
                                headerText={"Union's characteristics"}
                                tableIndex={unionPropertyIndex}
                                onTableSelected={this.onUnionPropertySelected}
                                tables={unionProperties}
                            />
                        }
                    </div>
                    <div id={"unions-table-content"} style={{display: "flex", flexDirection: "column"}}>
                        {loading.unionPropertyContent &&
                            <StyledCircularProgress />
                        }
                        {!Number.isNaN(Number(unionPropertyIndex)) && !loading.unionPropertyContent &&
                            <TableItemsList
                                getName={this.getName}
                                headerText={Object.keys(unionProperties)[unionPropertyIndex]}
                                itemIndex={objectIndex}
                                onItemInTableSelected={this.onObjectSelected}
                                table={unionPropertyContent}
                            />
                        }
                    </div>
                    <div id={"unions-table-item"} style={{display: "flex", flexDirection: "column"}}>
                        <div style={{minHeight: "30%"}}>
                            <TraitsTable
                                columnsLabels={{key: "Name", value: "Value"}}
                                traits={item.traits}
                            />
                        </div>
                        <div style={{flexGrow: 1}}>
                            {loading.object &&
                                <StyledCircularProgress />
                            }
                            {!Number.isNaN(Number(objectIndex)) && !loading.object &&
                                <ObjectTable
                                    informationTable={projectResult.informationTable}
                                    objectIndex={objectIndex}
                                    objectHeader={this.getName(objectIndex).toString()}
                                />
                            }
                        </div>
                    </div>
                </MultiColumns>
            </FullscreenDialog>
        );
    }
}

UnionsDialog.propTypes = {
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.shape({
            primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            toString: PropTypes.func
        }),
        traits: PropTypes.exact({
            'Accuracy of approximation': PropTypes.number,
            'Quality of approximation': PropTypes.number,
        }),
        toFilter: PropTypes.func
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool,
    projectId: PropTypes.string.isRequired,
    projectResult: PropTypes.object.isRequired,
    settings: PropTypes.shape({
        indexOption: PropTypes.string.isRequired
    })
};

export default UnionsDialog;