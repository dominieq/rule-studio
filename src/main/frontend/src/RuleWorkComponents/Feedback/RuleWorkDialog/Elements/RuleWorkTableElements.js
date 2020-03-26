import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import StyledPagination from "../../../Navigation/StyledPagination";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const StyledList = withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.list.background,
        color: theme.palette.list.text,
        minWidth: "50%",
    }
}))(props => <List {...props} />);

class RuleWorkTableElements extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedItem: 0,
            selectedPage: 1,
            itemsPerPage: 14,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.table !== this.props.table) {
            this.setState({
                selectedItem: 0,
                selectedPage: 1,
            });
        }
    }

    onListItemClick = (event, index) => {
        this.setState({
            selectedItem: index,
        }, () => {
            this.props.onTableItemSelected(this.state.selectedItem);
        });
    };

    onPageChange = (event, value) => {
        this.setState({selectedPage: value});
    };

    prepareListItems = (table) => {
        const tableItems = [];
        for(let i = 0; i < table.length; i++) {
            const tableItem = {
                id: table[i],
                name: "Object " + (Number(table[i]) + 1)
            };
            tableItems.push(tableItem);
        }
        return tableItems;
    };

    render() {
        const {selectedItem, selectedPage, itemsPerPage} = this.state;
        const {table, onTableItemSelected, ...other} = this.props;

        const count = Math.ceil(table.length / itemsPerPage);

        const start = (selectedPage - 1) * itemsPerPage;
        const end = itemsPerPage * selectedPage;
        
        const displayedItems = this.prepareListItems(table).slice(start , end);

        return (
            <Fragment>
                <StyledList component={"nav"} disablePadding={true} {...other}>
                    {displayedItems.map((item, index) => (
                        <ListItem
                            button={true}
                            disableRipple={true}
                            key={index}
                            selected={selectedItem === index}
                            onClick={event => this.onListItemClick(event, item.id)}
                        >
                            {item.name}
                        </ListItem>
                    ))}
                </StyledList>
                <StyledPagination
                    count={count}
                    onChange={this.onPageChange}
                    page={selectedPage}
                    showFirstButton={true}
                    showLastButton={true}
                    variant={"outlined"}
                />
            </Fragment>
        )
    }
}

// Expected props:
// chosenTable (required) <-- array of integers (object indexes) from chosen data table
// setChosenObject (required) <-- method responsible for setting chosen object (selected from the chosenTable) used in comparison.
// tabName (required) <-- tells from which tab was dialog launched (especially needed in rules tab)
// anything other (optional) <-- additional settings for StyledList

//Example of props:
/*
    chosenTable = [1,2,5,6,9,11]; (might be objects or lowerApproximation or anything other)
    setChosenObject = {this.setChosenObject};
    tabName = {"cones"}
}
*/

RuleWorkTableElements.propTypes = {
    onTableItemSelected: PropTypes.func,
    table: PropTypes.array,
};

export default RuleWorkTableElements;