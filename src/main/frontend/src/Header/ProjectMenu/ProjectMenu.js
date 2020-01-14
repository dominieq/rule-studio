import React, {useState} from 'react';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

function ProjectMenu(props) {
    const [anchorE1, setAnchorE1] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(props.currentProject);

    const handleClickListItem = event => {
        setAnchorE1(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorE1(null);
    };

    const handleClose = () => {
        setAnchorE1(null);
    };

    return (
        <div>
            <List component={"nav"} >
                <ListItem
                    button
                    aria-haspopup={"true"}
                    aria-controls={"lock-menu"}
                    onClick={handleClickListItem}>
                    <ListItemText primary={"Active project: "} secondary={props.projects[selectedIndex]} />
                </ListItem>
            </List>
            <Menu
                anchorEl={anchorE1}
                keepMounted
                open={Boolean(anchorE1)}
                onClose={handleClose}>
                {props.projects.map((option, index) => (
                    <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={event => handleMenuItemClick(event, index)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default ProjectMenu;