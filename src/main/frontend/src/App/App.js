import React from 'react';
import Header from "../Header/Header";
import Body from "../Body/Body";
import Project from "./Project"
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        const dummyProject = new Project('dummy', 'Select your project', []);

        this.state = {
            display: null,
            currentProject: 1,
            projects: [dummyProject],
        };
    }

    selectHeaderPage(name) {
        this.setState({
            display: name
        });
    }

    selectProject(index) {
        this.setState({
            currentProject: this.state.projects[index]
        })
    }

    render() {
        return (
            <div className="App">
                <Header
                    currentProject={this.state.currentProject}
                    projects={this.state.projects}
                    selectHeaderPage={(n) => this.selectHeaderPage(n)}
                    selectProject={(i) => this.selectProject(i)}
                />
                <Body
                    display={this.state.display}
                />
            </div>
        );
    }
}

export default App;
