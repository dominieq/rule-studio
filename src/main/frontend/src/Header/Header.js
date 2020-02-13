import React, {Component} from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import ProjectMenu from "./ProjectMenu";
import "./Header.css";

class Header extends Component {
    constructor(props) {
        super(props);

        this.projectMenu = React.createRef();

        this.changeBody = this.changeBody.bind(this);
        this.changeProject = this.changeProject.bind(this);
    }

    changeBody(name) {
        this.props.setBody(name);
    }

    changeProject(index) {
        this.props.setCurrentProject(index);
    }

    updateHeader(projects, index) {
        this.projectMenu.current.updateNewProject(projects, index);
    }

    render() {
        return (
            <AppBar position={"static"} >
                <Toolbar>
                    <IconButton
                        onClick={() => this.changeBody(null)}>
                        <HomeIcon />
                    </IconButton>
                    <Button
                        onClick={() => this.changeBody("Import")}>
                        Import
                    </Button>
                    <ProjectMenu
                        ref={this.projectMenu}
                        selectBody={(n) => this.changeBody(n)}
                        selectProject={(i) => this.changeProject(i)}
                        selectedProject={this.props.currentProject}
                        projects={this.props.projects}
                    />
                    <Button
                        onClick={() => this.changeBody("Help")}>
                        Help
                    </Button>
                </Toolbar>
            </AppBar>
        )
    }
}

export default Header;