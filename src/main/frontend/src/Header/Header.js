import React, {Component} from 'react';
import {makeStyles} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import ProjectMenu from "./ProjectMenu/ProjectMenu";

class Header extends Component {
    constructor(props) {
        super(props);

        this.selectHeaderPage = this.selectHeaderPage.bind(this);
    }

    selectHeaderPage(name) {
        this.props.selectHeaderPage(name);
    }

    render() {
        const classes = makeStyles(() => ({
            root: {
                flexGrow: 1
            },
            projectMenu: {
                flexGrow: 1
            }
        }));

        return (
            <div className={classes.root}>
                <AppBar position={"static"} >
                    <Toolbar>
                        <IconButton
                            edge={"start"}
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
                            className={classes.projectMenu}
                        />
                        <Button
                            edge={"end"}
                            onClick={() => this.selectHeaderPage("Help")}>
                            Help
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default Header;