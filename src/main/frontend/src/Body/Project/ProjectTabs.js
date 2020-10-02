import React from 'react';
import PropTypes from 'prop-types';
import Classification from "./Tabs/Classification";
import CrossValidation from "./Tabs/CrossValidation";
import Cones from "./Tabs/Cones";
import Data from "./Data/DisplayData";
import Rules from "./Tabs/Rules";
import Unions from "./Tabs/Unions";
import { fetchData } from "../../Utils/utilFunctions/fetchFunctions";
import StyledTab from "../../Utils/Navigation/StyledTab";
import StyledTabs from "../../Utils/Navigation/StyledTabs";
import ExternalFile from "../../Utils/Feedback/CustomIcons/ExternalFile";
import OutdatedData from "../../Utils/Feedback/AlertBadge/Alerts/OutdatedData";
import { Route, Switch } from 'react-router-dom';

/**
 * The Project section in RuLeStudio. Allows user to choose between tabs.
 * If necessary, displays information about outdated results shown in currently selected tab.
 *
 * @class
 * @category Tabs
 * @param {Object} props
 * @param {Object} props.project - Current project.
 * @param {string} props.serverBase - The name of the host.
 * @param {function} props.showAlert - Callback fired when an alert is opened.
 * @param {function} props.updateIndexOptions - Callback fired when an attribute was changed.
 * @param {function} props.updateProject - Callback fired when a part of current project was changed.
 */
class ProjectTabs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentProject: null,
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
        if (result.dominanceCones !== null && result.dominanceCones.hasOwnProperty("isCurrentData")) {
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
        if (result.unions !== null && result.unions.hasOwnProperty("isCurrentData")) {
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
        if (result.rules !== null) {
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
        if (result.classification !== null) {
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
        if (result.crossValidation !== null && result.crossValidation.hasOwnProperty("isCurrentData")) {
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

    /**
     * Makes an API call on data to save changes (PUT) in current project.
     * Then, updates fields from current project with values from response
     * and saves changes in the {@link App}'s state.
     *
     * @function
     * @memberOf ProjectTabs
     * @param {Object} currentProject - The project that will be send to server.
     * @param {number} newValue - The id of currently selected tab.
     */
    updateProjectOnServer = (currentProject, newValue) => {
        const { serverBase } = this.props;
        let project = JSON.parse(JSON.stringify(currentProject));

        let data = new FormData();
        data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
        data.append("data", JSON.stringify(project.result.informationTable.objects));

        fetchData(
            serverBase, project.result.id, data
        ).then(result => {
            if (result) {
                let objects = Object.keys(result);

                for (let i = 0; i < objects.length; i++) {
                    if (result[objects[i]] !== null && project.result[objects[i]] !== null) {
                        let bools = Object.keys(result[objects[i]])

                        for (let j = 0; j < objects.length; j++) {
                            if (project.result[objects[i]].hasOwnProperty(bools[j])) {
                                project.result[objects[i]][bools[j]] = result[objects[i]][bools[j]];
                            }
                        }
                    }
                }

                if (this._isMounted) {
                    this.updateAlerts(result);
                }
            }
        }).catch(error => {
            if (!error.hasOwnProperty("open")) {
                console.log(error);
            } else {
                this.props.showAlert(error);
            }
        }).finally(() => {
            if (this._isMounted) {
                this.setState({
                    currentProject: null,
                    loading: false,
                    selected: newValue
                });
            }
            this.props.updateProject(project);
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

        const { project: { result } } = this.props;
        this.updateAlerts(result);
        this.activateTabUpToURL();
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
        const deepComparison = this.props.project.result.id !== nextProps.project.result.id;

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
        if (prevProps.project.settings.indexOption !== this.props.project.settings.indexOption && this.state.selected === 0) {
            this.setState(({currentProject}) => {
                if (currentProject !== null) {
                    currentProject.settings.indexOption = this.props.project.settings.indexOption;
                }

                return {
                    currentProject: currentProject
                };
            });
        }

        if (prevProps.project.result.id !== this.props.project.result.id) {
            const { project: { result } } = this.props;
            this.updateAlerts(result);

            const { currentProject, selected } = this.state;
            if (currentProject !== null && selected === 0) {
                this.setState({
                    loading: true
                }, () => {
                    this.updateProjectOnServer(currentProject, selected);
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

        const { currentProject, selected } = this.state;
        if (currentProject !== null && selected === 0) {
            this.updateProjectOnServer(currentProject, selected);
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
        const { currentProject, selected } = this.state;

        if (currentProject !== null && selected === 0 && newValue !== 0) {
            this.setState({
                loading: true
            }, () => {
                this.updateProjectOnServer(currentProject, newValue);
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
     */
    onDataChange = (project) => {
        this.setState({
            currentProject: project
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

    getTabProps = (index) => {
        return ({
            id: `project-tab-${index}`,
            'aria-controls': `project-tabpanel-${index}`,
        })
    };

    getTabBodyProps = (index) => {
        const { project, serverBase } = this.props;

        return ({
            project: project,
            onTabChange: this.props.updateProject,
            serverBase: serverBase,
            showAlert: this.showAlert,
            value: index
        });
    };

    activateTabUpToURL = () => {
        const url = window.location.href.toString();
        const urlSplitted = url.split('/');
        if(urlSplitted.length < 5) this.props.history.replace(`/${this.props.project.result.id}/data`);
        else {
            switch(urlSplitted[4]) {
                case "data":
                    this.onTabChange(null,0);
                    break;
                case "cones":
                    this.onTabChange(null,1);
                    break;
                case "unions":
                    this.onTabChange(null,2);
                    break;
                case "rules":
                    this.onTabChange(null,3);
                    break;
                case "classification":
                    this.onTabChange(null,4);
                    break;
                case "crossvalidation":
                    this.onTabChange(null,5);
                    break;
                default:
                    //do nothing
            }
        }
    };

    render() {
        const { loading ,selected, showAlert, showExternalRules, showExternalData } = this.state;
        const { project, serverBase } = this.props;

        return (
            <React.Fragment>
                <StyledTabs aria-label={"project tabs"} onChange={this.onTabChange} value={selected}>
                    <StyledTab label={"Data"} {...this.getTabProps(0)} link={`/${project.result.id}/data`}/>
                    <StyledTab
                        label={
                            <OutdatedData invisible={!showAlert[0]}>
                                Dominance cones
                            </OutdatedData>
                        }
                        {...this.getTabProps(1)}
                        link={`/${project.result.id}/cones`}
                    />
                    <StyledTab
                        label={
                            <OutdatedData invisible={!showAlert[1]}>
                                Class unions
                            </OutdatedData>
                        }
                        {...this.getTabProps(2)}
                        link={`/${project.result.id}/unions`}
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
                        link={`/${project.result.id}/rules`}
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
                        link={`/${project.result.id}/classification`}
                    />
                    <StyledTab
                        label={
                            <OutdatedData invisible={!showAlert[4]}>
                                Cross-Validation
                            </OutdatedData>
                        }
                        {...this.getTabProps(5)}
                        link={`/${project.result.id}/crossvalidation`}
                    />
                </StyledTabs>
                <Switch>
                {
                    {
                        0: (
                            <Route path={`/${project.result.id}/data`} render={() =>
                                <Data
                                    project={project}
                                    onDataChange={this.onDataChange}
                                    onAttributesChange={this.props.updateIndexOptions}
                                    loading={loading}
                                    serverBase={serverBase}
                                />}
                            />
                            ),
                        1: <Route path={`/${project.result.id}/cones`} render={() => <Cones {...this.getTabBodyProps(0)} />}/>,
                        2: <Route path={`/${project.result.id}/unions`} render={() => <Unions {...this.getTabBodyProps(1)} />}/>,
                        3: (
                            <Route path={`/${project.result.id}/rules`} render={() =>
                            <Rules
                                    onDataUploaded={this.onDataUploaded}
                                    onRulesUploaded={this.onRulesUploaded}
                                    {...this.getTabBodyProps(2)}
                                />}
                            />
                            ),
                        4: <Classification onDataUploaded={this.onDataUploaded} {...this.getTabBodyProps(3)} />,
                        5: <CrossValidation {...this.getTabBodyProps(4)} />
                    }[selected]
                }
                </Switch>
            </React.Fragment>
        );
    }
}

ProjectTabs.propTypes = {
    project: PropTypes.object,
    serverBase: PropTypes.string,
    showAlert: PropTypes.func,
    updateIndexOptions: PropTypes.func,
    updateProject: PropTypes.func
};

export default ProjectTabs;
