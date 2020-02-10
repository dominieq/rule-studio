import React, {Component} from 'react';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import "./ProjectMenu.css";

class ProjectMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorE1: null,
            numberOfProjects: this.props.projects.size,
            selectedIndex: this.props.currentProject,
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
        this.setState({
            selectedIndex: index,
            anchorE1: null,
        });
    };

    handleClose() {
        this.setState({
            anchorE1: null,
        });
    };

    render() {
        let value = this.props.projects[0];

        if (this.state.numberOfProjects > 1) {
            value = this.props.projects[this.state.selectedIndex];
        }

        return (
            <div className={"project-menu"}>
                <div className={"project-list"}>
                    <List component={"nav"} >
                        <ListItem
                            button
                            aria-haspopup={"true"}
                            aria-controls={"lock-menu"}
                            onClick={this.handleClickListItem}>
                            <ListItemText primary={"Active project: " + value.name}/>
                        </ListItem>
                    </List>
                    <Menu
                        anchorEl={this.state.anchorE1}
                        keepMounted
                        open={Boolean(this.state.anchorE1)}
                        onClose={this.handleClose}>
                        {this.props.projects.map((option, index) => (
                            <MenuItem
                                key={option.name}
                                disabled={index === 0}
                                selected={index === this.state.selectedIndex}
                                onClick={event => this.handleMenuItemClick(event, index)}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
                <div>
                    <IconButton>
                        <Icon>add-circle</Icon>
                    </IconButton>
                </div>
            </div>
        )
    }
}

export default ProjectMenu;