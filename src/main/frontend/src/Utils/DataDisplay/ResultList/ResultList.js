import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import ResultListItem from "./Elements/ResultListItem";
import StyledPagination from "../../Navigation/StyledPagination";
import List from "@material-ui/core/List";

const StyledList = withStyles(theme=> ({
    root: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1,
        maxWidth: "90%",
        minWidth: "50%",
    }
}), {name: "ResultList"})(props => <List {...props} />);

/**
 * <h3>Overview</h3>
 * The component consists of three elements: upper and bottom Pagination and a List between them.
 * List and Pagination are components from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/list/" target="_blank">List</a> and
 * <a href="https://material-ui.com/api/pagination/" target="_blank">Pagination</a>.
 *
 * <h3>Usage</h3>
 * There are max 50 items per page. When there are less then 5 elements on a page, upper pagination is hidden.
 *
 * @constructor
 * @category Utils
 * @subcategory Result List
 * @param {Object} props - Any other props will be forwarded to the List component.
 * @param {Object[]} [props.children] - The content of the component.
 * @param {number} [props.children[].id] - The identifier of an item.
 * @param {string} [props.children[].header] - The content of the header inside ListItem.
 * @param {string} [props.children[].subheader] - The content of the subheader inside ListItem.
 * @param {Object[]} [props.children[].multiContent] - An array of simple title-subtitle verses inside ListItem.
 * @param {number|string} [props.children[].multiContent.title] - The title of a verse inside ListItem.
 * @param {number|string} [props.children[].multiContent.subtitle] - The subtitle of a verse inside ListItem.
 * @param {number|string} [props.children[].caption] - The content of the caption inside ListItem.
 * @param {number|string} [props.children[].subcaption] - The content of the subcaption inside ListItem.
 * @param {function} [props.onItemSelected] - Callback fired when item from the list was selected.
 * @returns {React.ReactElement}
 */
class ResultList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedItem: 0,
            selectedPage: 1,
            itemsPerPage: 50,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { itemsPerPage, selectedPage } = this.state;
        const { children } = this.props;

        if (prevProps.children.length !== children.length) {
            const count = Math.ceil(children.length / itemsPerPage);
            if (this.state.selectedPage > count) {
                this.setState({
                    selectedPage: count
                });
            }
            if (children.length < itemsPerPage && selectedPage !== 1) {
                this.setState({
                    selectedPage: 1,
                });
            }
        }
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
        const { selectedItem, selectedPage, itemsPerPage } = this.state;
        const { children, onItemSelected, ...other } = this.props;

        const count = Math.ceil(children.length / itemsPerPage);

        const start = (selectedPage - 1) * itemsPerPage;
        const end = itemsPerPage * selectedPage;
        const displayedItems = children.slice(start , end);

        return (
            <Fragment>
                <StyledPagination
                    count={count}
                    hidden={children.length <= 50 || displayedItems.length <= 5}
                    id={"top-pagination"}
                    onChange={this.onPageChange}
                    page={selectedPage}
                    position={"top"}
                />
                <StyledList {...other}>
                    {displayedItems.map((item, index) => (
                        <ResultListItem
                            key={index}
                            object={item}
                            selected={selectedItem === index}
                            onClick={event => this.onListItemClick(event, item.id)}
                        />
                    ))}
                </StyledList>
                <StyledPagination
                    count={count}
                    hidden={children.length <= 50}
                    id={"bottom-pagination"}
                    onChange={this.onPageChange}
                    page={selectedPage}
                    position={"bottom"}
                />
            </Fragment>
        )
    }
}

ResultList.propTypes = {
    children: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        header: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        subheader: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        multiContent: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            subtitle: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        })),
        caption: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        subcaption: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })),
    classes: PropTypes.object,
    component: PropTypes.elementType,
    dense: PropTypes.bool,
    disablePadding: PropTypes.bool,
    onItemSelected: PropTypes.func,
    subheader: PropTypes.node,
};

ResultList.defaultProps = {
    disablePadding: true,
};

export default ResultList;
