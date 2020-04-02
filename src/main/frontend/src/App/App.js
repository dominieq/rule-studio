import React, {Component} from 'react';
import Header from "../Header/Header";
import ProjectMenu from "../Header/ProjectMenu";
import Help from '../Body/Help/Help';
import Home from "../Body/Home/Home";
import Import from "../Body/Import/Import";
import ProjectTabs from "../Body/Project/ProjectTabs";
import Project from "../RuleWorkComponents/API/Project";
import LoadingDelay from "../RuleWorkComponents/Feedback/LoadingDelay";
import LoadingSnackbar from "../RuleWorkComponents/Feedback/LoadingSnackbar";
import RuleWorkAlert from "../RuleWorkComponents/Feedback/RuleWorkAlert";
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
            let msg = "";
            fetch("http://localhost:8080/projects", {
                method: 'GET',
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (!result.isEmpty) {
                            this.setState(({projects}) => ({
                                projects: [
                                    ...projects,
                                    ...result.map(item => new Project(item))
                                ]
                            }));
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    msg = "Something went wrong! Couldn't load projects :(";
                    this.handleNegativeResponse(response, msg);
                }
            }).catch(error => {
                console.log(error);
                msg = "Server error! Couldn't load projects :(";
                this.setState({
                    alertProps: {message: msg, open: true, severity: "error"}
                });
            }).finally(() => {
                this.setState({loading: false});
            });
        });
    };

    onDataChanges = (project) => {
        let tabsUpToDate = [
            !project.result.dominanceCones,
            !project.result.unionsWithSingleLimitingDecision,
            !project.result.ruleSetWithComputableCharacteristics || project.externalRules,
            !project.result.classification || project.externalRules,
            !project.result.crossValidation || project.externalRules,
        ];
        this.setState(({currentProject, projects}) => ({
            projects: [
                ...projects.slice(0, currentProject),
                {
                    ...projects[currentProject],
                    ...project,
                    dataUpToDate: false,
                    tabsUpToDate: tabsUpToDate
                },
                ...projects.slice(currentProject + 1)
            ],
        }));
    };

    onTabChanges = (project, dataUpToDate, tabsUpToDate) => {
        this.setState(({currentProject, projects}) => ({
            projects: [
                ...projects.slice(0, currentProject),
                {
                    ...projects[currentProject],
                    ...project,
                    dataUpToDate: dataUpToDate,
                    tabsUpToDate: tabsUpToDate
                },
                ...projects.slice(currentProject + 1)
            ],
        }));
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

    onFilesAccepted = (name, files) => {
        let msg = "";
        if (!this.isNameUnique(name)) {
            msg = "Project name already exists :(";
            this.setState({
                alertProps: {open: true, message: msg, severity: "warning"}
            });
        } else {
            this.setState({
                loading: true,
                loadingTitle: "Creating project"
            }, () => {
                let data = new FormData();
                data.append("name", name);
                for (let i = 0; i < files.length; i++) {
                    data.append(files[i].type, files[i].file);
                }

                fetch("http://localhost:8080/projects", {
                    method: 'POST',
                    body: data,
                }).then(response => {
                    if (response.status === 200) {
                        response.json().then(result => {
                            msg = `${result.name} has been created!`;
                            this.setState(({projects}) => ({
                                body: "Project",
                                currentProject: projects.length,
                                projects: [...projects, new Project(result)],
                                alertProps: {open: true, message: msg, severity: "success"}
                            }));
                        }).catch(error => {
                            console.log(error);
                        });
                    } else {
                        msg = "Something went wrong! Couldn't create project from given data :(";
                        this.handleNegativeResponse(response, msg);
                    }
                }).catch(error => {
                    console.log(error);
                    msg = "Server error! Couldn't create project from given data :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"}
                    });
                }).finally(() => {
                    this.setState({loading: false});
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
        const currentProject = this.state.currentProject;
        if (action && currentProject !== -1) {
            this.setState({
                loading: true,
                loadingTitle: "Deleting project"
            }, () => {
                const projects = this.state.projects.slice(0);

                let msg = "";
                fetch(`http://localhost:8080/projects/${projects[currentProject].result.id}`, {
                    method: 'DELETE',
                }).then(response => {
                    const removedProject = this.state.projects[currentProject].result.name;
                    if (response.status === 204) {
                        msg = `${removedProject} has been successfully deleted!`;

                        this.setState(({projects, currentProject}) => ({
                            body: "Home",
                            currentProject: -1,
                            projects: [
                                ...projects.slice(0, currentProject),
                                ...projects.slice(currentProject + 1)
                            ],
                            alertProps: {open: true, message: msg, severity: "success"}
                        }));
                    } else {
                        msg = `Couldn't delete project ${removedProject} :(`;
                        this.setState({
                            alertProps: {message: msg, open: true,  severity: "error"}
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    msg = "Server error! Couldn't delete project :(";
                    this.setState({
                        alertProps: {message: msg, open: true,  severity: "error"}
                    });
                }).finally(() => {
                    this.setState({loading: false});
                });
            });
        }
        this.setState(({open}) => ({open: {...open, deleteDialog: false}}));
    };

    onRenameDialogClose = (name) => {
        if (name) {
            let msg = "";
            if (this.isNameUnique(name)) {
                this.setState({
                    loading: true,
                    loadingTitle: "Modifying project name"
                }, () => {
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
                                this.setState(({currentProject, projects}) => ({
                                    projects: [
                                        ...projects.slice(0, currentProject),
                                        {...projects[currentProject], result: result},
                                        ...projects.slice(currentProject + 1)
                                    ],
                                    alertProps: {message: msg, open: true, severity: "success"},
                                }));
                            }).catch(error => {
                                console.log(error);
                            })
                        } else {
                            msg = "Something went wrong! Couldn't change name :(";
                            this.handleNegativeResponse(response, msg);
                        }
                    }).catch(error => {
                        console.log(error);
                        msg = "Serve error! Couldn't change name :(";
                        this.setState({
                            alertProps: {message: msg, open: true, severity: "error"}
                        })
                    }).finally(() => {
                        this.setState({loading: false});
                    });
                });
            } else {
                msg = "Project name already exists!";
                this.setState({
                    alertProps: {message: msg, open: true, severity: 'warning'}
                });
                return;
            }
        }
        this.setState(({open}) => ({open: {...open, renameDialog: false}}))
    };

    handleNegativeResponse = (response, msg) => {
        let title = "";
        response.json().then(result => {
            title = "ERROR " + result.status + " " + result.message;
            this.setState({
                alertProps: {message: msg, open: true, title: title, severity: "error"}
            });
        }).catch(() => {
            title = "ERROR " + response.status;
            this.setState({
                alertProps: {message: msg, open: true, title: title, severity: "error"}
            });
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
