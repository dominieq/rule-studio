import React from 'react';
import PropTypes from 'prop-types';
import Classification from "./Tabs/Classification";
import CrossValidation from "./Tabs/CrossValidation";
import Cones from "./Tabs/Cones";
import Data from "./Data/DisplayData";
import Rules from "./Tabs/Rules";
import Unions from "./Tabs/Unions";
import { fetchData, fetchProject } from "../../Utils/utilFunctions/fetchFunctions";
import StyledLinkTab from "../../Utils/Navigation/StyledLinkTab";
import StyledTabs from "../../Utils/Navigation/StyledTabs";
import ExternalFile from "../../Utils/Feedback/CustomIcons/ExternalFile";
import OutdatedData from "../../Utils/Feedback/AlertBadge/Alerts/OutdatedData";
import { Route, Switch } from 'react-router-dom';
import { tabNames } from "../../Utils/Constants/TabsNamesInPath";

/**
 * <h3>Overview</h3>
 * The Project section in RuLeStudio. Allows a user to choose between tabs.
 * If necessary, displays information about outdated results shown in currently selected tab.
 *
 * @constructor
 * @category Project
 * @param {Object} props
 * @param {boolean} props.deleting - If <code>true</code> the project was requested to be deleted.
 * @param {string} props.objectGlobalName - The global visible object name used by all tabs as reference.
 * @param {function} props.onSnackbarOpen - Callback fired when the component request to display an error.
 * @param {Object} props.project - Current project.
 * @param {string} props.serverBase - The host and port in the URL of an API call.
 * @param {function} props.updateProject - Callback fired when a part of current project was changed.
 * @returns {React.PureComponent}
 */
class ProjectTabs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            informationTable: null,
            isUpdateNecessary: false,
            refreshNeeded: false,
            loading: false,
            selected: 0,
            showAlert: Array(5).fill(false),
            showExternalRules: false,
            showExternalData: false,
            alertMessages: Array(5).fill(null)
        };
    }

    /**
     * <h3>Overview</h3>
     * Updates alerts based on the response from server.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} result - The response from the server.
     */
    updateAlerts = (result) => {
        /* Update alert in Dominance cones */
        if (result.dominanceCones != null && result.dominanceCones.hasOwnProperty("isCurrentData")) {
            this.setState(({showAlert, alertMessages}) => {
                showAlert[0] = !result.dominanceCones.isCurrentData;
                alertMessages[0] = result.dominanceCones.hasOwnProperty("errorMessages") ?
                    result.dominanceCones.errorMessages : null;
                return { showAlert, alertMessages };
            });
        } else {
            /* Reset alert if there are no dominance cones */
            this.setState(({showAlert, alertMessages}) => {
                showAlert[0] = false;
                alertMessages[0] = null;
                return { showAlert, alertMessages };
            });
        }

        /* Update alert in Class unions */
        if (result.unions != null && result.unions.hasOwnProperty("isCurrentData")) {
            this.setState(({showAlert, alertMessages}) => {
                showAlert[1] = !result.unions.isCurrentData;
                alertMessages[1] = result.unions.hasOwnProperty("errorMessages") ?
                    result.unions.errorMessages : null
                return { showAlert, alertMessages };
            });
        } else {
            /* Reset alert if there are no class unions */
            this.setState(({showAlert, alertMessages}) => {
                showAlert[1] = false;
                alertMessages[1] = null;
                return { showAlert, alertMessages };
            });
        }

        /* Update alerts in Rules */
        if (result.rules != null) {
            if (result.rules.hasOwnProperty("isCurrentData")) {
                this.setState(({showAlert, alertMessages}) => {
                    showAlert[2] = !result.rules.isCurrentData;
                    alertMessages[2] = result.rules.hasOwnProperty("errorMessages") ?
                        result.rules.errorMessages : null;
                    return { showAlert, alertMessages };
                });
            }

            if (result.rules.hasOwnProperty("externalRules")) {
                this.setState({
                    showExternalRules: result.rules.externalRules
                });
            }
        } else {
            /* Reset alerts if there are no rules*/
            this.setState(({showAlert, alertMessages}) => {
                showAlert[2] = false;
                alertMessages[2] = null;
                return { showAlert, showExternalRules: false, alertMessages };
            });
        }

        /* Update alerts in Classification */
        if (result.classification != null) {
            if (result.classification.hasOwnProperty("isCurrentData")) {
               this.setState(({showAlert, alertMessages}) => {
                   showAlert[3] = !result.classification.isCurrentData;
                   alertMessages[3] = result.classification.hasOwnProperty("errorMessages") ?
                       result.classification.errorMessages : null;
                   return { showAlert, alertMessages }
               });
            }

            if (result.classification.hasOwnProperty("externalData")) {
                this.setState({
                    showExternalData: result.classification.externalData
                });
            }
        } else {
            /* Reset alerts if there are no classification results */
            this.setState(({showAlert, alertMessages}) => {
                showAlert[3] = false;
                alertMessages[3] = null;
                return { showAlert, showExternalData: false, alertMessages };
            });
        }

        /* Update alerts in CrossValidation */
        if (result.crossValidation != null && result.crossValidation.hasOwnProperty("isCurrentData")) {
            this.setState(({showAlert, alertMessages}) => {
                showAlert[4] = !result.crossValidation.isCurrentData;
                alertMessages[4] = result.crossValidation.hasOwnProperty("errorMessages") ?
                    result.crossValidation.errorMessages : null;
                return { showAlert, alertMessages };
            });
        } else {
            /* Reset alert if there are no cross-validation results */
            this.setState(({showAlert, alertMessages}) => {
                showAlert[4] = false;
                alertMessages[4] = null;
                return { showAlert, alertMessages };
            });
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
     * <h3>Overview</h3>
     * Utilizes {@link fetchData} to perform an API call with POST method and information table in body.
     *
     * <h3>Goal</h3>
     * The goal of this function is to save user's changes made in information table.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {string} projectId - The identifier of a selected project.
     * @param {Object} informationTable - The local copy of an information table that will be sent to server.
     * @param {function} [finallyCallback] - The callback fired in finally part of the fetch function.
     */
    updateProjectOnServer = (projectId, informationTable, finallyCallback) => {
        const pathParams = { projectId };
        const method = "POST";
        const body = new FormData();
        body.append("metadata", JSON.stringify(informationTable.attributes));
        body.append("data", JSON.stringify(informationTable.objects));
        const { serverBase } = this.props;

        fetchData(
            pathParams, method, body, serverBase
        ).then(result => {
            if (this._isMounted && result != null) {
                this.updateAlerts(result);
            }
        }).catch(
            this.props.onSnackbarOpen
        ).finally(
            finallyCallback
        );
    };

    /**
     * <h3>Overview</h3>
     * A component's lifecycle method. Fired once when component was mounted.
     *
     * <h3>Goal</h3>
     * Method calls {@link updateAlerts}.
     *
     * @function
     * @memberOf ProjectTabs
     */
    componentDidMount() {
        this._isMounted = true;
        this.getProject();
        this.activateTabUpToURL();
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props !== nextProps || this.state !== nextState;
    }

    /**
     * <h3>Overview</h3>
     * A component's lifecycle method. Fired after a component was updated.
     *
     * <h3>Goal</h3>
     * Checks if project was changed. If a new project was forwarded, method makes an API call to retrieve that project
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
            const { project: { id: projectId }} = prevProps;
            const { informationTable, isUpdateNecessary, selected } = this.state;
          
            if (isUpdateNecessary && selected === 0) {
                this.setState({
                    loading: true
                }, () => {
                    this.updateProjectOnServer(projectId, informationTable, () => {
                        if (this._isMounted) {
                            this.setState({
                                isUpdateNecessary: false,
                                loading: false
                            });
                        }
                    });
                });
            } else if (selected !== 0) {
                this.setState({
                    refreshNeeded: true
                });
            }

            this.getProject();
            this.activateTabUpToURL();
        }

        if (this.props.history.action === "POP") {
            if (prevProps.location !== this.props.location) {
                this.activateTabUpToURL();
            }
        }
    };

    /**
     * <h3>Overview</h3>
     * A component's lifecycle method. Fired when component was requested to be unmounted.
     *
     * <h3>Goal</h3>
     * If there were any unsaved changes, method calls {@link updateProjectOnServer}.
     *
     * @function
     * @memberOf ProjectTabs
     */
    componentWillUnmount() {
        this._isMounted = false;

        const { deleting, project: { id: projectId }} = this.props;
        const { informationTable, isUpdateNecessary, selected } = this.state;

        if (isUpdateNecessary && selected === 0 && !deleting) {
            this.updateProjectOnServer(projectId, informationTable, () => {
                if (this._isMounted) {
                    this.setState({
                        isUpdateNecessary: false
                    });
                }
            });
        }
    };

    /**
     * <h3>Overview</h3>
     * Fired when a tab is changed. If user had unsaved changes in {@link Data} tab,
     * method calls {@link updateProjectOnServer} to save them on server.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} event - Represents an event that takes place in DOM.
     * @param {number} newValue - The id of tab that was selected.
     */
    onTabChange = (event, newValue) => {
        const { project: { id: projectId }} = this.props;
        const { informationTable, isUpdateNecessary, selected } = this.state;

        this.setState({
            selected: newValue
        }, () => {
            if (isUpdateNecessary && selected === 0 && newValue !== 0) {
                this.setState({
                    loading: true
                }, () => {
                    this.updateProjectOnServer(projectId, informationTable, () => {
                        if (this._isMounted) {
                            this.setState({
                                isUpdateNecessary: false,
                                loading: false
                            });
                        }
                    });
                });
            }
        });
    };

    /**
     * <h3>Overview</h3>
     * Forwarded to the {@link Data} tab. Fired when a user makes changes in the information table.
     * Saves modified project in the component's state.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} informationTable - Modified information table from the {@link Data} tab.
     * @param {boolean} isUpdateNecessary - If <code>true</code> information table will be sent to server on exit.
     */
    onDataChange = (informationTable, isUpdateNecessary) => {
        this.setState({
            informationTable: informationTable,
            isUpdateNecessary: isUpdateNecessary,
            refreshNeeded: false
        });
    };

    /**
     * <h3>Overview</h3>
     * Forwarded to all tabs. Fired when a tab receives information from the server that current results are outdated.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {number} index - The index of a selected tab.
     * @param {boolean} show - If <code>true</code> an alert about outdated results in tab will be displayed.
     * @param {string[]} [messages] - Optional messages displayed in alert.
     */
    showAlert = (index, show, messages) => {
        this.setState(({showAlert, alertMessages}) => {
            showAlert[index] = show;
            alertMessages[index] = messages;

            return {
                showAlert: showAlert,
                alertMessages: alertMessages
            };
        });
    };

    /**
     * <h3>Overview</h3>
     * Forwarded to the {@link Rules} tab. Fired when a user uploads rule set.
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
     * <h3>Overview</h3>
     * Forwarded to the {@link Rules} and {@link Classification} tabs. Fired when a user uploads information table.
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

    activateTabUpToURL = () => {
        const url = window.location.href.toString();
        const urlSplitted = url.split('/');

        if (urlSplitted.length < 5) {
            this.props.history.replace({
                pathname: `/${this.props.project.id}/${tabNames[0]}`,
                state: { projectId: this.props.project.id }
            });
            this.onTabChange(null,0);
        }
        else {
            switch (urlSplitted[4]) {
                case tabNames[1]:
                    this.onTabChange(null,1);
                    break;
                case tabNames[2]:
                    this.onTabChange(null,2);
                    break;
                case tabNames[3]:
                    this.onTabChange(null,3);
                    break;
                case tabNames[4]:
                    this.onTabChange(null,4);
                    break;
                case tabNames[5]:
                    this.onTabChange(null,5);
                    break;
                default:
                    this.onTabChange(null,0);
            }
        }
    };

    render() {
        const {
            informationTable,
            loading,
            refreshNeeded,
            selected,
            showAlert,
            showExternalRules,
            showExternalData,
            alertMessages
        } = this.state;
        
        const {
            project,
            serverBase
        } = this.props;

        return (
            <React.Fragment>
                <StyledTabs aria-label={"project tabs"} onChange={this.onTabChange} value={selected}>
                    <StyledLinkTab
                        label={"Data"}
                        to={{pathname: `/${project.id}/${tabNames[0]}`, state: {projectId: project.id}}}
                        {...this.getTabProps(0)}
                    />
                    <StyledLinkTab
                        label={
                            <OutdatedData invisible={!showAlert[0]} messages={alertMessages[0]}>
                                Dominance cones
                            </OutdatedData>
                        }
                        to={{pathname: `/${project.id}/${tabNames[1]}`, state: {projectId: project.id}}}
                        {...this.getTabProps(1)}
                        
                    />
                    <StyledLinkTab
                        label={
                            <OutdatedData invisible={!showAlert[1]} messages={alertMessages[1]}>
                                Class unions
                            </OutdatedData>
                        }
                        to={{pathname: `/${project.id}/${tabNames[2]}`, state: {projectId: project.id}}}
                        {...this.getTabProps(2)}
                        
                    />
                    <StyledLinkTab
                        icon={showExternalRules ?
                            <ExternalFile WrapperProps={{style: { marginBottom: 0, marginRight: 8}}} /> : null
                        }
                        label={
                            <OutdatedData invisible={!showAlert[2]} messages={alertMessages[2]}>
                                Rules
                            </OutdatedData>
                        }
                        to={{pathname: `/${project.id}/${tabNames[3]}`, state: {projectId: project.id}}}
                        {...this.getTabProps(3)}
                        
                    />
                    <StyledLinkTab
                        icon={showExternalData ?
                            <ExternalFile WrapperProps={{style: { marginBottom: 0, marginRight: 8}}} /> : null
                        }
                        label={
                            <OutdatedData invisible={!showAlert[3]} messages={alertMessages[3]}>
                                Classification
                            </OutdatedData>
                        }
                        to={{pathname: `/${project.id}/${tabNames[4]}`, state: {projectId: project.id}}}
                        {...this.getTabProps(4)}
                        
                    />
                    <StyledLinkTab
                        label={
                            <OutdatedData invisible={!showAlert[4]} messages={alertMessages[4]}>
                                Cross-Validation
                            </OutdatedData>
                        }
                        to={{pathname: `/${project.id}/${tabNames[5]}`, state: {projectId: project.id}}}
                        {...this.getTabProps(5)}
                        
                    />
                </StyledTabs>
                <Switch>
                {
                    {

                        0: <Route
                            path={`/${project.id}/${tabNames[0]}`}
                            render={() => <Data
                                informationTable={informationTable}
                                loading={loading}
                                onDataChange={this.onDataChange}
                                project={project}
                                refreshNeeded={refreshNeeded}
                                serverBase={serverBase}
                                updateProject={this.props.updateProject}/>
                            }
                        />,
                        1: <Route
                            path={`/${project.id}/${tabNames[1]}`}
                            render={() => <Cones {...this.getTabBodyProps(0)} />}
                        />,
                        2: <Route
                            path={`/${project.id}/${tabNames[2]}`}
                            render={() => <Unions {...this.getTabBodyProps(1)} />}
                        />,
                        3: <Route
                            path={`/${project.id}/${tabNames[3]}`}
                            render={() => <Rules
                                onDataUploaded={this.onDataUploaded}
                                onRulesUploaded={this.onRulesUploaded}
                                {...this.getTabBodyProps(2)}/>
                            }
                        />,
                        4: <Route
                            path={`/${project.id}/${tabNames[4]}`}
                            render={() => <Classification
                                onDataUploaded={this.onDataUploaded}
                                {...this.getTabBodyProps(3)}/>
                            }
                        />,
                        5: <Route
                            path={`/${project.id}/${tabNames[5]}`}
                            render={() => <CrossValidation {...this.getTabBodyProps(4)} />}
                        />
                    }[selected]
                }
                </Switch>
            </React.Fragment>
        );
    }
}

ProjectTabs.propTypes = {
    deleting: PropTypes.bool,
    objectGlobalName: PropTypes.string,
    onSnackbarOpen: PropTypes.func,
    project: PropTypes.object,
    serverBase: PropTypes.string,
    updateProject: PropTypes.func
};

export default ProjectTabs;
