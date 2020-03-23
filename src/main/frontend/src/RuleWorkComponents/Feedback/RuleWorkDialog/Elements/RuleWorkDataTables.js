import React, {Component} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CodeBrackets from "mdi-material-ui/CodeBrackets";

const StyledList = withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.list.background,
        color: theme.palette.list.text,
    }
}))(props => <List {...props} />);

class RuleWorkDataTables extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedItem: 0,
        };
    }

    onListItemClick = (event, index) => {
        this.setState({
            selectedItem: index,
        }, () => {
            this.props.onTableSelected(this.state.selectedItem)
        });
    };

    prepareListItems = (tables) => {
        let items = [];
        const keys = Object.keys(tables);
        for(let i = 0; i < keys.length; i++) {
            const item = {
                id: i.toString(),
                name: keys[i] + " (" + tables[keys[i]].length + ")"
            };
            items.push(item);
        }
        return items;
    };

    render() {
        const displayedItems = this.prepareListItems(this.props.tables);
        
        return (
            <StyledList component={"nav"} disablePadding={true}>
                {displayedItems.map((item, index) => (
                    <ListItem
                        button={true}
                        disableRipple={true}
                        divider={true}
                        key={index}
                        onClick={event => this.onListItemClick(event, item.id)}
                        selected={this.state.selectedItem === index}
                    >
                        <ListItemIcon><CodeBrackets /></ListItemIcon>
                        <ListItemText>{item.name}</ListItemText>
                    </ListItem>
                ))}
            </StyledList>
        );
    }
}

// Expected props:
// tables (required) <-- this is the object of arrays of integers (object indexes)
// setChosenTable (required) <-- method responsible for setting chosen table (selected from the tables).

//Example of props:
/*
    tables = { objects: [0,1,3,4,8], lowerApproximation:[1,2,5,6,9,11], upperApproximation:[1,4,5,6,7,8]}
    setChosenTable = {this.setChosenTable};
}
*/
RuleWorkDataTables.propTypes = {
    onTableSelected: PropTypes.func.isRequired,
    tables: PropTypes.object.isRequired,
};

export default RuleWorkDataTables;