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
import StyledAlert from "../Utils/Feedback/StyledAlert";
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
            indexOptions: [],
            darkTheme: true,
            serverBase: "http://localhost:8080",
            open: {
                settingsDialog: false,
                renameDialog: false,
                deleteDialog: false
            },
            alertProps: undefined
        };

        this.appBarRef = React.createRef();
    }

    componentDidMount() {
        const base = window.location.origin.toString();

        this.setState({
            loading: true,
            loadingTitle: "Loading projects",
        }, () => {
            fetchProjects(
                base, "GET", null
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
                this.setState({
                    loading: false,
                    serverBase: base
                });
            });
        });
    };

    createNewIndexOptions = (attributes) => {
        let indexOptions = ["default"];

        if (attributes) {
            for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].hasOwnProperty("identifierType") && attributes[i].active) {
                    indexOptions = [ ...indexOptions, attributes[i].name ];
                }
                if (attributes[i].hasOwnProperty("type") && attributes[i].type === "description") {
                    indexOptions = [ ...indexOptions, attributes[i].name ];
                }
            }
        }

        return indexOptions;
    };

    updateProject = (project) => {
        this.setState(({projects}) => {
            if (projects.length) {
                let index;

                for (let i = 0; i < projects.length; i++) {
                    if (projects[i].result.id === project.result.id) {
                        index = i;
                        break;
                    }
                }

                const { result: { informationTable: { attributes }}} = project;
                let indexOptions = this.createNewIndexOptions(attributes);

                if (!indexOptions.includes(project.settings.indexOption)) {
                    project.settings.indexOption = "default";
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
                    indexOptions: indexOptions,
                };
            } else {
                return { projects: projects };
            }
        });
    };

    updateIndexOptions = (attributes) => {
        const indexOptions = this.createNewIndexOptions(attributes);

        this.setState(({projects, currentProject}) => {
            if (currentProject >= 0) {
                if (!indexOptions.includes(projects[currentProject].settings.indexOption)) {
                    projects[currentProject].settings.indexOption = "default";
                }
            }

            return {
                projects: [
                    ...projects.slice(0, currentProject),
                    {
                        ...projects[currentProject]
                    },
                    ...projects.slice(currentProject + 1)
                ],
                indexOptions: indexOptions
            };
        });
    };

    onBodyChange = (name) => {
        this.setState(({currentProject}) => ({
            body: name,
            currentProject: name !== "Project" ? -1 : currentProject,
        }));
    };

    onCurrentProjectChange = (index) => {
        const { projects } = this.state;
        const { result: {informationTable: { attributes }}} = projects[index];
        let indexOptions = this.createNewIndexOptions(attributes);

        this.setState({
            body: "Project",
            currentProject: index,
            indexOptions: indexOptions
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

    onSnackbarOpen = (alertProps) => {
        this.setState({
            alertProps: alertProps
        });
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
            const { serverBase } = this.state;

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
                    serverBase,"POST", data
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
        const { currentProject, projects, serverBase } = this.state;

        if (action && currentProject !== -1) {
            this.setState({
                loading: true,
                loadingTitle: "Deleting project"
            }, () => {
                fetchProject(
                    serverBase, projects[currentProject].result.id, "DELETE", null
                ).then(() => {
                    const removedProject = projects[currentProject].result.name;

                    this.setState(({projects, currentProject}) => ({
                        body: "Home",
                        currentProject: -1,
                        projects: [
                            ...projects.slice(0, currentProject),
                            ...projects.slice(currentProject + 1)
                        ],
                        indexOptions: [],
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
                const { currentProject, projects, serverBase } = this.state;

                this.setState({
                    loading: true,
                    loadingTitle: "Modifying project name"
                }, () => {
                    let data = new FormData();
                    data.append("name", name);

                    fetchProject(
                        serverBase, projects[currentProject].result.id, "PATCH", data
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
        const {currentProject, projects, indexOptions, open, serverBase, alertProps} = this.state;
        const {renameDialog, deleteDialog, settingsDialog} = open;
        const showSnackbarNormally = !renameDialog || !deleteDialog || !settingsDialog;

        return (
            <MuiThemeProvider theme={this.state.darkTheme ? DarkTheme : LightTheme}>
                <CssBaseline />
                <Header
                    appBarRef={this.appBarRef}
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
                        "Help":
                            <Help
                                upperMargin={this.appBarRef.current ? this.appBarRef.current.offsetHeight : undefined}
                            />,
                        "Home": <Home isDarkTheme={this.state.darkTheme} />,
                        "Import": <Import onFilesAccepted={this.onFilesAccepted} />,
                        "Project":
                            <ProjectTabs
                                project={projects[currentProject]}
                                serverBase={serverBase}
                                showAlert={this.onSnackbarOpen}
                                updateIndexOptions={this.updateIndexOptions}
                                updateProject={this.updateProject}
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
                    {renameDialog && <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />}
                </RenameProjectDialog>
                <SettingsProjectDialog
                    open={settingsDialog}
                    onClose={this.onSettingsDialogClose}
                    indexOptions={indexOptions}
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
                {showSnackbarNormally && <StyledAlert {...alertProps} onClose={this.onSnackbarClose}/>}
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
