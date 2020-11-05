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
import DeleteProjectDialog from "./Dialogs/DeleteProjectDialog";
import ImportProjectDialog from "./Dialogs/ImportProjectDialog";
import RenameProjectDialog from "./Dialogs/RenameProjectDialog";
import SettingsProjectDialog from "./Dialogs/SettingsProjectDialog";
import {DarkTheme, LightTheme} from "./Themes/Themes";
import CssBaseline from "@material-ui/core/CssBaseline";
import {MuiThemeProvider} from "@material-ui/core/styles";

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
            body: "Home",
            currentProject: -1,
            projects: [],
            indexOptions: [],
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
                if (error.constructor.name !== "AlertError") {
                    console.error(error);
                } else {
                    this.setState({ alertProps: error });
                }
            }).finally(() => {
                this.setState({
                    loading: false,
                    serverBase: base
                });
            });
        });
    };

    /**
     * Creates a list of index options using provided attributes.
     * Looks for description and identification attributes.
     *
     * @function
     * @memberOf App
     * @param {Object[]} attributes - The attributes property from information table.
     * @returns {string[]} - The list of updated index options.
     */
    createNewIndexOptions = (attributes) => {
        let indexOptions = ["default"];

        if (Array.isArray(attributes) && attributes.length) {
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

    /**
     * Method is forwarded to the {@link ProjectTabs} and further to {@link Data} tab.
     * Creates new index options for provided attributes and updates {@link App}'s state.
     *
     * @function
     * @memberOf App
     * @param {Object[]} attributes - The attributes property from information table.
     */
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
        this.setState(({currentProject, indexOptions}) => ({
            body: name,
            currentProject: name !== "Project" ? -1 : currentProject,
            indexOptions: name !== "Project" ? [] : indexOptions
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
                let data = new FormData();

                data.append("name", name);
                files.map(file => data.append(file.type, file.file));

                if (csvSpecs && Object.keys(csvSpecs).length) {
                    Object.keys(csvSpecs).map(key => data.append(key, csvSpecs[key]));
                }

                fetchProjects(
                    "POST", data, serverBase
                ).then(result => {
                    if (result) {
                        const indexOptions = this.createNewIndexOptions(result.informationTable.attributes);

                        this.setState(({projects}) => ({
                            body: "Project",
                            currentProject: projects.length,
                            projects: [...projects, new Project(result)],
                            indexOptions: indexOptions,
                            alertProps: {
                                message: `${result.name} has been created!`,
                                open: true,
                                severity: "success"
                            }
                        }));
                    }
                }).catch(error => {
                    if (error.constructor.name !== "AlertError") {
                        console.error(error);
                    } else {
                        this.setState({ alertProps: error });
                    }
                }).finally(() => {
                    this.setState({ loading: false });
                });
            });
        }
    };

    onSaveProject = () => {
        const { serverBase, currentProject, projects } = this.state;
        const pathParams = { projectId: projects[currentProject].result.id };

        if (currentProject >= 0) {
            exportProject(pathParams, serverBase).catch(error => {
                if (error.constructor.name !== "AlertError") {
                    console.error(error);
                    return;
                }

                this.setState({ alertProps: error });
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
                    if (result) {
                        const indexOptions = this.createNewIndexOptions(result.informationTable.attributes);

                        this.setState(({projects}) => ({
                            body: "Project",
                            currentProject: projects.length,
                            projects: [...projects, new Project(result)],
                            indexOptions: indexOptions,
                            alertProps: {
                                message: `${result.name} has been imported!`,
                                open: true,
                                severity: "success"
                            }
                        }));
                    }
                }).catch(error => {
                    if (!error.hasOwnProperty("open")) {
                        console.log(error);
                    } else {
                        this.setState({ alertProps: error });
                    }
                }).finally(() => {
                    this.setState({ loading: false, loadingTitle: "" });
                });
            });
        }

        this.setState(({open}) => ({
            open: { ...open, importDialog: false }
        }));
    }
    
    /**
     * Callback fired when {@link SettingsProjectDialog} requests to be closed.
     * Method saves new settings in {@link App}'s state, then closes dialog.
     *
     * @function
     * @memberOf App
     * @param {Object} newSettings - New project settings.
     */
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
                loadingTitle: "Deleting project"
            }, () => {
                const pathParams = { projectId: projects[currentProject].result.id };
                const method = "DELETE";

                fetchProject(
                    pathParams, method, null, serverBase
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
                    if (error.constructor.name !== "AlertError") {
                        console.error(error);
                        return;
                    }

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
                    const pathParams = { projectId: projects[currentProject].result.id };
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
                        if (error.constructor.name !== "AlertError") {
                            console.error(error);
                            return;
                        }

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
            if (projects[i].result.name === name) {
                return renameDialog && currentProject === i;
            }
        }
        return true;
    };

    render() {
        const { currentProject, projects, indexOptions, open, serverBase, alertProps } = this.state;
        const { deleteDialog, importDialog, renameDialog, settingsDialog } = open;

        return (
            <MuiThemeProvider theme={this.state.darkTheme ? DarkTheme : LightTheme}>
                <CssBaseline />
                <Header
                    appBarRef={this.appBarRef}
                    onBodyChange={this.onBodyChange}
                    onColorsChange={this.onColorsChange}
                    onImportOpen={() => this.onDialogOpen("importDialog")}
                >
                    <ProjectMenu
                        currentProject={currentProject + 1}
                        onProjectClick={this.onCurrentProjectChange}
                        onDialogOpen={this.onDialogOpen}
                        onSaveProject={this.onSaveProject}
                        onSnackbarOpen={this.onSnackbarOpen}
                        projects={["Select your project", ...projects]}
                    />
                </Header>
                {
                    {
                        "Help":
                            <Help
                                upperMargin={this.appBarRef.current ? this.appBarRef.current.offsetHeight : undefined}
                            />,
                        "Home":
                            <Home
                                goToHelp={() => this.onBodyChange("Help")}
                                goToNewProject={() => this.onBodyChange("Import")}
                                isDarkTheme={this.state.darkTheme}
                            />,
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
                {currentProject >= 0 &&
                    <React.Fragment>
                        <RenameProjectDialog
                            currentName={projects[currentProject].result.name}
                            open={renameDialog}
                            onClose={this.onRenameDialogClose}
                        />
                        <SettingsProjectDialog
                            indexOptions={indexOptions}
                            open={settingsDialog}
                            onClose={this.onSettingsDialogClose}
                            settings={{ ...projects[currentProject].settings }}
                        />
                        <DeleteProjectDialog
                            currentName={projects[currentProject].result.name}
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
