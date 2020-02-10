import React, {Component} from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import ProjectMenu from "./ProjectMenu";
import "./Header.css";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projectLoaded: false,
        };

        this.selectHeaderPage = this.selectHeaderPage.bind(this);
    }

    componentDidMount() {
        if (this.props.projects.isEmpty) {
            this.setState({
                projectLoaded: false,
            });
        } else {
            this.setState({
                projectLoaded: true,
            });
        }
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
                    <Box className={this.state.projectLoaded ? null : "import-button-wrapper"}>
                        <Button
                            onClick={() => this.selectHeaderPage("Import")}>
                            Import
                        </Button>
                    </Box>
                    {
                        this.state.projectLoaded ?
                            <ProjectMenu
                                currentProject={this.props.currentProject}
                                projects={this.props.projects}
                            /> : null
                    }
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