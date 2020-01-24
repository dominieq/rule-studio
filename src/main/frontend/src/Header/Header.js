import React, {Component} from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import ProjectMenu from "./ProjectMenu";

class Header extends Component {
    constructor(props) {
        super(props);

        this.selectHeaderPage = this.selectHeaderPage.bind(this);
    }

    selectHeaderPage(name) {
        this.props.selectHeaderPage(name);
    }

    render() {
        return (
            <AppBar position={"static"} >
                <Toolbar>
                    <IconButton
                        onClick={() => this.selectHeaderPage(null)}>
                        <HomeIcon />
                    </IconButton>
                    <Button
                        onClick={() => this.selectHeaderPage("Import")}>
                        Import
                    </Button>
                    <ProjectMenu
                        currentProject={this.props.currentProject}
                        projects={this.props.projects}
                    />
                    <Button
                        onClick={() => this.selectHeaderPage("Help")}>
                        Help
                    </Button>
                </Toolbar>
            </AppBar>
        )
    }
}

export default Header;