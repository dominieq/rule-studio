import React from 'react';
import Header from "../Header/Header";
import Body from "../Body/Body";
import Project from "./Project"
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.header = React.createRef();
        const placeholder = new Project(0, 'Select your project', []);

        this.state = {
            body: null,
            currentProject: 0,
            projects: [placeholder],
        };

        this.setBody = this.setBody.bind(this);
        this.setCurrentProject = this.setCurrentProject.bind(this);
        this.createProject = this.createProject.bind(this);
    }

    setBody(name) {
        this.setState({
            body: name
        });
    }

    setCurrentProject(index) {
        this.setState({
            currentProject: index,
        });
    }

    createProject(project) {
        const newProjects = [...this.state.projects, project];

        this.setState({
            body: "Project",
            currentProject: newProjects.indexOf(project),
            projects: newProjects,
        });

        this.header.current.updateHeader(newProjects, newProjects.indexOf(project));
    }

    render() {
        return (
            <div className="App">
                <Header
                    ref={this.header}
                    currentProject={this.state.currentProject}
                    projects={this.state.projects}
                    setBody={(n) => this.setBody(n)}
                    setCurrentProject={(i) => this.setCurrentProject(i)}
                />
                <Body
                    display={this.state.body}
                    createProject={(p) => this.createProject(p)}
                />
            </div>
        );
    }
}

export default App;
