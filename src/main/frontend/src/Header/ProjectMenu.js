import React, {Component} from 'react';
import Box from"@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

class ProjectMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorE1: null,
            primaryText: "No active projects",
            selectedIndex: this.props.selectedProject,
        };

        this.handleClickListItem = this.handleClickListItem.bind(this);
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClickListItem(event) {
        this.setState({
            anchorE1: event.currentTarget,
        });
    };

    handleMenuItemClick(event, index) {
        this.props.selectProject(index);
        this.props.selectBody("Project");

        this.setState({
            anchorE1: null,
            primaryText: "Active project: " + this.props.projects[index].name,
            selectedIndex: index,
        });
    };

    handleClose() {
        this.setState({
            anchorE1: null,
        });
    };

    updateNewProject(projects, index) {
        this.setState({
            primaryText: "Active project: " + projects[index].name,
            selectedIndex: index,
        })
    }

    render() {
        return (
            <Box component={"div"} flexGrow={1}>
                <List component={"nav"} >
                    <ListItem
                        button
                        aria-haspopup={"true"}
                        aria-controls={"lock-menu"}
                        onClick={this.handleClickListItem}>
                        <ListItemText primary={this.state.primaryText}/>
                    </ListItem>
                </List>
                <Menu
                    anchorEl={this.state.anchorE1}
                    keepMounted
                    open={Boolean(this.state.anchorE1)}
                    onClose={this.handleClose}>
                    {this.props.projects.map((option, index) => (
                        <MenuItem
                            key={option.id}
                            disabled={index === 0}
                            selected={index === this.state.selectedIndex}
                            onClick={event => this.handleMenuItemClick(event, index)}>
                            {option.name}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        )
    }
}

export default ProjectMenu;