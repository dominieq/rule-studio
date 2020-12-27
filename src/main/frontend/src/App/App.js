import React, {Component} from 'react';
import { exportProject, fetchProject, fetchProjects, importProject } from "../Utils/utilFunctions/fetchFunctions";
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
import DeleteProjectDialog from "../Utils/Dialogs/DeleteProjectDialog";
import ImportProjectDialog from "../Utils/Dialogs/ImportProjectDialog";
import RenameProjectDialog from "../Utils/Dialogs/RenameProjectDialog";
import SettingsProjectDialog from "../Utils/Dialogs/SettingsProjectDialog";
import { DarkTheme, LightTheme } from "../Utils/Themes/Themes";
import CssBaseline from "@material-ui/core/CssBaseline";
import {MuiThemeProvider} from "@material-ui/core/styles";
import { Switch, Route } from 'react-router-dom';
import { tabNames } from "../Utils/Constants/TabsNamesInPath";

/**
 * The main component that contains all other elements.
 * Provides two themes: dark and light.
 *
 * @class
 */
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            loadingTitle: "",
            deleting: false,
            body: "Home",
            currentProject: -1,
            projects: [],
            objectGlobalName: null,
            darkTheme: true,
            serverBase: "http://localhost:8080",
            open: {
                deleteDialog: false,
                importDialog: false,
                renameDialog: false,
                settingsDialog: false
            },
            alertProps: undefined
        };

        this.appBarRef = React.createRef();
        this.existsPath = "";
    }

    /**
     * A component's lifecycle method. Fired once when component was mounted.
     * <br>
     * <br>
     * Makes an API call on projects to receive the latest list of all projects.
     * Then, updates states and makes necessary changes in display.
     *
     * @function
     * @memberOf App
     */
    componentDidMount() {
        const base = window.location.origin.toString();

        this.setState({
            loading: true,
            loadingTitle: "Loading projects",
        }, () => {
            fetchProjects(
                "GET", null, base
            ).then(result => {
                if (Array.isArray(result)) {
                    this.setState({
                        projects: result.map(item => new Project(item.id, item.name))
                    }, () => {this.checkIfProjectInURLExists()});
                } else {
                    this.setState({
                        alertProps: {
                            message: "Server isn't responding :(",
                            open: true,
                            severity: "error"
                        }
                    });
                }
            }).catch(
                this.onSnackbarOpen
            ).finally(() => {
                this.setState({
                    loading: false,
                    serverBase: base
                });
            });
        });
        
        this.props.history.listen((location, action) => {
            if (action === "POP") {
                if (location.state && location.state.bodyName) {
                    if (location.state.bodyName === "Project") {
                        if (location.state.projectIndex >= 0 && location.state.projectIndex < this.state.projects.length) {
                            this.existsPath = `${this.state.projects[location.state.projectIndex].id}`;

                            this.setState({
                                body: location.state.bodyName,
                                currentProject: location.state.projectIndex
                            });
                        } else {
                            this.setState({
                                body: "Import",
                                currentProject: -1
                            });

                            this.props.history.replace({
                                pathname: "/newProject",
                                state: { bodyName: "Import" }
                            });
                        }
                    } else {
                        this.setState({
                            body: location.state.bodyName,
                            currentProject: -1
                        });
                    }
                } else if (location.state) {
                    let i;

                    for (i = 0; i < this.state.projects.length; i++) {
                        if (this.state.projects[i].id === location.state.projectId) {
                            break;
                        }
                    }

                    if (i < this.state.projects.length) {
                        this.existsPath = `${location.state.projectId}`;

                        this.setState({
                            body: "Project",
                            currentProject: i
                        });
                    } else {
                        this.setState({
                            body: "Import",
                            currentProject: -1
                        });

                        this.props.history.replace({
                            pathname: "/newProject",
                            state: { bodyName: "Import" }
                        });
                    }
                }
            }
          });
    };

    /**
     * Method is forwarded to the {@link ProjectTabs} and further to all tabs except {@link Data}.
     * Saves changes from provided project in the {@link App}'s state and updates index options.
     *
     * @function
     * @memberOf App
     * @param {Object} project - Project with unsaved changes.
     */
    updateProject = (project) => {
        this.setState(({projects}) => {
            if (projects.length > 0) {
                let index = -1;

                for (let i = 0; i < projects.length; i++) {
                    if (projects[i].id === project.id) {
                        index = i;
                        break;
                    }
                }

                if (index === -1) {
                    return { projects: projects };
                }

                return {
                    projects: [
                        ...projects.slice(0, index),
                        {
                            ...projects[index],
                            ...project
                        },
                        ...projects.slice(index + 1)
                    ]
                };
            } else {
                return { projects: projects };
            }
        });
    };

    onBodyChange = (name) => {
        this.setState(({currentProject}) => ({
            body: name,
            currentProject: name !== "Project" ? -1 : currentProject
        }));
        
        switch (name) {
            case "Help":
                this.props.history.push({
                    pathname: "/help",
                    state: { bodyName: name }
                });
                break;
            case "Import":
                this.props.history.push({
                    pathname: "/newProject",
                    state: { bodyName: name }
                });
                break;
            default: 
                this.props.history.push({
                    pathname: "/home",
                    state: { bodyName: "Home" }
                });
                break;
        }
    };

    onCurrentProjectChange = (index, tabName) => {
        const { projects } = this.state;

        if (tabName !== "" && tabNames.includes(tabName)) {
            this.props.history.push({
                pathname: `/${projects[index].id}/${tabName}`,
                state: { bodyName: "Project", projectIndex: index }
            });
        } else { 
            this.props.history.push({
                pathname: `/${projects[index].id}/${tabNames[0]}`,
                state: { bodyName: "Project", projectIndex: index }
            });
        }

        this.existsPath = `${projects[index].id}`;
      
        this.setState({
            body: "Project",
            currentProject: index
        });
    };

    onColorsChange = () => {
        this.setState(prevState => ({
            darkTheme: !prevState.darkTheme
        }))
    };

    onToggleDialog = (dialogName) => {
        this.setState(({open}) => ({
            open: {...open, [dialogName]: !open[dialogName]}
        }));
    };

    onSnackbarOpen = (exception) => {
        if (!(exception.hasOwnProperty("type") && exception.type === "AlertError")) {
            console.error(exception);
            return;
        }

        this.setState({
            alertProps: exception
        });
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== "clickaway") {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    /**
     * Method forwarded to the {@link Import} section.
     * Fired when user accepts their selection and requests to create project.
     * <br>
     * <br>
     * Method checks if project name is already used.
     * Then, makes an API call on projects to create new project.
     * Eventually, adds new project to {@link App}'s state and changes section to "Project".
     *
     * @function
     * @memberOf App
     * @param {string} name - The name of the new project.
     * @param {Object[]} files - The list of files that are used to build new project.
     * @param {Object} [csvSpecs] - If a file containing data was in CSV format, this object contains CSV settings.
     */
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
                const method = "POST";
                const data = new FormData();

                data.append("name", name);
                files.map(file => data.append(file.type, file.file));

                if (csvSpecs != null && Object.keys(csvSpecs).length) {
                    Object.keys(csvSpecs).map(key => data.append(key, csvSpecs[key]));
                }

                fetchProjects(
                    method, data, serverBase
                ).then(result => {
                    if (result != null && result.hasOwnProperty("id")
                        && result.hasOwnProperty("name")) {

                        this.props.history.push({
                            pathname: `/${result.id}`,
                            state: { bodyName: "Project", projectIndex: this.state.projects.length }
                        });
                        this.existsPath = `${result.id}`;
                      
                        this.setState(({projects}) => ({
                            body: "Project",
                            currentProject: projects.length,
                            projects: [...projects, new Project(result.id, result.name)],
                            alertProps: {
                                message: `${result.name} has been created!`,
                                open: true,
                                severity: "success"
                            }
                        }));
                    }
                }).catch(
                    this.onSnackbarOpen
                ).finally(() => {
                    this.setState({ loading: false });
                });
            });
        }
    };

    onSaveProject = () => {
        const { serverBase, currentProject, projects } = this.state;
        const pathParams = { projectId: projects[currentProject].id };

        if (currentProject >= 0) {
            this.setState({
                loading: true,
                loadingTitle: "Compressing project"
            }, () => {
                exportProject(pathParams, serverBase)
                    .catch(this.onSnackbarOpen)
                    .finally(() => {
                        this.setState({ loading: false });
                    });
            });
        }
    };

    onUploadProject = (file) => {
        if (file != null) {
            const { serverBase } = this.state;

            this.setState({
                loading: true,
                loadingTitle: "Importing project"
            }, () => {
                const body = new FormData();
                body.append("importFile", file);

                importProject(
                    body, serverBase
                ).then(result => {
                    if (result != null && result.hasOwnProperty("id")
                        && result.hasOwnProperty("name")) {
                      
                        this.props.history.push({
                            pathname: `/${result.id}`,
                            state: { bodyName: "Project", projectIndex: this.state.projects.length }
                        });
                        this.existsPath = `${result.id}`;

                        this.setState(({projects}) => ({
                            body: "Project",
                            currentProject: projects.length,
                            projects: [...projects, new Project(result.id, result.name)],
                            alertProps: {
                                message: `${result.name} has been imported!`,
                                open: true,
                                severity: "success"
                            }
                        }));
                    }
                }).catch(
                    this.onSnackbarOpen
                ).finally(() => {
                    this.setState({ loading: false, loadingTitle: "" });
                });
            });
        }

        this.setState(({open}) => ({
            open: { ...open, importDialog: false }
        }));
    }
    
    /**
     * Callback fired when {@link SettingsProjectDialog} changed global visible object name.
     *
     * @function
     * @memberOf App
     */
    onObjectNamesChange = (objectVisibleName) => {
        this.setState({
            objectGlobalName: objectVisibleName
        });
    };

    /**
     * Callback fired when {@link DeleteProjectDialog} requests to be closed.
     * If user confirmed the deletion, method proceeds to delete current project.
     * Then updates {@link App}'s state and closes dialog.
     *
     * @function
     * @memberOf App
     * @param {boolean} action - If <code>true</code> the method will proceed to delete current project.
     */
    onDeleteDialogClose = (action) => {
        const { currentProject, projects, serverBase } = this.state;

        if (action && currentProject !== -1) {
            this.setState({
                loading: true,
                loadingTitle: "Deleting project",
                deleting: true
            }, () => {
                const pathParams = { projectId: projects[currentProject].id };
                const method = "DELETE";

                fetchProject(
                    pathParams, method, null, serverBase
                ).then(() => {
                    this.props.history.replace({
                        pathname: `/newProject`,
                        state: { bodyName: "Import" }
                    });
                    const removedProject = projects[currentProject].name;

                    this.setState(({projects, currentProject}) => ({
                        body: "Import",
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
                }).catch(
                    this.onSnackbarOpen
                ).finally(() => {
                    this.setState({ loading: false, deleting: false });
                });
            });
        }

        this.setState(({open}) => ({
            open: {...open, deleteDialog: false}
        }));
    };

    /**
     * Callback fired when {@link RenameProjectDialog} requests to be closed.
     * If user provided new name and when the new name is unique, method proceeds to update project's name.
     * Then updates {@link App}'s state and closes dialog.
     *
     * @function
     * @memberOf App
     * @param {string} name - The new name for current project.
     */
    onRenameDialogClose = (name) => {
        if (name) {
            if (this.isNameUnique(name)) {
                const { currentProject, projects, serverBase } = this.state;

                this.setState({
                    loading: true,
                    loadingTitle: "Modifying project name"
                }, () => {
                    const pathParams = { projectId: projects[currentProject].id };
                    const method = "PATCH"
                    const body = new FormData();
                    body.append("name", name);

                    fetchProject(
                        pathParams, method, body, serverBase
                    ).then(result => {
                        if (result) {
                            this.setState(({currentProject, projects}) => ({
                                projects: [
                                    ...projects.slice(0, currentProject),
                                    { ...projects[currentProject], name: result.name },
                                    ...projects.slice(currentProject + 1)
                                ],
                                alertProps: {
                                    message: "Project name changed successfully!",
                                    open: true,
                                    severity: "success"
                                },
                            }));
                        }
                    }).catch(
                        this.onSnackbarOpen
                    ).finally(() => {
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

    /**
     * Checks whether a provided name is unique among other project's names.
     *
     * @function
     * @memberOf App
     * @param {string} name - Project's name.
     * @returns {boolean} - If <code>true</code> the provided name is unique.
     */
    isNameUnique = (name) => {
        const { currentProject, open: { renameDialog }, projects } = this.state;

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].name === name) {
                return renameDialog && currentProject === i;
            }
        }
        return true;
    };

    checkIfProjectInURLExists = () => {
        const { projects } = this.state;
        const url = window.location.href.toString();
        const urlSplitted = url.split('/');
        let projectFound = false; 

        if (urlSplitted.length >= 4) {
            const projectId = url.split('/')[3];

            for (let i = 0; i < projects.length; i++) {
                if (projects[i].id === projectId) {
                    projectFound = true;
                    this.existsPath = `${projects[i].id}`;

                    if (urlSplitted.length >= 5) {
                        const tabName = url.split('/')[4];
                        const { projects } = this.state;

                        if (tabName !== "" && tabNames.includes(tabName)) {
                            this.props.history.replace({
                                pathname: `/${projects[i].id}/${tabName}`,
                                state: { bodyName: "Project", projectIndex: i }
                            });
                        } else { 
                            this.props.history.replace({
                                pathname: `/${projects[i].id}/${tabNames[0]}`,
                                state: { bodyName: "Project", projectIndex: i }
                            });
                        }
                    }
                    else {
                        this.props.history.replace({
                            pathname: `/${projects[i].id}/${tabNames[0]}`,
                            state: { bodyName: "Project", projectIndex: i }
                        });
                    }

                    this.setState({
                        body: "Project",
                        currentProject: i
                    });
                }
            }
            
            if (!projectFound) {
                switch (projectId) {
                    case "help":
                        this.props.history.replace({
                            pathname: "/help",
                            state: {bodyName: "Help"}
                        });

                        this.setState({
                            body: "Help",
                            currentProject: -1
                        })
                        break;
                    case "newProject":
                        this.props.history.replace({
                            pathname: "/newProject",
                            state: { bodyName: "Import" }
                        });

                        this.setState({
                            body: "Import",
                            currentProject: -1
                        })
                        break;
                    default: 
                        this.props.history.replace({
                            pathname: "/home",
                            state: { bodyName: "Home" }
                        });

                        this.setState({
                            body: "Home",
                            currentProject: -1
                        })
                        break;
                }
            }
        }
    };

    render() {
        const { deleting, currentProject, projects, objectGlobalName, open, serverBase, alertProps } = this.state;
        const { deleteDialog, importDialog, renameDialog, settingsDialog } = open;

        return (
            <MuiThemeProvider theme={this.state.darkTheme ? DarkTheme : LightTheme}>
                <CssBaseline />
                <Header
                    appBarRef={this.appBarRef}
                    onBodyChange={this.onBodyChange}
                    onColorsChange={this.onColorsChange}
                    onImportOpen={() => this.onToggleDialog("importDialog")}
                >
                    <ProjectMenu
                        currentProject={currentProject + 1}
                        onProjectClick={this.onCurrentProjectChange}
                        onDialogOpen={this.onToggleDialog}
                        onSaveProject={this.onSaveProject}
                        onSnackbarOpen={this.onSnackbarOpen}
                        projects={["Select your project", ...projects]}
                        serverBase={serverBase}
                    />
                </Header>
                <Switch>
                {
                    {
                        "Help": <Route
                            path={`/help`}
                            render={() => <Help
                                upperMargin={this.appBarRef.current ? this.appBarRef.current.offsetHeight : undefined}/>
                            }
                        />,
                        "Home": <Route
                            path={`/home`}
                            render={() => <Home
                                goToHelp={() => this.onBodyChange("Help")}
                                goToNewProject={() => this.onBodyChange("Import")}
                                isDarkTheme={this.state.darkTheme}/>
                            }
                        />,
                        "Import": <Route
                            path={`/newProject`}
                            render={() => <Import onFilesAccepted={this.onFilesAccepted}/>}
                        />,
                        "Project": <Route
                            path={`/${this.existsPath}`}
                            render={(routerProps) => <ProjectTabs
                                deleting={deleting}
                                objectGlobalName={objectGlobalName}
                                onSnackbarOpen={this.onSnackbarOpen}
                                project={projects[currentProject]}
                                serverBase={serverBase}
                                updateProject={this.updateProject}
                                {...routerProps}/>
                            }
                        />
                    }[this.state.body]
                }
                </Switch>
                {currentProject >= 0 &&
                    <React.Fragment>
                        <RenameProjectDialog
                            currentName={projects[currentProject].name}
                            open={renameDialog}
                            onClose={this.onRenameDialogClose}
                        />
                        <SettingsProjectDialog
                            onClose={() => this.onToggleDialog("settingsDialog")}
                            onObjectNamesChange={this.onObjectNamesChange}
                            onSnackbarOpen={this.onSnackbarOpen}
                            open={settingsDialog}
                            projectId={projects[currentProject].id}
                            serverBase={serverBase}
                        />
                        <DeleteProjectDialog
                            currentName={projects[currentProject].name}
                            open={deleteDialog}
                            onClose={this.onDeleteDialogClose}
                        />
                    </React.Fragment>
                }
                <ImportProjectDialog onImportProject={this.onUploadProject} open={importDialog} />
                <StyledAlert {...alertProps} onClose={this.onSnackbarClose} />
                {this.state.loading &&
                    <LoadingDelay>
                        <LoadingSnackbar
                            message={this.state.loadingTitle}
                            open={this.state.loading}
                        />
                    </LoadingDelay>
                }
            </MuiThemeProvider>
        );
    }
}

export default App;
