import React from 'react';
import PropTypes from 'prop-types';
import Classification from "./Tabs/Classification";
import CrossValidation from "./Tabs/CrossValidation";
import Cones from "./Tabs/Cones";
import Data from "./Data/DisplayData";
import Rules from "./Tabs/Rules";
import Unions from "./Tabs/Unions";
import { fetchData, fetchProject } from "../../Utils/utilFunctions/fetchFunctions";
import StyledTab from "../../Utils/Navigation/StyledTab";
import StyledTabs from "../../Utils/Navigation/StyledTabs";
import ExternalFile from "../../Utils/Feedback/CustomIcons/ExternalFile";
import OutdatedData from "../../Utils/Feedback/AlertBadge/Alerts/OutdatedData";

/**
 * The Project section in RuLeStudio. Allows user to choose between tabs.
 * If necessary, displays information about outdated results shown in currently selected tab.
 *
 * @class
 * @category Tabs
 * @param {Object} props
 * @param {string} props.objectGlobalName - The global visible object name used by all tabs as reference.
 * @param {function} props.onSnackbarOpen - Callback fired when the component request to display an error.
 * @param {Object} props.project - Current project.
 * @param {string} props.serverBase - The host and port in the URL of an API call.
 * @param {function} props.updateProject - Callback fired when a part of current project was changed.
 */
class ProjectTabs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            projectCopy: null,
            informationTableCopy: null,
            loading: false,
            selected: 0,
            showAlert: Array(5).fill(false),
            showExternalRules: false,
            showExternalData: false
        };
    }

    /**
     * Updates alerts based on the response from server.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} result - The response from the server.
     */
    updateAlerts = (result) => {
        /* Update alert in Dominance cones */
        if (result.dominanceCones != null && result.dominanceCones.hasOwnProperty("isCurrentData")) {
            this.setState(({showAlert}) => {
                showAlert[0] = !result.dominanceCones.isCurrentData;
                return { showAlert: showAlert };
            });
        } else {
            /* Reset alert if there are no dominance cones */
            this.setState(({showAlert}) => {
                showAlert[0] = false;
                return { showAlert: showAlert }
            })
        }

        /* Update alert in Class unions */
        if (result.unions != null && result.unions.hasOwnProperty("isCurrentData")) {
            this.setState(({showAlert}) => {
                showAlert[1] = !result.unions.isCurrentData;
                return { showAlert: showAlert };
            });
        } else {
            /* Reset alert if there are no class unions */
            this.setState(({showAlert}) => {
                showAlert[1] = false;
                return { showAlert: showAlert };
            });
        }

        /* Update alerts in Rules */
        if (result.rules != null) {
            if (result.rules.hasOwnProperty("isCurrentData")) {
                this.setState(({showAlert}) => {
                    showAlert[2] = !result.rules.isCurrentData;
                    return { showAlert: showAlert };
                });
            }

            if (result.rules.hasOwnProperty("externalRules")) {
                this.setState({
                    showExternalRules: result.rules.externalRules
                });
            }
        } else {
            /* Reset alerts if there are no rules*/
            this.setState(({showAlert}) => {
                showAlert[2] = false;
                return { showAlert: showAlert, showExternalAlert: false };
            });
        }

        /* Update alerts in Classification */
        if (result.classification != null) {
            if (result.classification.hasOwnProperty("isCurrentLearningData")) {
                if (result.classification.hasOwnProperty("isCurrentRuleSet")) {
                    this.setState(({showAlert}) => {
                        showAlert[3] = !(result.classification.isCurrentLearningData && result.classification.isCurrentRuleSet);
                        return { showAlert: showAlert };
                    });
                } else {
                    this.setState(({showAlert}) => {
                        showAlert[3] = !result.classification.isCurrentLearningData;
                        return { showAlert: showAlert };
                    });
                }
            }

            if (result.classification.hasOwnProperty("externalData")) {
                this.setState({
                    showExternalData: result.classification.externalData
                });
            }
        } else {
            /* Reset alerts if there are no classification results */
            this.setState(({showAlert}) => {
                showAlert[3] = false;
                return { showAlert: showAlert, showExternalData: false };
            })
        }

        /* Update alerts in CrossValidation */
        if (result.crossValidation != null && result.crossValidation.hasOwnProperty("isCurrentData")) {
            this.setState(({showAlert}) => {
                showAlert[4] = !result.crossValidation.isCurrentData;
                return { showAlert: showAlert };
            });
        } else {
            /* Reset alert if there are no cross-validation results */
            this.setState(({showAlert}) => {
                showAlert[4] = false;
                return { showAlert: showAlert };
            })
        }
    };

    getProject = () => {
        this.setState({
            loading: true,
        }, () => {
            const { project: { id: projectId }, serverBase } = this.props;

            const pathParams = { projectId };
            const method = "GET"

            fetchProject(
                pathParams, method, null, serverBase
            ).then(result => {
                if (this._isMounted && result != null) {
                    this.updateAlerts(result);
                }
            }).catch(
                this.props.onSnackbarOpen
            ).finally(() => {
                if (this._isMounted) {
                    this.setState({
                        loading: false
                    });
                }
            });
        });
    }

    /**
     * Utilizes {@link fetchData} to perform an API call with POST method and information table in body.
     * The goal of this function is to save user's changes made in information table.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} projectCopy - The local copy of a project that will be sent to server.
     * @param {Object} informationTableCopy - The local copy of an information table that will be sent to server.
     * @param {number} newValue - The index of currently selected tab.
     */
    updateProjectOnServer = (projectCopy, informationTableCopy, newValue) => {
        const { serverBase } = this.props;

        const pathParams = { projectId: projectCopy.id };
        const method = "POST";
        const body = new FormData();
        body.append("metadata", JSON.stringify(informationTableCopy.attributes));
        body.append("data", JSON.stringify(informationTableCopy.objects));

        fetchData(
            pathParams, method, body, serverBase
        ).then(result => {
            if (this._isMounted && result != null) {
                this.updateAlerts(result);
            }
        }).catch(error => {
            this.props.onSnackbarOpen(error);
        }).finally(() => {
            if (this._isMounted) {
                this.setState({
                    projectCopy: null,
                    loading: false,
                    selected: newValue
                });
            }

            this.props.updateProject(projectCopy);
        });
    };

    /**
     * A component's lifecycle method. Fired once when component was mounted.
     * Method calls {@link updateAlerts}.
     *
     * @function
     * @memberOf ProjectTabs
     */
    componentDidMount() {
        this._isMounted = true;
        this.getProject()
    };

    /**
     * A component's lifecycle method. Fired before rendering to determine whether a component should update.
     * <br>
     * <br>
     * Apart from making a shallow comparison between props and state,
     * method compares the id of current project to the updated project.
     * Component will update if the identities are different.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} nextProps - New props that will replace old props.
     * @param {Object} nextState - New state that will replace old state
     * @param {Object} nextContext - New context that will replace old context.
     * @returns {boolean} - If <code>true</code> the component will update.
     */
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const shallowComparison = this.props !== nextProps || this.state !== nextState;
        const deepComparison = this.props.project.id !== nextProps.project.id;

        return shallowComparison || deepComparison;
    };

    /**
     * A component's lifecycle method. Fired after a component was updated.
     * <br>
     * <br>
     * Method updates state's project settings if props settings have changed and the {@link Data} tab is selected.
     * <br>
     * <br>
     * Apart from that, method checks if project was changed. If a new project was forwarded, method updates alerts
     * and saves changes from old project if necessary.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} prevProps - Old props that were already replaced.
     * @param {Object} prevState - Old state that was already replaced.
     * @param {Object} snapshot - Returned from another lifecycle method <code>getSnapshotBeforeUpdate</code>. Usually undefined.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.project.id !== this.props.project.id) {
            this.getProject()

            const { projectCopy, informationTableCopy, selected } = this.state;
            if (projectCopy != null && informationTableCopy != null && selected === 0) {
                this.setState({
                    loading: true
                }, () => {
                    this.updateProjectOnServer(projectCopy, informationTableCopy, selected);
                });
            }
        }
    };

    /**
     * A component's lifecycle method. Fired when component was requested to be unmounted.
     * If there were any unsaved changes, method calls {@link updateProjectOnServer}.
     *
     * @function
     * @memberOf ProjectTabs
     */
    componentWillUnmount() {
        this._isMounted = false;

        const { projectCopy, informationTableCopy, selected } = this.state;
        if (projectCopy != null && informationTableCopy != null && selected === 0) {
            this.updateProjectOnServer(projectCopy, informationTableCopy, selected);
        }
    };

    /**
     * Fired when a tab is changed. If user had unsaved changes in {@link Data} tab,
     * method calls {@link updateProjectOnServer} to save them on server.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} event - Represents an event that takes place in DOM.
     * @param {number} newValue - The id of tab that was selected.
     */
    onTabChange = (event, newValue) => {
        const { projectCopy, informationTableCopy, selected } = this.state;

        if (projectCopy != null && informationTableCopy != null && selected === 0 && newValue !== 0) {
            this.setState({
                loading: true
            }, () => {
                this.updateProjectOnServer(projectCopy, informationTableCopy, newValue);
            });
        } else {
            this.setState({ selected: newValue });
        }
    };

    /**
     * Forwarded to the {@link Data} tab. Fired when an user makes changes in the information table.
     * Saves modified project in the component's state.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} project - Modified project from the {@link Data} tab.
     * @param {Object} informationTable - Modified information table from the {@link Data} tab.
     */
    onDataChange = (project, informationTable) => {
        this.setState({
            projectCopy: project,
            informationTableCopy: informationTable
        });
    };

    /**
     * Forwarded to all tabs. Fired when a tab receives information from the server that current results are outdated.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {number} index - The id of a tab.
     * @param {boolean} show - If <code>true</code> an alert about outdated results in tab will be displayed.
     */
    showAlert = (index, show) => {
        this.setState(({showAlert}) => {
            showAlert[index] = show;

            return {
                showAlert: showAlert
            };
        });
    };

    /**
     * Forwarded to the {@link Rules} tab. Fired when an user uploads rule set.
     * Saves this information in the component's state.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {boolean} isExternal - If <code>true</code> alert will be displayed that rule set was uploaded.
     */
    onRulesUploaded = (isExternal) => {
        this.setState({
            showExternalRules: isExternal
        });
    };

    /**
     * Forwarded to the {@link Rules} and {@link Classification} tabs. Fired when an  user uploads information table.
     * Saves this information in the component's state.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {boolean} isExternal - If <code>true</code> alert will be displayed that external data was classified.
     */
    onDataUploaded = (isExternal) => {
        this.setState({
            showExternalData: isExternal
        });
    };

    getTabProps = (index) => ({
        id: `project-tab-${index}`,
        'aria-controls': `project-tabpanel-${index}`
    });

    getTabBodyProps = (index) => ({
        objectGlobalName: this.props.objectGlobalName,
        onTabChange: this.props.updateProject,
        project: this.props.project,
        serverBase: this.props.serverBase,
        showAlert: this.showAlert,
        value: index
    });

    render() {
        const { loading ,selected, showAlert, showExternalRules, showExternalData } = this.state;
        const { project, serverBase } = this.props;

        return (
            <React.Fragment>
                <StyledTabs aria-label={"project tabs"} onChange={this.onTabChange} value={selected}>
                    <StyledTab label={"Data"} {...this.getTabProps(0)} />
                    <StyledTab
                        label={
                            <OutdatedData invisible={!showAlert[0]}>
                                Dominance cones
                            </OutdatedData>
                        }
                        {...this.getTabProps(1)}
                    />
                    <StyledTab
                        label={
                            <OutdatedData invisible={!showAlert[1]}>
                                Class unions
                            </OutdatedData>
                        }
                        {...this.getTabProps(2)}
                    />
                    <StyledTab
                        icon={showExternalRules ?
                            <ExternalFile WrapperProps={{style: { marginBottom: 0, marginRight: 8}}} /> : null
                        }
                        label={
                            <OutdatedData invisible={!showAlert[2]}>
                                Rules
                            </OutdatedData>
                        }
                        {...this.getTabProps(3)}
                    />
                    <StyledTab
                        icon={showExternalData ?
                            <ExternalFile WrapperProps={{style: { marginBottom: 0, marginRight: 8}}} /> : null
                        }
                        label={
                            <OutdatedData invisible={!showAlert[3]}>
                                Classification
                            </OutdatedData>
                        }
                        {...this.getTabProps(4)}
                    />
                    <StyledTab
                        label={
                            <OutdatedData invisible={!showAlert[4]}>
                                Cross-Validation
                            </OutdatedData>
                        }
                        {...this.getTabProps(5)}
                    />
                </StyledTabs>
                {
                    {
                        0: (
                                <Data
                                    project={project}
                                    onDataChange={this.onDataChange}
                                    loading={loading}
                                    serverBase={serverBase}
                                />
                            ),
                        1: <Cones {...this.getTabBodyProps(0)} />,
                        2: <Unions {...this.getTabBodyProps(1)} />,
                        3: (
                                <Rules
                                    onDataUploaded={this.onDataUploaded}
                                    onRulesUploaded={this.onRulesUploaded}
                                    {...this.getTabBodyProps(2)}
                                />
                            ),
                        4: <Classification onDataUploaded={this.onDataUploaded} {...this.getTabBodyProps(3)} />,
                        5: <CrossValidation {...this.getTabBodyProps(4)} />
                    }[selected]
                }
            </React.Fragment>
        );
    }
}

ProjectTabs.propTypes = {
    objectGlobalName: PropTypes.string,
    onSnackbarOpen: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    updateProject: PropTypes.func
};

export default ProjectTabs;
