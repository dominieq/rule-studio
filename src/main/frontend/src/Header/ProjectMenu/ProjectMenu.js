import React, {Component} from 'react';
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
        return (
            <div>
                <List component={"nav"} >
                    <ListItem
                        button
                        aria-haspopup={"true"}
                        aria-controls={"lock-menu"}
                        onClick={this.handleClickListItem}>
                        <ListItemText
                            primary={"Active project: "}
                            secondary={this.props.projects[this.state.selectedIndex]} />
                    </ListItem>
                </List>
                <Menu
                    anchorEl={this.state.anchorE1}
                    keepMounted
                    open={Boolean(this.state.anchorE1)}
                    onClose={this.handleClose}>
                    {this.props.projects.map((option, index) => (
                        <MenuItem
                            key={option}
                            selected={index === this.state.selectedIndex}
                            onClick={event => this.handleMenuItemClick(event, index)}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        )
    }
}

export default ProjectMenu;