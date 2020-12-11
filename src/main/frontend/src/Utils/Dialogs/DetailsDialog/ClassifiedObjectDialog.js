import React from "react";
import PropTypes from "prop-types";
import { getTitleConditions, getTitleDecisions } from "./Utils";
import { fetchObject, fetchRule } from "../../utilFunctions/fetchFunctions";
import { getItemName, getRuleName } from "../../utilFunctions/parseItems";
import { MultiColumns } from "../../Containers";
import ColouredTitle from "../../DataDisplay/ColouredTitle";
import CustomTooltip from "../../DataDisplay/CustomTooltip";
import { FullscreenDialog, FullscreenHeader } from "../FullscreenDialog";
import ObjectTable from "../../DataDisplay/ObjectTable";
import RuleTable, { estimateTableHeight } from "../../DataDisplay/RuleTable";
import TableItemsList from "../../DataDisplay/TableItemsList";
import TraitsTable from "../../DataDisplay/TraitsTable";
import StyledCircularProgress from "../../Feedback/StyledCircularProgress";
import { AttributesMenu } from "../../Menus/AttributesMenu";
import { Slides } from "../../Navigation/Slides";
import CustomHeader from "../../Surfaces/CustomHeader";
import ArrowBack from "@material-ui/icons/ArrowBack";

/**
 * The fullscreen dialog with details of a selected classified object.
 *
 * @constructor
 * @category Dialogs
 * @param {Object} props
 * @param {string} props.coveredObjectResource - The name of a selected resource when fetching covered object.
 * @param {boolean} props.disableAttributesMenu - If <code>true</code> the attributes menu will be disabled.
 * @param {Object} props.item - The selected object with it's characteristics.
 * @param {number} props.item.id - The id of a selected object.
 * @param {Object} props.item.name - The name of a selected object.
 * @param {number|string} props.item.name.primary - The part of a name coloured with a primary colour.
 * @param {number|string} props.item.name.secondary - The part of a name coloured with a secondary colour.
 * @param {function} props.item.name.toString - Returns name as a single string.
 * @param {Object} props.item.traits - The characteristics of a selected object in a key-value form.
 * @param {string|number} props.item.traits.originalDecision - The original classification.
 * @param {string|number} props.item.traits.suggestedDecision - The suggested classification.
 * @param {number} props.item.traits.certainty - The certainty of suggested classification.
 * @param {number} props.item.traits.indicesOfCoveringRules - The number of rules that cover a selected object.
 * @param {function} props.item.toFilter - Returns item in an easy to filter form.
 * @param {string} props.objectGlobalName - The global visible object name used by all tabs as reference.
 * @param {function} props.onClose - Callback fired when the component requests to be closed.
 * @param {function} props.onSnackbarOpen - Callback fired when the component requests to display an error.
 * @param {boolean} props.open - If <code>true</code> the Dialog is open.
 * @param {string} props.projectId - The identifier of a selected project.
 * @param {string} props.resource - The name of a selected resource when fetching.
 * @param {string} props.serverBase - The host and port in the URL of an API call.
 * @returns {React.PureComponent}
 */
class ClassifiedObjectDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: {
                object: false,
                rule: false,
                coveredObjects: false,
                coveredObject: false,
            },
            requestIndex: {
                object: false,
                rule: false,
                coveredObjects: false,
                coveredObject: false
            },
            object: null,
            coveringRules: [],
            attributes: [],
            rule: null,
            ruleTraits: null,
            ruleIndex: -1,
            coveredObjects: [],
            coveredSupportingObjects: [],
            coveredObjectNames: [],
            coveredAttributes: [],
            coveredObject: null,
            coveredObjectIndex: -1,
            ruleTableHeight: 0,
            direction: "forward",
            slide: 0,
            sliding: false,
            attributesMenuEl: null,
        };
    }

    componentDidMount() {
        this._isMounted = true;

        const { item: { id }} = this.props;
        this.getObject(id, true);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.projectId !== this.props.projectId) {
            this.setState({
                object: null,
                coveringRules: [],
                attributes: [],
                rule: null,
                ruleTraits: null,
                ruleIndex: -1,
                coveredObjects: [],
                coveredSupportingObjects: [],
                coveredObjectNames: [],
                coveredAttributes: [],
                coveredObject: null,
                coveredObjectIndex: - 1,
                direction: "forward",
                slide: 0
            });

            return;
        }

        if (prevProps.item.id !== this.props.item.id) {
            this.setState({
                object: null,
                coveringRules: [],
                rule: null,
                ruleTraits: null,
                ruleIndex: -1,
                coveredObjects: [],
                coveredSupportingObjects: [],
                coveredObjectNames: [],
                coveredObject: null,
                coveredObjectIndex: -1,
                direction: "forward",
                slide: 0
            }, () => {
                const { item: { id }} = this.props;
                this.getObject(id, false);
            });

            return;
        }

        if (prevState.ruleIndex !== this.state.ruleIndex) {
            this.setState({
                coveredObjects: [],
                coveredSupportingObjects: [],
                coveredObjectNames: [],
                coveredObject: null,
                coveredObjectIndex: -1
            }, () => {
                if (this.state.ruleIndex > -1) this.getCoveredObjects(this.state.ruleIndex)
            });
        }

        if (this.state.ruleIndex > -1) {
            const height = estimateTableHeight(this.state.rule);

            if (prevState.ruleTableHeight !== height) {
                this.setState({
                    ruleTableHeight: height
                });
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getObject = (objectIndex, isAttributes) => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.object;

            return {
                loading: { ...loading, object: true },
                requestIndex: { ...requestIndex, object: localRequestIndex + 1 }
            };
        }, () => {
            const { projectId, resource, serverBase } = this.props;
            const pathParams = { projectId };
            const queryParams = { objectIndex, isAttributes };

            fetchObject(
                resource, pathParams, queryParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null && result.hasOwnProperty("object")
                    && result.hasOwnProperty("indicesOfCoveringRules")) {

                    this.setState(({requestIndex, attributes}) => {
                        if (requestIndex.object !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, object: 0 },
                            object: result.object,
                            coveringRules: result.indicesOfCoveringRules,
                            attributes: result.hasOwnProperty("attributes") ? result.attributes : attributes
                        };
                    });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, object: false },
                    }));
                }
            });
        });
    }

    getCoveringRule = (ruleIndex, finallyCallback) => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.rule;

            return {
                loading: { ...loading, rule: true },
                requestIndex: { ...requestIndex, rule: localRequestIndex + 1 }
            };
        }, () => {
            const { projectId, resource: resourceBase, serverBase } = this.props;
            const resource = resourceBase + "/rules";
            const pathParams = { projectId, ruleIndex };

            fetchRule(
                resource, pathParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null && result.hasOwnProperty("rule")
                    && result.hasOwnProperty("ruleCharacteristics")) {

                    this.setState(({requestIndex}) => {
                        if (requestIndex.rule !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, rule: 0 },
                            rule: result.rule,
                            ruleTraits: result.ruleCharacteristics
                        };
                    });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, rule: false }
                    }), () => {
                        if (typeof finallyCallback === "function") finallyCallback();
                    });
                }
            });
        });
    };

    getCoveredObjects = (ruleIndex) => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.coveredObjects;

            return {
                loading: { ...loading, coveredObjects: true },
                requestIndex: { ...requestIndex, coveredObjects: localRequestIndex + 1 }
            };
        }, () => {
            const { projectId, resource: resourceBase, serverBase } = this.props;
            const resource = resourceBase + "/rules";
            const pathParams = { projectId, ruleIndex };

            fetchRule(
                resource, pathParams, serverBase, true
            ).then(result => {
                if (this._isMounted && result != null && result.hasOwnProperty("objectNames")
                    && result.hasOwnProperty("indicesOfCoveredObjects") && result.hasOwnProperty("isSupportingObject")) {

                    this.setState(({requestIndex}) => {
                        if (requestIndex.coveredObjects !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, coveredObjects: 0 },
                            coveredObjects: result.indicesOfCoveredObjects,
                            coveredSupportingObjects: result.isSupportingObject,
                            coveredObjectNames: result.objectNames
                        };
                    });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, coveredObjects: false }
                    }));
                }
            });
        });
    };

    getCoveredObject = (objectIndex, finallyCallback) => {
        let localRequestIndex = 0;

        this.setState(({loading, requestIndex}) => {
            localRequestIndex = requestIndex.coveredObject;

            return {
                loading: { ...loading, coveredObject: true },
                requestIndex: { ...requestIndex, coveredObject: localRequestIndex + 1 }
            };
        }, () => {
            const { coveredAttributes } = this.state;
            const { coveredObjectResource, projectId, resource: resourceBase, serverBase } = this.props;

            const resource = coveredObjectResource != null ? coveredObjectResource : resourceBase + "/rules";
            const pathParams = { projectId };
            const queryParams = { objectIndex, isAttributes: coveredAttributes.length === 0 };

            fetchObject(
                resource, pathParams, queryParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null && result.hasOwnProperty("value")) {
                    this.setState(({requestIndex, coveredAttributes}) => {
                        if (requestIndex.coveredObject !== localRequestIndex + 1) {
                            return { };
                        }

                        return {
                            requestIndex: { ...requestIndex, coveredObject: 0 },
                            coveredObject: result.value,
                            coveredAttributes: result.hasOwnProperty("attributes") ?
                                result.attributes : coveredAttributes
                        };
                    });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, coveredObject: false }
                    }), () => {
                        if (typeof finallyCallback === "function") finallyCallback();
                    })
                }
            })
        })
    }

    onEnter = () => {
        this.setState({
            direction: "forward",
            slide: 0
        });
    };

    onEscapeKeyDown = () => {
        const { slide } = this.state;

        if (slide === 0) {
            this.props.onClose();
        } else {
            this.slide("backward", 0);
        }
    };

    onItemInTableSelected = (index) => {
        const finallyCallback = () => this.setState({ coveredObjectIndex: index });
        this.getCoveredObject(index, finallyCallback)
    };

    onCoveringRuleSelected = (index) => {
        const finallyCallback = () => this.setState({ ruleIndex: index });
        this.getCoveringRule(index, finallyCallback);
    };

    onCoveredObjectNamesChange = (names) => {
        this.setState({
            coveredObjectNames: names
        });
    };

    onAttributesMenuOpen = (event) => {
        const currentTarget = event.currentTarget;

        this.setState({
            attributesMenuEl: currentTarget
        });
    };

    onAttributesMenuClose = () => {
        this.setState({
            attributesMenuEl: null
        })
    }

    getClassificationTitle = () => {
        const { item } = this.props;

        return (
            <ColouredTitle
                text={[
                    { primary: "Selected object:"},
                    { ...item.name, brackets: false, }
                ]}
            />
        );
    };

    getRulesTitle = () => {
        const { ruleIndex, rule } = this.state;

        if (ruleIndex > -1) {
            const ruleName = getRuleName(rule);

            return (
                <ColouredTitle
                    text={[
                        { primary: `Rule ${ruleIndex + 1}: ` },
                        ...getTitleDecisions(ruleName.decisions),
                        { secondary: "\u2190" },
                        ...getTitleConditions(ruleName.conditions)
                    ]}
                />
            );
        } else {
            return (
                <div style={{display: "none"}}/>
            );
        }
    };

    getCoveredObjectName = (index) => {
        const { coveredObjects, coveredObjectNames } = this.state;
        return getItemName(coveredObjects.indexOf(index), coveredObjectNames).toString();
    };

    getCoveredObjectStyle = (index) => {
        const { ruleIndex, coveredObjects, coveredSupportingObjects } = this.state;

        if (ruleIndex > -1) {
            if (coveredSupportingObjects[coveredObjects.indexOf(index)]) {
                return { borderLeft: "4px solid green" };
            } else {
                return { borderLeft: "4px solid red" };
            }
        } else {
            return { };
        }
    };

    getSlotStyle = (index) => {
        if (index === 1) {
            return { width: "100%" };
        } else {
            return {};
        }
    };

    getHeaderStyle = (index) => {
        const { sliding } = this.state;
        let style = { display: "flex", flex: "1 0 100%" };

        if (sliding && index === 1) {
            style = { ...style, overflowX: "hidden" };
        }

        return style;
    };

    slide = (direction, nextSlide) => {
        this.setState({
            direction: direction,
            sliding: true
        }, () => {
            setTimeout(() => this.setState({
                direction: "forward",
                slide: nextSlide,
                sliding: false
            }), 1000);
        });
    }

    render() {
        const {
            loading,
            object,
            coveringRules,
            attributes,
            rule,
            ruleTraits,
            ruleIndex,
            coveredObjects,
            coveredObject,
            coveredObjectIndex,
            coveredAttributes,
            direction,
            ruleTableHeight,
            slide,
            sliding,
            attributesMenuEl,
        } = this.state;

        const {
            disableAttributesMenu,
            item,
            objectGlobalName,
            projectId,
            resource,
            serverBase,
            open
        } = this.props;

        const { originalDecision, suggestedDecision, certainty } = item.traits;

        return (
            <FullscreenDialog
                disableEscapeKeyDown={true}
                keepMounted={true}
                onClose={this.props.onClose}
                onEnter={this.onEnter}
                onEscapeKeyDown={this.onEscapeKeyDown}
                open={open}
            >
                <CustomHeader style={{ padding: 0 }}>
                    <Slides
                        direction={direction}
                        getSlotStyle={this.getSlotStyle}
                        sliding={sliding}
                        value={slide}
                    >
                        <FullscreenHeader
                            HeaderComponent={"div"}
                            HeaderProps={{ style: { ...this.getHeaderStyle(0) }}}
                            id={"classified-details-header"}
                            onClose={this.props.onClose}
                            optional={
                                <React.Fragment>
                                    <span aria-label={"original-decision"}>
                                        {`Original decision: ${originalDecision}`}
                                    </span>
                                    <span aria-label={"suggested-decision"}>
                                        {`Certainty: ${certainty}   |   Suggested decision: ${suggestedDecision}`}
                                    </span>
                                </React.Fragment>
                            }
                            title={this.getClassificationTitle()}
                        />
                        <FullscreenHeader
                            closeIcon={<ArrowBack />}
                            CloseButtonProps={{
                                onMouseEnter: undefined,
                                onMouseLeave: undefined
                            }}
                            CloseTooltipProps={{ title: "Go back" }}
                            HeaderComponent={"div"}
                            HeaderProps={{ style: { ...this.getHeaderStyle(1) }}}
                            id={"classified-rules-header"}
                            onClose={() => this.slide("backward", 0)}
                            title={this.getRulesTitle()}
                        />
                    </Slides>
                </CustomHeader>
                <Slides
                    direction={direction}
                    sliding={sliding}
                    value={slide}
                >
                    <MultiColumns>
                        <div id={"classified-object"} style={{display: "flex", flexDirection: "column", width: "40%"}}>
                            {loading.object &&
                                <StyledCircularProgress />
                            }
                            {!loading.object && object != null &&
                                <ObjectTable
                                    attributes={attributes}
                                    object={object}
                                    objectHeader={item.name.toString()}
                                />
                            }
                        </div>
                        <div id={"classified-covering-rules"} style={{display: "flex", flexDirection: "column", width: "15%"}}>
                            {loading.object &&
                                <StyledCircularProgress/>
                            }
                            {!loading.object && object != null &&
                                <TableItemsList
                                    customisable={false}
                                    headerText={"Covering rules"}
                                    itemIndex={ruleIndex}
                                    itemText={"Rule"}
                                    onItemInTableSelected={this.onCoveringRuleSelected}
                                    table={coveringRules}
                                />
                            }
                        </div>
                        <div id={"classified-rules-traits"} style={{display: "flex", flexDirection: "column", width: "40%"}}>
                            {loading.rule &&
                                <StyledCircularProgress />
                            }
                            {!loading.rule && ruleIndex > -1 &&
                                <React.Fragment>
                                    <CustomTooltip
                                        arrow={true}
                                        enterDelay={250}
                                        enterNextDelay={500}
                                        placement={"top"}
                                        title={"Double click to view see details"}
                                        WrapperProps={{
                                            id: "rule-table",
                                            onDoubleClick: () => this.slide("forward", 1),
                                            style: { marginBottom: "5%", minHeight: ruleTableHeight }
                                        }}
                                    >
                                        <RuleTable rule={rule} />
                                    </CustomTooltip>
                                    <div id={"traits-table"} style={{flexGrow: 1}}>
                                        <TraitsTable traits={ruleTraits} />
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    </MultiColumns>
                    <MultiColumns>
                        <div id={"rule-traits"} style={{display: "flex", flexDirection: "column", width: "20%"}}>
                            {loading.rule &&
                                <StyledCircularProgress />
                            }
                            {!loading.rule && ruleIndex > -1 &&
                                <TraitsTable traits={ruleTraits}/>
                            }
                        </div>
                        <div id={"rule-covered-object-list"} style={{display: "flex", flexDirection: "column", width: "20%"}}>
                            {loading.coveredObjects &&
                                <StyledCircularProgress />
                            }
                            {!loading.coveredObjects && coveredObjects.length > 0 &&
                                <TableItemsList
                                    customisable={!disableAttributesMenu}
                                    getItemsStyle={this.getCoveredObjectStyle}
                                    getName={this.getCoveredObjectName}
                                    headerText={"Covered objects"}
                                    itemIndex={coveredObjectIndex}
                                    onItemInTableSelected={this.onItemInTableSelected}
                                    onSettingsClick={this.onAttributesMenuOpen}
                                    table={coveredObjects}
                                />
                            }
                        </div>
                        <div id={"rule-covered-object-details"} style={{display: "flex", flexDirection: "column", width: "40%"}}>
                            {loading.coveredObject &&
                                <StyledCircularProgress />
                            }
                            {!loading.coveredObject && coveredObjectIndex > -1 &&
                                <ObjectTable
                                    attributes={coveredAttributes}
                                    object={coveredObject}
                                    objectHeader={this.getCoveredObjectName(coveredObjectIndex).toString()}
                                />
                            }
                        </div>
                    </MultiColumns>
                </Slides>
                {!disableAttributesMenu &&
                    <AttributesMenu
                        ListProps={{
                            id: "classified-object-desc-attributes-menu"
                        }}
                        MuiMenuProps={{
                            anchorEl: attributesMenuEl,
                            onClose: this.onAttributesMenuClose
                        }}
                        objectGlobalName={objectGlobalName}
                        onObjectNamesChange={this.onCoveredObjectNamesChange}
                        onSnackbarOpen={this.props.onSnackbarOpen}
                        projectId={projectId}
                        resource={`${resource}/rules`}
                        serverBase={serverBase}
                        queryParams={{subject: ruleIndex}}
                    />
                }
            </FullscreenDialog>
        );
    }
}

ClassifiedObjectDialog.propTypes = {
    coveredObjectResource: PropTypes.string,
    disableAttributesMenu: PropTypes.bool,
    item: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.shape({
            primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            toString: PropTypes.func
        }),
        traits: PropTypes.shape({
            originalDecision: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            suggestedDecision: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            certainty: PropTypes.number,
            indicesOfCoveringRules: PropTypes.number
        }),
        toFilter: PropTypes.func
    }),
    objectGlobalName: PropTypes.string,
    onClose: PropTypes.func,
    onSnackbarOpen: PropTypes.func,
    open: PropTypes.bool.isRequired,
    projectId: PropTypes.string,
    resource: PropTypes.string,
    serverBase: PropTypes.string
};

export default ClassifiedObjectDialog;
