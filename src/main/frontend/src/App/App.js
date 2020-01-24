import React from 'react';
import Header from "../Header/Header";
import Body from "../Body/Body";
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            display: null,
            currentProject: 0,
            projects: null,
            files: null
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

    uploadFiles(files, setType) {
        this.setState({
            files: files
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
                    uploadFiles={(f, t) => this.uploadFiles(f, t)}
                />
            </div>
        );
    }
}

export default App;
