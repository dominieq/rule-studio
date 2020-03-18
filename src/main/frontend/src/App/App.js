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
            dataUpToDate: true,
            tabsUpToDate: Array(5).fill(true),
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
        let projects = this.state.projects.slice(0);
        let tabsUpToDate = this.state.tabsUpToDate.slice(0);

        projects[this.state.currentProject] = project;
        for (let i = 0; i < tabsUpToDate.length; i++) {
            tabsUpToDate[i] = false;
        }

        this.setState({
            dataUpToDate: false,
            projects: projects,
            tabsUpToDate: tabsUpToDate,
        });
    };

    onTabChanges = (project, tabValue, updated) => {
        let projects = this.state.projects.slice(0);
        let tabsUpToDate = this.state.tabsUpToDate.slice(0);

        projects[this.state.currentProject] = project;
        tabsUpToDate[tabValue] = updated;

        this.setState({
            dataUpToDate: updated,
            projects: projects,
            tabsUpToDate: tabsUpToDate,
        });
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
        let open = {...this.state.open};
        open.settingsDialog = true;
        this.setState({open: open})
    };

    onProjectRename = () => {
        let open = {...this.state.open};
        open.renameDialog = true;
        this.setState({open: open});
    };

    onProjectDelete = () => {
        let open = {...this.state.open};
        open.deleteDialog = true;
        this.setState({open: open});
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
                const removedProject = projects.splice(projects.indexOf(project), 1);

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
            if (this.isNameUnique(name)) {
                const currentProject = this.state.currentProject;
                let projects = this.state.projects.slice(0);

                let data = new FormData();
                data.append("name", name);

                fetch(`http://localhost:8080/projects/${projects[currentProject].result.id}`, {
                    method: "PATCH",
                    body: data,
                }).then(response => {
                    return response.json();
                }).then(result => {
                    projects[currentProject].result.name = result.name;

                    this.setState({
                        projects: projects,
                        snackbarProps: {
                            open: true,
                            variant: "success",
                            message: "Project name changed successfully!",
                        },
                    });
                }).catch(error => {
                    this.setState({
                        snackbarProps: {
                            open: true,
                            variant: "error",
                            message: "Server error! Couldn't change project name"
                        }
                    }, () => {
                        console.log(error)
                    });
                });
            } else {
                this.setState({
                    snackbarProps: {
                        open: true,
                        variant: 'warning',
                        message: "Project name already exists!"
                    }
                });
                return;
            }
        }
        let open = this.state.open;
        open.renameDialog = false;

        this.setState({
            open: open,
        });
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
                                dataUpToDate={this.state.dataUpToDate}
                                project={projects[currentProject]}
                                onDataChange={this.onDataChanges}
                                onTabChange={this.onTabChanges}
                                tabsUpToDate={this.state.tabsUpToDate}
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
