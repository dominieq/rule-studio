import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import RuleWorkListItem from "./RuleWorkListItem";
import StyledPagination from "../Navigation/StyledPagination";
import List from "@material-ui/core/List";

const StyledList = withStyles({
    root: {
        backgroundColor: "#545F66",
        color: "#ABFAA9",
        minWidth: "50%",
    }
})(props => <List {...props} />);

class RuleWorkDataTables extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedItem: 0,
            selectedPage: 1,
            itemsPerPage: 15,
        };
    }

    onListItemClick = (event, index) => {
        this.setState({
            selectedItem: index,
        }, () => this.props.setChosenTable(this.state.selectedItem))
    };

    onPageChange = (event, value) => {
        this.setState({
            selectedPage: value,
        })
    };

    prepareListItems = (objectWithArrays, tabName) => {
        const tmp = [];
        const keys = Object.keys(objectWithArrays);
        for(let i in keys) {
            if(tabName !== 'rules') tmp.push({name: keys[i] + " (" + objectWithArrays[keys[i]].length + ")"}); //name of the array with number of elements
            else if(i !== 3) { //"decisionsOfCoveredObjects" is an object of objects instead of array
                tmp.push({name: keys[i] + " (" + Object.keys(objectWithArrays[keys[i]]).length + ")"});
            }
        }
        return tmp;
    }

    render() {
        const {selectedItem, selectedPage, itemsPerPage} = this.state;
        const {tables, setChosenTable, tabName, ...other} = this.props;

        const count = Math.ceil(Object.keys(tables).length / itemsPerPage);

        const start = (selectedPage - 1) * itemsPerPage;
        const end = itemsPerPage * selectedPage;
        
        const displayedItems = this.prepareListItems(tables, tabName).slice(start , end);
        
        return (
            <Fragment>
                <StyledList {...other} component={"nav"}>
                    {displayedItems.map((item, index) => (
                        <RuleWorkListItem
                            key={index}
                            object={item}
                            selected={selectedItem === index}
                            onClick={event => this.onListItemClick(event, index)}
                        />
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
// tables (required) <-- this is the object of arrays of integers (object indexes)
// setChosenTable (required) <-- method responsible for setting chosen table (selected from the tables).
// tabName (required) <-- tells from which tab was dialog launched (especially needed in rules tab)
// anything other (optional) <-- additional settings for StyledList

//Example of props:
/*
    tables = { objects: [0,1,3,4,8], lowerApproximation:[1,2,5,6,9,11], upperApproximation:[1,4,5,6,7,8]}
    setChosenTable = {this.setChosenTable};
}
*/


RuleWorkDataTables.propTypes = {
    tables: PropTypes.object,
    setChosenTable: PropTypes.func,
    tabName: PropTypes.string
};

export default RuleWorkDataTables;