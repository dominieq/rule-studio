import React from "react";
import PropTypes from "prop-types";
import { getTitleConditions, getTitleDecisions } from "./Utils";
import { fetchObject, fetchRule } from "../../utilFunctions/fetchFunctions";
import { getItemName } from "../../utilFunctions/parseItems";
import { MultiColumns } from "../../Containers";
import ColouredTitle from "../../DataDisplay/ColouredTitle";
import { FullscreenDialog, FullscreenHeader } from "../FullscreenDialog";
import ObjectTable from "../../DataDisplay/ObjectTable";
import TableItemsList from "../../DataDisplay/TableItemsList";
import TraitsTable from "../../DataDisplay/TraitsTable";
import StyledCircularProgress from "../../Feedback/StyledCircularProgress";
import { AttributesMenu } from "../../Menus/AttributesMenu";

/**
 * <h3>Overview</h3>
 * The fullscreen dialog with details of a selected rule.
 *
 * @constructor
 * @category Dialogs
 * @subcategory Details Dialogs
 * @param {Object} props - Any other props will be forwarded to the {@link FullscreenDialog} element.
 * @param {Object} props.item - The selected rule with it's characteristics.
 * @param {number} props.item.id - The id of a selected rule.
 * @param {Object} props.item.name - The name of a selected rule.
 * @param {Object[][]} props.item.name.decisions - The decision part of a rule
 * @param {number|string} props.item.name.decisions[][].primary - The part of the decision coloured with primary colour.
 * @param {number|string} props.item.name.decisions[][].secondary - The part of the decision coloured with secondary colour.
 * @param {boolean} props.item.name.decisions[][].withBraces - If <code>true</code> braces will be added to decision.
 * @param {function} props.item.name.decisions[][].toString - Returns decision as a single string.
 * @param {Object[]} props.item.name.conditions - The condition part of a rule.
 * @param {number|string} props.item.name.conditions[].primary - The part of the condition coloured with primary colour.
 * @param {number|string} props.item.name.conditions[].secondary - The part of the condition coloured with secondary colour.
 * @param {function} props.item.name.conditions[].toString - Returns condition as a single string.
 * @param {function} props.item.name.decisionsToString - Returns decisions as a single string concatenated with a logical AND and OR.
 * @param {function} props.item.name.conditionsToString - Returns conditions as a single string concatenated with a logical AND.
 * @param {function} props.item.name.toString - Returns concatenated output of <code>decisionsToString</code> and <code>conditionsToString</code>.
 * @param {Object} props.item.traits - The characteristics of a selected rule in a key-value form.
 * @param {string} [props.item.traits.Type]
 * @param {function} props.item.toFilter - Returns rule in an easy to filter form.
 * @param {function} props.item.toSort - Returns rule in an easy to sort form.
 * @param {string} props.objectGlobalName - The global visible object name used by all tabs as reference.
 * @param {function} props.onClose - Callback fired when the component requests to be closed.
 * @param {function} props.onSnackbarOpen - Callback fired when the component requests to display an error.
 * @param {boolean} props.open - If <code>true</code> the Dialog is open.
 * @param {string} props.projectId - The identifier of a selected project.
 * @param {string} props.serverBase - The host in the URL of an API call.
 * @returns {React.PureComponent}
 */
class RulesDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: {
                rule: false,
                object: false
            },
            requestIndex: {
                rule: 0,
                object: 0
            },
            coveredObjects: [],
            isSupportingObject: [],
            objectNames: [],
            object: null,
            objectIndex: -1,
            attributes: [],
            attributesMenuEl: null
        };
    }

    componentDidMount() {
        this._isMounted = true;

        const { item: { id }} = this.props;
        this.getRule(id);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.projectId !== this.props.projectId) {
            this.setState({
                coveredObject: [],
                isSupportingObject: [],
                objectNames: [],
                object: null,
                objectIndex: -1,
                attributes: []
            });

            return;
        }

        if (prevProps.item.id !== this.props.item.id) {
            this.setState({
                coveredObject: [],
                isSupportingObject: [],
                object: null,
                objectIndex: -1
            }, () => this.getRule(this.props.item.id));
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getRule = (ruleIndex) => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.rule;

            return {
                loading: { ...loading, rule: true },
                requestIndex: { ...requestIndex, rule: localRequestIndex + 1 }
            };
        }, () => {
            const { projectId, serverBase } = this.props;
            const resource = "rules";
            const pathParams = { projectId, ruleIndex };

            fetchRule(
                resource, pathParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null && result.hasOwnProperty("indicesOfCoveredObjects")
                    && result.hasOwnProperty("isSupportingObject") && result.hasOwnProperty("objectNames")) {

                    this.setState(({requestIndex}) => {
                        if (requestIndex.rule !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, rule: 0 },
                            coveredObjects: result.indicesOfCoveredObjects,
                            isSupportingObject: result.isSupportingObject,
                            objectNames: result.objectNames
                        };
                    });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, rule: false }
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

            const resource = "rules";
            const pathParams = { projectId };
            const queryParams = { objectIndex, isAttributes: attributes.length === 0 };

            fetchObject(
                resource, pathParams, queryParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null && result.hasOwnProperty("value")) {
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

    onItemInTableSelected = (index) => {
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
        });
    }

    onObjectNamesChange = (names) => {
        this.setState({
            objectNames: names
        });
    }

    getRulesTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: `Rule ${item.id + 1}: ` },
                    ...getTitleDecisions(item.name.decisions),
                    { secondary: "\u2190" },
                    ...getTitleConditions(item.name.conditions)
                ]}
            />
        );
    };

    getItemsStyle = (index) => {
        const { coveredObjects, isSupportingObject } = this.state;

        if (isSupportingObject[coveredObjects.indexOf(index)]) {
            return { borderLeft: "4px solid green" };
        } else {
            return { borderLeft: "4px solid red" };
        }
    };

    getName = (index) => {
        const { coveredObjects, objectNames } = this.state;
        return getItemName(coveredObjects.indexOf(index), objectNames).toString();
    };

    render() {
        const { loading, coveredObjects, object, objectIndex, attributes, attributesMenuEl } = this.state;
        const { item, objectGlobalName, projectId, serverBase, open } = this.props;

        let displayedTraits = { ...item.traits };
        delete displayedTraits["Type"];

        return (
            <FullscreenDialog keepMounted={true} open={open} onClose={this.props.onClose}>
                <FullscreenHeader
                    id={"rules-details-header"}
                    onClose={this.props.onClose}
                    title={this.getRulesTitle()}
                />
                <MultiColumns>
                    <div id={"rules-traits"} style={{display: "flex", flexDirection: "column"}}>
                        <TraitsTable traits={displayedTraits} />
                    </div>
                    <div id={"rules-table-content"} style={{display: "flex", flexDirection: "column", width: "20%"}}>
                        {loading.rule &&
                        <StyledCircularProgress />
                        }
                        {!loading.rule && coveredObjects != null &&
                            <TableItemsList
                                getItemsStyle={this.getItemsStyle}
                                getName={this.getName}
                                headerText={"Covered objects"}
                                itemIndex={objectIndex}
                                onItemInTableSelected={this.onItemInTableSelected}
                                onSettingsClick={this.onAttributesMenuOpen}
                                table={coveredObjects}
                            />
                        }
                    </div>
                    <div id={"rules-table-item"} style={{display: "flex", flexDirection: "column", width: "40%"}}>
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
                </MultiColumns>
                <AttributesMenu
                    ListProps={{
                        id: "rules-details-desc-attributes-menu"
                    }}
                    MuiMenuProps={{
                        anchorEl: attributesMenuEl,
                        onClose: this.onAttributesMenuClose
                    }}
                    objectGlobalName={objectGlobalName}
                    onObjectNamesChange={this.onObjectNamesChange}
                    onSnackbarOpen={this.props.onSnackbarOpen}
                    projectId={projectId}
                    resource={"rules"}
                    serverBase={serverBase}
                    queryParams={{subject: item.id}}
                />
            </FullscreenDialog>
        );
    }
}

RulesDialog.propTypes = {
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.exact({
            decisions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
                primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                toString: PropTypes.func,
                withBraces: PropTypes.func,
            }))),
            conditions: PropTypes.arrayOf(PropTypes.shape({
                primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                toString: PropTypes.func,
            })),
            decisionsToString: PropTypes.func,
            conditionsToString: PropTypes.func,
            toString: PropTypes.func
        }),
        traits: PropTypes.shape({
            "Type": PropTypes.string
        }),
        toFilter: PropTypes.func,
        toSort: PropTypes.func,
    }),
    objectGlobalName: PropTypes.string,
    onClose: PropTypes.func,
    onSnackbarOpen: PropTypes.func,
    open: PropTypes.bool.isRequired,
    projectId: PropTypes.string,
    serverBase: PropTypes.string
};

export default RulesDialog;
