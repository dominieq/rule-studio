import React, {Component} from 'react';
import Home from './Home/Home';
import Import from './Import/Import';
import Help from './Help/Help';
import ProjectTabs from "./Project/ProjectTabs";

class Body extends Component {

    render() {
        switch (this.props.display) {
            case "Help":
                return <Help />;
            case "Import":
                return <Import />;
            case "Project":
                return <ProjectTabs />;
            default:
                return <Home />;
        }
    }
}

export default Body;
