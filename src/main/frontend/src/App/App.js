import React, {Component} from 'react';
import { fetchProject, fetchProjects } from "./fetchFunctions";
import Header from "../Header/Header";
import { ProjectMenu } from "../Header/Elements";
import Help from '../Body/Help/Help';
import Home from "../Body/Home/Home";
import Import from "../Body/Import/Import";
import ProjectTabs from "../Body/Project/ProjectTabs";
import Project from "../Utils/Classes/Project";
import LoadingDelay from "../Utils/Feedback/LoadingDelay";
import LoadingSnackbar from "../Utils/Feedback/LoadingSnackbar";
import RuleWorkAlert from "../Utils/Feedback/RuleWorkAlert";
import DeleteProjectDialog from "./Dialogs/DeleteProjectDialog";
import RenameProjectDialog from "./Dialogs/RenameProjectDialog";
import SettingsProjectDialog from "./Dialogs/SettingsProjectDialog";
import {DarkTheme, LightTheme} from "./Themes/Themes";
import CssBaseline from "@material-ui/core/CssBaseline";
import {MuiThemeProvider} from "@material-ui/core/styles";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            loadingTitle: "",
            body: "Home",
            currentProject: -1,
            projects: [],
            darkTheme: true,
            open: {
                settingsDialog: false,
                renameDialog: false,
                deleteDialog: false,
            },
            alertProps: undefined,
        };
    }

    componentDidMount() {
        this.setState({
            loading: true,
            loadingTitle: "Loading projects",
        }, () => {
            fetchProjects(
                "GET", null
            ).then(result => {
                if (Array.isArray(result)) {
                    this.setState(({projects}) => ({
                        projects: [
                            ...projects,
                            ...result.map(item => new Project(item))
                        ]
                    }));
                } else {
                    this.setState({
                        alertProps: {
                            message: "Server isn't responding :(",
                            open: true,
                            severity: "error"
                        }
                    });
                }
            }).catch(error => {
                this.setState({ alertProps: error });
            }).finally(() => {
                this.setState({ loading: false });
            });
        });
    };

    onDataChanges = (project) => {
        this.setState(({currentProject, projects}) => {
            let index = currentProject;

            if (index === -1 && projects.length) {
                for (let i = 0; i < projects.length; i++) {
                   if (projects[i].result.id === project) {
                       index = i;
                       break;
                   }
                }
            } else if (index === -1 && !projects.length) {
                return { projects: projects };
            }

            if (index > -1) {
                return {
                    projects: [
                        ...projects.slice(0, index),
                        {
                            ...projects[index],
                            ...project,
                            dataUpToDate: false,
                            tabsUpToDate: [
                                !project.result.dominanceCones,
                                !project.result.unions,
                                !project.result.rules,
                                !project.result.classification,
                                !project.result.crossValidation,
                            ]
                        },
                        ...projects.slice(index + 1)
                    ]
                };
            } else {
                return { projects: projects };
            }
        });
    };

    onTabChanges = (project) => {
        this.setState(({projects}) => {
            if (projects.length) {
                let index;

                for (let i = 0; i < projects.length; i++) {
                    if (projects[i].result.id === project.result.id) {
                        index = i;
                        break;
                    }
                }

                return {
                    projects: [
                        ...projects.slice(0, index),
                        {
                            ...projects[index],
                            ...project
                        },
                        ...projects.slice(index + 1)
                    ],
                };
            } else {
                return { projects: projects };
            }
        });
    };

    onBodyChange = (name) => {
        this.setState(({currentProject}) => ({
            body: name,
            currentProject: name !== "Project" ? -1 : currentProject,
        }));
    };

    onCurrentProjectChange = (index) => {
        this.setState({
            body: "Project",
            currentProject: index,
        });
    };

    onColorsChange = () => {
        this.setState(prevState => ({
            darkTheme: !prevState.darkTheme
        }))
    };

    onDialogOpen = (dialogName) => {
        this.setState(({open}) => ({
            open: {...open, [dialogName]: true}
        }));
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== "clickaway") {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    onFilesAccepted = (name, files, csvSpecs) => {
        if (!this.isNameUnique(name)) {
            this.setState({
                alertProps: {
                    message: "Project name already exists :(",
                    open: true,
                    severity: "warning"
                }
            });
        } else {
            this.setState({
                loading: true,
                loadingTitle: "Creating project"
            }, () => {
                let data = new FormData();

                data.append("name", name);
                files.map(file => data.append(file.type, file.file));

                if (csvSpecs && Object.keys(csvSpecs).length) {
                    Object.keys(csvSpecs).map(key => data.append(key, csvSpecs[key]));
                }

                fetchProjects(
                    "POST", data
                ).then(result => {
                    if (result) {
                        this.setState(({projects}) => ({
                            body: "Project",
                            currentProject: projects.length,
                            projects: [...projects, new Project(result)],
                            alertProps: {
                                message: `${result.name} has been created!`,
                                open: true,
                                severity: "success"
                            }
                        }));
                    }
                }).catch(error => {
                    this.setState({ alertProps: error });
                }).finally(() => {
                    this.setState({ loading: false });
                });
            });
        }
    };

    onSettingsDialogClose = (newSettings) => {
        if (newSettings && Object.keys(newSettings).length) {
            this.setState(({currentProject, projects, open}) => ({
                projects: [
                    ...projects.slice(0, currentProject),
                    {...projects[currentProject], settings: newSettings},
                    ...projects.slice(currentProject + 1)
                ],
                open: {...open, settingsDialog: false}
            }));
        } else {
            this.setState(prevState => ({
                open: {...prevState.open, settingsDialog: false}
            }));
        }
    };

    onDeleteDialogClose = (action) => {
        const { currentProject, projects } = this.state;

        if (action && currentProject !== -1) {
            this.setState({
                loading: true,
                loadingTitle: "Deleting project"
            }, () => {

                fetchProject(
                    projects[currentProject].result.id, "DELETE", null
                ).then(() => {
                    const removedProject = projects[currentProject].result.name;

                    this.setState(({projects, currentProject}) => ({
                        body: "Home",
                        currentProject: -1,
                        projects: [
                            ...projects.slice(0, currentProject),
                            ...projects.slice(currentProject + 1)
                        ],
                        alertProps: {
                            message: `${removedProject} has been successfully deleted!`,
                            open: true,
                            severity: "success"
                        }
                    }));
                }).catch(error => {
                    this.setState({ alertProps: error });
                }).finally(() => {
                    this.setState({ loading: false });
                });
            });
        }

        this.setState(({open}) => ({
            open: {...open, deleteDialog: false}
        }));
    };

    onRenameDialogClose = (name) => {
        if (name) {
            if (this.isNameUnique(name)) {
                const { currentProject, projects } = this.state;

                this.setState({
                    loading: true,
                    loadingTitle: "Modifying project name"
                }, () => {
                    let data = new FormData();
                    data.append("name", name);

                    fetchProject(
                        projects[currentProject].result.id, "PATCH", data
                    ).then(result => {
                        if (result) {
                            this.setState(({currentProject, projects}) => ({
                                projects: [
                                    ...projects.slice(0, currentProject),
                                    {...projects[currentProject], result: result},
                                    ...projects.slice(currentProject + 1)
                                ],
                                alertProps: {
                                    message: "Project name changed successfully!",
                                    open: true,
                                    severity: "success"
                                },
                            }));
                        }
                    }).catch(error => {
                        this.setState({ alertProps: error });
                    }).finally(() => {
                        this.setState({ loading: false });
                    });
                });
            } else {
                this.setState({
                    alertProps: {
                        message: "Project name already exists!",
                        open: true,
                        severity: 'warning'
                    }
                });
                return;
            }
        }

        this.setState(({open}) => ({
            open: {...open, renameDialog: false}
        }));
    };

    isNameUnique = (name) => {
        const { currentProject, open: { renameDialog }, projects } = this.state;

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].result.name === name) {
                return renameDialog && currentProject === i;
            }
        }
        return true;
    };

    render() {
        const {currentProject, projects, open, alertProps} = this.state;
        const {renameDialog, deleteDialog, settingsDialog} = open;
        const showSnackbarNormally = !renameDialog || !deleteDialog || !settingsDialog;

        return (
            <MuiThemeProvider theme={this.state.darkTheme ? DarkTheme : LightTheme}>
                <CssBaseline />
                <Header
                    onBodyChange={this.onBodyChange}
                    onColorsChange={this.onColorsChange}
                >
                    <ProjectMenu
                        currentProject={currentProject + 1}
                        onProjectClick={this.onCurrentProjectChange}
                        onDialogOpen={this.onDialogOpen}
                        projects={["Select your project", ...projects]}
                    />
                </Header>
                {
                    {
                        "Help": <Help />,
                        "Home": <Home />,
                        "Import": <Import onFilesAccepted={this.onFilesAccepted} />,
                        "Project":
                            <ProjectTabs
                                project={projects[currentProject]}
                                onDataChange={this.onDataChanges}
                                onTabChange={this.onTabChanges}
                            />,
                    }[this.state.body]
                }
                <RenameProjectDialog
                    currentName={currentProject >= 0 ?
                        projects[currentProject].result.name : ""
                    }
                    open={renameDialog}
                    onClose={this.onRenameDialogClose}
                >
                    {renameDialog && <RuleWorkAlert {...alertProps} onClose={this.onSnackbarClose} />}
                </RenameProjectDialog>
                <SettingsProjectDialog
                    attributes={currentProject >= 0 ?
                        projects[currentProject].result.informationTable.attributes : null
                    }
                    open={settingsDialog}
                    onClose={this.onSettingsDialogClose}
                    settings={currentProject >= 0 ?
                        {...projects[currentProject].settings} : null
                    }
                />
                <DeleteProjectDialog
                    currentName={currentProject >= 0 ?
                        projects[currentProject].result.name : ""
                    }
                    open={deleteDialog}
                    onClose={this.onDeleteDialogClose}
                />
                {showSnackbarNormally && <RuleWorkAlert {...alertProps} onClose={this.onSnackbarClose}/>}
                {this.state.loading &&
                    <LoadingDelay>
                        <LoadingSnackbar message={this.state.loadingTitle} open={this.state.loading} />
                    </LoadingDelay>
                }
            </MuiThemeProvider>
        );
    }
}

export default App;
