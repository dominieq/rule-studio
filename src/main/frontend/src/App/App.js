import React from 'react';
import Header from "../Header/Header";
import './App.css';
import logo from "./resources/images/logo_transparent.png";
import names from "./resources/demo/ProjectMenuNames";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentProject: 0,
            projects: names,
        };
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
                    selectProject={(i) => this.selectProject(i)}
                />
                <div className={"App-body"}>
                    <img src={logo} className={"App-logo"} alt={"logo"} />
                </div>
            </div>
        );
    }
}

export default App;
