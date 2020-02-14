import React, {Component} from 'react';
import Home from './Home/Home';
import Import from './Import/Import';
import Help from './Help/Help';
import ProjectTabs from "./Project/ProjectTabs";
import Project from "../App/Project";

class Body extends Component {
    constructor(props) {
        super(props);

        this.sendProject = this.sendProject.bind(this);
    }

    sendProject(name, files) {
        // TODO fetch things
        const newProject = new Project(1, name, []);
        this.props.createProject(newProject);
    }

    render() {
        switch (this.props.display) {
            case "Help":
                return <Help />;
            case "Import":
                return <Import sendProject={(n, f) => this.sendProject(n, f)}/>;
            case "Project":
                return <ProjectTabs />;
            default:
                return <Home />;
        }
    }
}

export default Body;
