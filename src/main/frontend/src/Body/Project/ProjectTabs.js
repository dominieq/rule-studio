import React from 'react';
import PropTypes from 'prop-types';
import Classification from "./Tabs/Classification";
import CrossValidation from "./Tabs/CrossValidation";
import Cones from "./Tabs/Cones";
import Data from "./Data/DisplayData";
import Rules from "./Tabs/Rules";
import Unions from "./Tabs/Unions";
import { fetchData } from "./Utils/fetchFunctions";
import StyledTab from "../../Utils/Navigation/StyledTab";
import StyledTabs from "../../Utils/Navigation/StyledTabs";
import ExternalFile from "../../Utils/Feedback/CustomIcons/ExternalFile";
import OutdatedData from "../../Utils/Feedback/AlertBadge/Alerts/OutdatedData";

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

    componentDidMount() {
        this._isMounted = true;

        const { project: { result } } = this.props;
        this.updateAlerts(result);
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const shallowComparison = this.props !== nextProps || this.state !== nextState;
        const deepComparison = this.props.project.result.id !== nextProps.project.result.id;

        return shallowComparison || deepComparison;
    };

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

    componentWillUnmount() {
        this._isMounted = false;

        const { currentProject, selected } = this.state;
        if (currentProject !== null && selected === 0) {
            this.updateProjectOnServer(currentProject, selected);
        }
    };

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

    onDataChange = (project) => {
        this.setState({
            currentProject: project
        });
    };

    showAlert = (index, show) => {
        this.setState(({showAlert}) => {
            showAlert[index] = show;

            return {
                showAlert: showAlert
            };
        });
    };

    onRulesUploaded = (isExternal) => {
        this.setState({
            showExternalRules: isExternal
        });
    };

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
                                    onAttributesChange={this.props.updateIndexOptions}
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
    project: PropTypes.object,
    serverBase: PropTypes.string,
    showAlert: PropTypes.func,
    updateIndexOptions: PropTypes.func,
    updateProject: PropTypes.func
};

export default ProjectTabs;
