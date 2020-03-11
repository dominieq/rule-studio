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

class RuleWorkList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedItem: 0,
            selectedPage: 1,
            itemsPerPage: 50,
        };
    }

    onListItemClick = (event, index) => {
        this.setState({
            selectedItem: index,
        })
    };

    onPageChange = (event, value) => {
        this.setState({
            selectedPage: value,
        })
    };

    render() {
        const {selectedItem, selectedPage, itemsPerPage} = this.state;
        const {children, ...other} = this.props;

        const count = Math.ceil(children.length / itemsPerPage);

        const start = (selectedPage - 1) * itemsPerPage;
        const end = itemsPerPage * selectedPage;
        const displayedItems = children.slice(start , end);

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

RuleWorkList.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
};

export default RuleWorkList;