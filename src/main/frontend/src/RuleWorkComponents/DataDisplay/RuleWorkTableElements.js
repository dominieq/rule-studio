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

class RuleWorkTableElements extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedItem: 0,
            selectedPage: 1,
            itemsPerPage: 15,
            open: false,
        };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.chosenTable !== this.props.chosenTable) { //if table changed, then set back to page 1 and selected 0
            this.setState({
                selectedItem: 0,
                selectedPage: 1,
            })
        }
    }

    onListItemClick = (event, index) => {
        this.setState({
            selectedItem: index,
            open: true,
        }, () => this.props.setChosenObject(this.state.selectedItem + this.state.itemsPerPage*(this.state.selectedPage-1))) //set accordingly to the page
    };

    onPageChange = (event, value) => {
        this.setState({
            selectedPage: value,
        })
    };

    prepareListItems = (chosenTableWithIndex, tabName) => {
        const tmp = [];

        const array = chosenTableWithIndex.chosenTable;
        if(tabName === 'rules' && chosenTableWithIndex.indexOfChosenTable === 3) {
            for(let i in array) {
                tmp.push({name: "Object " + (parseInt(i,10)+1)}); //index objects from 1
            }
            return tmp;
        } else {
            for(let i in array) {
                tmp.push({name: "Object " + (parseInt(array[i],10)+1)}); //index objects from 1
            }
            return tmp;
        }
    }

    render() {
        const {selectedItem, selectedPage, itemsPerPage} = this.state;
        const {chosenTableWithIndex, setChosenObject, tabName, ...other} = this.props;
console.log(chosenTableWithIndex);
        const chosenTable = chosenTableWithIndex.chosenTable;

        const count = Math.ceil(chosenTable.length / itemsPerPage);

        const start = (selectedPage - 1) * itemsPerPage;
        const end = itemsPerPage * selectedPage;
        
        const displayedItems = this.prepareListItems(chosenTableWithIndex, tabName).slice(start , end);

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
// chosenTableWithIndex (required) <-- object consisting of the array of integers (object indexes) from chosen array and index of that array
// setChosenObject (required) <-- method responsible for setting chosen object (selected from the chosenTable) used in comparison.
// tabName (required) <-- tells from which tab was dialog launched (especially needed in rules tab)
// anything other (optional) <-- additional settings for StyledList

//Example of props:
/*
    chosenTableWithIndex = {chosenTable: [1,2,5,6,9,11], index: 1}; (might be objects or lowerApproximation or anything other)
    setChosenObject = {this.setChosenObject};
    tabName = {"cones"}
}
*/

RuleWorkTableElements.propTypes = {
    chosenTableWithIndex: PropTypes.object,
    setChosenTable: PropTypes.func,
    tabName: PropTypes.string
};

export default RuleWorkTableElements;