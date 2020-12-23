import React from "react";
import PropTypes from "prop-types";
import { fetchObject, fetchUnion } from "../../utilFunctions/fetchFunctions";
import { getItemName } from "../../utilFunctions/parseItems";
import { MultiColumns } from "../../Containers";
import ColouredTitle from "../../DataDisplay/ColouredTitle";
import { FullscreenDialog, FullscreenHeader,  } from "../FullscreenDialog";
import ObjectTable from "../../DataDisplay/ObjectTable";
import TableItemsList from "../../DataDisplay/TableItemsList";
import TablesList from "../../DataDisplay/TablesList";
import TraitsTable from "../../DataDisplay/TraitsTable";
import StyledCircularProgress from "../../Feedback/StyledCircularProgress";
import { AttributesMenu } from "../../Menus/AttributesMenu";

/**
 * The fullscreen dialog with details of a selected union.
 *
 * @constructor
 * @category Dialogs
 * @subcategory Details Dialogs
 * @param {Object} props - Any other props will be forwarded to the {@link FullscreenDialog} element.
 * @param {Object} props.item - The selected union with it's characteristics.
 * @param {number} props.item.id - The id of a selected union.
 * @param {Object} props.item.name - The name of a selected union.
 * @param {number|string} props.item.name.primary - The part of a name coloured with a primary colour.
 * @param {number|string} props.item.name.secondary - The part of a name coloured with a secondary colour.
 * @param {function} props.item.name.toString - Returns name as a single string.
 * @param {Object} props.item.traits - The characteristics of a selected union in a key-value form.
 * @param {number} props.item.traits.Accuracy_of_approximation
 * @param {number} props.item.traits.Quality_of_approximation
 * @param {function} props.item.toFilter - Returns item in an easy to filter form.
 * @param {string} props.objectGlobalName - The global visible object name used by all tabs as reference.
 * @param {function} props.onClose - Callback fired when the component requests to be closed.
 * @param {function} props.onSnackbarOpen - Callback fired when the component requests to display an error.
 * @param {boolean} props.open - If <code>true</code> the Dialog is open.
 * @param {string} props.projectId - The identifier of a selected project.
 * @param {string} props.serverBase - The host in the URL of an API call.
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
            unionPropertyIndex: -1,
            unionPropertyContent: [],
            objectNames: [],
            object: null,
            attributes: [],
            objectIndex: -1,
            attributesMenuEl: null
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
        if (prevProps.projectId !== this.props.projectId) {
            this.setState({
                unionProperties: {},
                unionPropertyIndex: -1,
                unionPropertyContent: [],
                objectNames: [],
                object: null,
                attributes: [],
                objectIndex: -1
            });

            return;
        }

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
            const { item: { id: unionIndex }, projectId, serverBase } = this.props;
            const pathParams = { projectId, unionIndex, arrayPropertyType: undefined };

            fetchUnion(
                pathParams, serverBase
            ).then(result => {
                if (this._isMounted && Object.keys(result).length === this._unionPropertyKeys.length) {
                    this.setState(({requestIndex}) => {
                        if (requestIndex.unionProperties !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, unionProperties: 0 },
                            unionProperties: result
                        };
                    });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
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
            const { item: { id: unionIndex }, projectId, serverBase } = this.props;
            const { unionPropertyIndex } = this.state;
            const pathParams = { projectId, unionIndex, arrayPropertyType: this._unionPropertyKeys[unionPropertyIndex] };

            fetchUnion(
                pathParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null
                    && result.hasOwnProperty("objectNames") && result.hasOwnProperty("value")) {
                    this.setState(({requestIndex}) => {
                        if (requestIndex.unionPropertyContent !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, unionPropertyContent: 0 },
                            unionPropertyContent: result.value,
                            objectNames: result.objectNames
                        };
                    });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                       loading: { ...loading, unionPropertyContent: false }
                    }));
                }
            });
        });
    }

    getObject = (objectIndex, finallyCallback) => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.object;

            return {
                loading: { ...loading, object: true },
                requestIndex: { ...requestIndex, object: localRequestIndex + 1 }
            }
        }, () => {
            const { projectId, serverBase } = this.props;
            const { attributes } = this.state;

            const resource = "unions";
            const pathParams = { projectId };
            const queryParams = { objectIndex, isAttributes: attributes.length === 0 }

            fetchObject(
                resource, pathParams, queryParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null) {
                    this.setState(({requestIndex, attributes}) => {
                        if (requestIndex.object !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, object: 0 },
                            object: result.value,
                            attributes: result.hasOwnProperty("attributes") ? result.attributes : attributes
                        };
                    });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, object: false }
                    }), () => {
                        if (typeof finallyCallback === "function") finallyCallback();
                    });
                }
            });
        });
    }

    onExited = () => {
        this.setState({
            unionPropertyIndex: -1,
            objectIndex: -1,
        })
    };

    onUnionPropertySelected = (index) => {
        this.setState({
            unionPropertyIndex: index,
            objectIndex: -1
        }, () => this.getUnionPropertyContent());
    };

    onObjectSelected = (index) => {
        const finallyCallback = () => this.setState({ objectIndex: index });
        this.getObject(index, finallyCallback);
    };

    onAttributesMenuOpen = (event) => {
        const currentTarget = event.currentTarget;

        this.setState({
            attributesMenuEl: currentTarget
        });
    }

    onAttributesMenuClose = () => {
        this.setState({
            attributesMenuEl: null
        })
    }

    onObjectNamesChange = (names) => {
        this.setState({
            objectNames: names
        });
    }

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
        const { unionPropertyContent, objectNames } = this.state;
        return getItemName(unionPropertyContent.indexOf(index), objectNames).toString();
    }

    render() {
        const {
            loading,
            unionProperties,
            unionPropertyIndex,
            unionPropertyContent,
            object,
            attributes,
            objectIndex,
            attributesMenuEl
        } = this.state;

        const { item, objectGlobalName, open, projectId, serverBase } = this.props;

        return (
            <FullscreenDialog keepMounted={true} open={open} onClose={this.props.onClose}>
                <FullscreenHeader
                    id={"unions-details-header"}
                    onClose={this.props.onClose}
                    title={this.getUnionsTitle()}
                />
                <MultiColumns>
                    <div id={"unions-tables"} style={{display: "flex", flexDirection: "column"}}>
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
                        {!loading.unionPropertyContent && unionPropertyIndex > -1 &&
                            <TableItemsList
                                getName={this.getName}
                                headerText={Object.keys(unionProperties)[unionPropertyIndex]}
                                itemIndex={objectIndex}
                                onItemInTableSelected={this.onObjectSelected}
                                onSettingsClick={this.onAttributesMenuOpen}
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
                        <div style={{display: "flex", flexDirection: "column", flexGrow: 1}}>
                            {loading.object &&
                                <StyledCircularProgress />
                            }
                            {!loading.object && objectIndex > -1 &&
                                <ObjectTable
                                    attributes={attributes}
                                    object={object}
                                    objectHeader={this.getName(objectIndex)}
                                />
                            }
                        </div>
                    </div>
                </MultiColumns>
                <AttributesMenu
                    ListProps={{
                        id: 'unions-details-desc-attributes-menu'
                    }}
                    MuiMenuProps={{
                        anchorEl: attributesMenuEl,
                        onClose: this.onAttributesMenuClose
                    }}
                    objectGlobalName={objectGlobalName}
                    onObjectNamesChange={this.onObjectNamesChange}
                    onSnackbarOpen={this.props.onSnackbarOpen}
                    projectId={projectId}
                    resource={"unions"}
                    serverBase={serverBase}
                    queryParams={{subject: item.id, set: this._unionPropertyKeys[unionPropertyIndex]}}
                />
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
    objectGlobalName: PropTypes.string,
    onClose: PropTypes.func,
    onSnackbarOpen: PropTypes.func,
    open: PropTypes.bool,
    projectId: PropTypes.string.isRequired,
    serverBase: PropTypes.string
};

export default UnionsDialog;
