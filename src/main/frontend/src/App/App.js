import React, {Component, Fragment} from 'react';
import Header from "../Header/Header";
import ProjectMenu from "../Header/ProjectMenu";
import Help from '../Body/Help/Help';
import Home from "../Body/Home/Home";
import Import from "../Body/Import/Import";
import ProjectTabs from "../Body/Project/ProjectTabs";
import Project from "../RuleWorkComponents/API/Project";
import RuleWorkSnackbar from "../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import DeleteProjectDialog from "./Dialogs/DeleteProjectDialog";
import RenameProjectDialog from "./Dialogs/RenameProjectDialog";
import SettingsProjectDialog from "./Dialogs/SettingsProjectDialog";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            body: "Home",
            currentProject: -1,
            projects: [],
            defaultColours: true,
            open: {
                settingsDialog: false,
                renameDialog: false,
                deleteDialog: false,
            },
            snackbarProps: undefined,
        };
    }

    componentDidMount() {
        fetch("http://localhost:8080/projects", {
            method: 'GET',
        }).then(response => {
            return response.json();
        }).then(result => {
            let projects = [];
            if (!result.isEmpty) {
                for (let i = 0; i < result.length; i++) {
                    projects = [...projects, new Project(result[i])]
                }
            }
            this.setState({
                projects: projects,
            })
        }).catch(error => {
            this.setState({
                snackbarProps: {
                    open: true,
                    variant: "error",
                    message: "Server doesn't respond. Couldn't load files",
                },
            }, () => {
                console.log(error);
            });
        });
    };

    onDataChanges = (project) => {
        this.setState(({currentProject, projects}) => ({
            projects: [
                ...projects.slice(0, currentProject),
                {
                    ...projects[currentProject],
                    ...project,
                    dataUpToDate: false,
                    tabsUpToDate: Array(5).fill(false)
                },
                ...projects.slice(currentProject + 1)
            ],
        }));
    };

    onTabChanges = (project, tabValue, updated) => {
        this.setState(({currentProject, projects}) => ({
            projects: [
                ...projects.slice(0, currentProject),
                {
                    ...projects[currentProject],
                    ...project,
                    dataUpToDate: updated,
                    tabsUpToDate: [
                        ...projects[currentProject].tabsUpToDate.slice(0, tabValue),
                        updated,
                        ...projects[currentProject].tabsUpToDate.slice(tabValue + 1)
                    ]
                },
                ...projects.slice(currentProject + 1)
            ],
        }));
    };

    onBodyChange = (name) => {
        this.setState({
            body: name
        });
    };

    onCurrentProjectChange = (index) => {
        this.setState({
            body: "Project",
            currentProject: index,
        });
    };

    onColorsChange = () => {
        this.setState(prevState => ({
            defaultColours: !prevState.defaultColours
        }))
    };

    onProjectSettings = () => {
        this.setState(({open}) =>({
            open: {...open, settingsDialog: true}
        }));
    };

    onProjectRename = () => {
        this.setState(({open}) => ({
            open: {...open, renameDialog: true}
        }));
    };

    onProjectDelete = () => {
        this.setState(({open}) => ({
            open: {...open, deleteDialog: true}
        }));
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== "clickaway") {
            this.setState({snackbarProps: undefined});
        }
    };

    onFilesAccepted = (name, files) => {
        if (!this.isNameUnique(name)) {
            this.setState({
                snackbarProps: {
                    open: true,
                    message: "Project name already exists",
                    variant: "warning"
                }
            });
            return
        }

        let data = new FormData();
        data.append("name", name);
        for (let i = 0; i < files.length; i++) {
            data.append(files[i].type, files[i].file);
        }

        fetch("http://localhost:8080/projects", {
            method: 'POST',
            body: data,
        }).then(response => {
            return response.json();
        }).then(result => {
            const project = new Project(result);

            let newProjects = this.state.projects.slice(0);
            newProjects = [...newProjects, project];

            this.setState({
                body: "Project",
                currentProject: newProjects.indexOf(project),
                projects: newProjects,
                snackbarProps: {
                    open: true,
                    variant: "success",
                    message: `${result.name} has been created!`,
                },
            });
        }).catch(error => {
            console.log(error);
        })
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
        const currentProject = this.state.currentProject;
        if (action && currentProject !== -1) {
            let projects = this.state.projects.slice(0);
            const project = {...projects[currentProject]};

            fetch(`http://localhost:8080/projects/${project.result.id}`, {
                method: 'DELETE',
            }).then(response => {
                return response.toString();
            }).then(() => {
                const removedProject = projects.splice(currentProject, 1);

                this.setState({
                    body: "Home",
                    currentProject: -1,
                    projects: projects,
                    snackbarProps: {
                        open: true,
                        variant: "success",
                        message: `${removedProject[0].result.name} has been successfully deleted!`,
                    },
                    dataUpToDate: true,
                    tabsUpToDate: Array(5).fill(true),
                });
            }).catch(error => {
                console.log(error);
            });
        }

        let open = this.state.open;
        open.deleteDialog = false;
        this.setState({open: open});
    };

    onRenameDialogClose = (name) => {
        if (name) {
            let msg = "";
            if (this.isNameUnique(name)) {
                const currentProject = this.state.currentProject;
                const projects = this.state.projects.slice(0);

                let data = new FormData();
                data.append("name", name);

                fetch(`http://localhost:8080/projects/${projects[currentProject].result.id}`, {
                    method: "PATCH",
                    body: data,
                }).then(response => {
                    if (response.status === 200) {
                        response.json().then(result => {
                            msg = "Project name changed successfully!";
                            this.setState(({currentProject, projects, open}) => ({
                                projects: [
                                    ...projects.slice(0, currentProject),
                                    {...projects[currentProject], result: result},
                                    ...projects.slice(currentProject + 1)
                                ],
                                open: {...open, renameDialog: false},
                                snackbarProps: {open: true, message: msg, variant: "success"},
                            }));
                        }).catch(error => {
                            console.log(error);
                            this.setState(({open}) => ({open: {...open, renameDialog: false}}));
                        })
                    } else {
                        response.json().then(result => {
                            msg = result.status + " Something went wrong. Couldn't change name!";
                            this.setState(({open}) => ({
                                open: {...open, renameDialog: false},
                                snackbarProps: {open: true, message: msg, variant: "error"}
                            }));
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    this.setState(({open}) => ({open: {...open, renameDialog: false}}));
                });
            } else {
                msg = "Project name already exists!";
                this.setState({
                    snackbarProps: {open: true, message: msg, variant: 'warning'}
                });
            }
        }
    };

    isNameUnique = (name) => {
        const projects = this.state.projects.slice(0);
        const renameDialog = this.state.open.renameDialog;
        const currentProject = this.state.currentProject;

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].result.name === name) {
                return renameDialog && currentProject === i;
            }
        }
        return true;
    };

    render() {
        const {currentProject, projects, open, snackbarProps} = this.state;
        const {renameDialog, deleteDialog, settingsDialog} = open;
        const showSnackbarNormally = !renameDialog || !deleteDialog || !settingsDialog;

        return (
            <Fragment>
                <Header
                    onBodyChange={this.onBodyChange}
                    onColorsChange={this.onColorsChange}
                >
                    <ProjectMenu
                        currentProject={currentProject + 1}
                        onProjectClick={this.onCurrentProjectChange}
                        onProjectDelete={this.onProjectDelete}
                        onProjectRename={this.onProjectRename}
                        onProjectSettings={this.onProjectSettings}
                        projects={["Select your projects", ...projects]}
                    />
                </Header>
                {
                    {
                        "Help": <Help />,
                        "Home": <Home />,
                        "Import":
                            <Import
                                onFilesAccepted={(name, files) => this.onFilesAccepted(name, files)}
                            />,
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
                    {renameDialog && <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose} />}
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
                {showSnackbarNormally ?
                    <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose}/> : null
                }
            </Fragment>
        );
    }
}

export default App;
