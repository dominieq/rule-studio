import React from "react";
import PropTypes from "prop-types";
import { fetchObject, fetchRule } from "../../../utilFunctions/fetchFunctions";
import { getItemName } from "../../../utilFunctions/parseItems";
import ColouredTitle from "../../../DataDisplay/ColouredTitle";
import { FullscreenDialog, FullscreenHeader, MultiColumns } from "../../../DataDisplay/FullscreenDialog";
import { getTitleConditions, getTitleDecisions } from "../Utils";
import ObjectTable from "../Elements/ObjectTable";
import TableItemsList from "../Elements/TableItemsList";
import TraitsTable from "../Elements/TraitsTable";
import StyledCircularProgress from "../../StyledCircularProgress";
import {AttributesMenu} from "../../../Menus/AttributesMenu";

/**
 * The fullscreen dialog with details of a selected rule.
 *
 * @name Rule Details Dialog
 * @constructor
 * @category Details Dialog
 * @param props {Object} - Any other props will be forwarded to the {@link FullscreenDialog} element.
 * @param props.item {Object} - The selected rule with it's characteristics.
 * @param props.item.id {number} - The id of a selected rule.
 * @param props.item.name {Object} - The name of a selected rule.
 * @param props.item.name.decisions {Object[][]} - The decision part of a rule
 * @param props.item.name.decisions[][].primary {number|string} - The part of the decision coloured with primary colour.
 * @param props.item.name.decisions[][].secondary {number|string} - The part of the decision coloured with secondary colour.
 * @param props.item.name.decisions[][].withBraces {boolean} - If <code>true</code> braces will be added to decision.
 * @param props.item.name.decisions[][].toString {function} - Returns decision as a single string.
 * @param props.item.name.conditions {Object[]} - The condition part of a rule.
 * @param props.item.name.conditions[].primary {number|string} - The part of the condition coloured with primary colour.
 * @param props.item.name.conditions[].secondary {number|string} - The part of the condition coloured with secondary colour.
 * @param props.item.name.conditions[].toString {function} - Returns condition as a single string.
 * @param props.item.name.decisionsToString {function} - Returns decisions as a single string concatenated with a logical AND and OR.
 * @param props.item.name.conditionsToString {function} - Returns conditions as a single string concatenated with a logical AND.
 * @param props.item.name.toString {function} - Returns concatenated output of <code>decisionsToString</code> and <code>conditionsToString</code>.
 * @param props.item.traits {Object} - The characteristics of a selected rule in a key-value form.
 * @param [props.item.traits.Type] {string}
 * @param props.item.toFilter {function} - Returns rule in an easy to filter form.
 * @param props.item.toSort {function} - Returns rule in an easy to sort form.
 * @param props.onClose {function} - Callback fired when the component requests to be closed.
 * @param props.onSnackbarOpen {function} - Callback fired when the component requests to display an error.
 * @param props.open {boolean} - If <code>true</code> the Dialog is open.
 * @param props.projectId {string} - The identifier of a selected project.
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
        const { item, onSnackbarOpen, projectId, serverBase, ...other } = this.props;

        let displayTraits = { ...item.traits };
        delete displayTraits["Type"];

        return (
            <FullscreenDialog {...other}>
                <FullscreenHeader
                    id={"rules-details-header"}
                    onClose={this.props.onClose}
                    title={this.getRulesTitle()}
                />
                <MultiColumns>
                    <div id={"rules-traits"} style={{display: "flex", flexDirection: "column"}}>
                        {!loading.rule ?
                            <TraitsTable traits={displayTraits} />
                            :
                            <StyledCircularProgress />
                        }
                    </div>
                    <div id={"rules-table-content"} style={{display: "flex", flexDirection: "column", width: "20%"}}>
                        {!loading.rule ?
                            <TableItemsList
                                getItemsStyle={this.getItemsStyle}
                                getName={this.getName}
                                headerText={"Covered objects"}
                                itemIndex={objectIndex}
                                onItemInTableSelected={this.onItemInTableSelected}
                                onSettingsClick={this.onAttributesMenuOpen}
                                table={coveredObjects}
                            />
                            :
                            <StyledCircularProgress />
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
                    onObjectNamesChange={this.onObjectNamesChange}
                    onSnackbarOpen={onSnackbarOpen}
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
    onClose: PropTypes.func,
    onSnackbarOpen: PropTypes.func,
    open: PropTypes.bool.isRequired,
    projectId: PropTypes.string,
    serverBase: PropTypes.string
};

export default RulesDialog;
