import React, {Component, Fragment} from 'react';
import RenameProjectDialog from "./feedback/RenameProjectDialog";
import Header from "../Header/Header";
import Home from "../Body/Home/Home";
import Import from "../Body/Import/Import";
import ProjectTabs from "../Body/Project/ProjectTabs";
import Help from "../Body/Help/Help";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            body: "Home",
            currentProject: -1,
            projects: [],
            open: false,
        };
    }

    componentDidMount() {
        fetch("http://localhost:8080/projects", {
            method: 'GET',
        }).then(response => {
            return response.json();
        }).then(result => {
            this.setState({
                projects: result,
            })
        }).catch(error => {
            console.log(error);
        })
    }

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

    onFilesAccepted = (name, files) => {
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
            let newProjects = this.state.projects.slice(0);
            newProjects = [...newProjects, result];
            this.setState({
                body: "Project",
                currentProject: newProjects.indexOf(result),
                projects: newProjects,
            });
        }).catch(error => {
            console.log(error);
        })
    };

    onProjectDelete = () => {
        let projects = this.state.projects.slice(0);
        const currentProject = this.state.currentProject;

        if (currentProject === -1) return;

        const project = projects[currentProject];

        fetch(`http://localhost:8080/projects/${project.id}`, {
            method: 'DELETE',
        }).then(response => {
            return response.toString();
        }).then(() => {
            projects.splice(projects.indexOf(project), 1);
            this.setState({
                body: "Home",
                currentProject: -1,
                projects: projects,
        })
        }).catch(error => {
            console.log(error);
        });
    };

    onProjectRename = () => {
        if (this.state.currentProject < 0) return;

        this.setState({
            open: true,
        });
    };

    onRenameDialogClose = (name) => {
        if (name && this.isNameUnique(name)) {
            const currentProject = this.state.currentProject;
            let projects = this.state.projects.slice(0);
            projects[currentProject].name = name;

            this.setState({
                projects: projects,
            });
        }

        this.setState({
            open: false,
        });
    };

    isNameUnique = (name) => {
        const projects = this.state.projects.slice(0);

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].name === name) {
                return false;
            }
        }
        return true;
    };

    render() {
        const {body, currentProject, projects, open} = this.state;

        return (
            <Fragment>
                <Header
                    onButtonClick={(name) => this.onBodyChange(name)}
                    currentProject={currentProject + 1}
                    projects={["Select your projects", ...projects]}
                    onProjectClick={(index) => this.onCurrentProjectChange(index)}
                    onProjectDelete={() => this.onProjectDelete()}
                    onProjectRename={() => this.onProjectRename()}
                />
                {
                    {
                        "Help": <Help />,
                        "Import": <Import onFilesAccepted={(name, files) => this.onFilesAccepted(name, files)} />,
                        "Project": <ProjectTabs />,
                        "Home": <Home />
                    }[body]
                }
                <RenameProjectDialog
                    currentName={currentProject >= 0 ? projects[currentProject].name : ""}
                    open={open}
                    onClose={this.onRenameDialogClose}
                />
            </Fragment>
        );
    }
}

export default App;
