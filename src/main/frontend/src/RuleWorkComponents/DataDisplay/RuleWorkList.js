import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import RuleWorkListItem from "./RuleWorkListItem";
import StyledPagination from "../Navigation/StyledPagination";
import List from "@material-ui/core/List";

const StyledList = withStyles(theme=> ({
    root: {
        backgroundColor: theme.palette.list.background,
        color: theme.palette.list.text,
        maxWidth: "75%",
        minWidth: "50%",
    }
}), {name: "rule-work-list"})(props => <List {...props} />);

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
        }, () => {
            this.props.onItemSelected(this.state.selectedItem);
        })
    };

    onPageChange = (event, value) => {
        this.setState({
            selectedPage: value,
        })
    };

    render() {
        const {selectedItem, selectedPage, itemsPerPage} = this.state;
        const {children, onItemSelected, ...other} = this.props;

        const count = Math.ceil(children.length / itemsPerPage);

        const start = (selectedPage - 1) * itemsPerPage;
        const end = itemsPerPage * selectedPage;
        const displayedItems = children.slice(start , end);

        return (
            <Fragment>
                <StyledList {...other}>
                    {displayedItems.map((item, index) => (
                        <RuleWorkListItem
                            key={index}
                            object={item}
                            selected={selectedItem === index}
                            onClick={event => this.onListItemClick(event, item.id)}
                        />
                    ))}
                </StyledList>
                <StyledPagination
                    count={count}
                    hidden={children.length < 50}
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
    children: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        header: PropTypes.string,
        subheader: PropTypes.string,
        content: PropTypes.string,
        multiContent: PropTypes.arrayOf(PropTypes.object)
    })),
    classes: PropTypes.object,
    component: PropTypes.elementType,
    dense: PropTypes.bool,
    disablePadding: PropTypes.bool,
    ListItemContent: PropTypes.object,
    onItemSelected: PropTypes.func,
    subheader: PropTypes.node,
};

RuleWorkList.defaultProps = {
    component: "nav",
    disablePadding: true,
};

export default RuleWorkList;