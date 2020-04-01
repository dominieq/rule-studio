import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

const StyledPaginationItem = withStyles(theme => ({
    root: {
        color: theme.palette.paper.text,
    },
    outlined: {
        borderColor: theme.palette.paper.text,
    },
    page: {
        '&.Mui-selected': {
            backgroundColor: theme.palette.paper.text,
            color: theme.palette.background.default,
            '&:hover': {
                backgroundColor: theme.palette.paper.text,
            },
        },
    }
}))(props => <PaginationItem {...props}/>);

const paginationStyles = makeStyles({
    bottom: {
        marginTop: 12,
    },
    top: {
        marginBottom: 12,
    },
}, {name: "pagination"});

function StyledPagination(props) {
    const { position, renderItem, ...other } = props;
    const paginationClasses = paginationStyles();

    return (
        <Pagination
            className={paginationClasses[position]}
            renderItem={!renderItem ? item => <StyledPaginationItem {...item}/> : renderItem}
            {...other}
        />
    )
}

StyledPagination.propTypes = {
    boundaryCount: PropTypes.number,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["default", "primary", "secondary"]),
    count: PropTypes.number,
    defaultPage: PropTypes.number,
    disabled: PropTypes.bool,
    getItemAriaLabel: PropTypes.func,
    hideNextButton: PropTypes.bool,
    hidePrevButton: PropTypes.bool,
    onChange: PropTypes.func,
    page: PropTypes.number,
    position: PropTypes.oneOf(["top", "bottom"]).isRequired,
    renderItem: PropTypes.func,
    shape: PropTypes.oneOf(["round", "rounded"]),
    showFirstButton: PropTypes.bool,
    showLastButton: PropTypes.bool,
    sibling: PropTypes.number,
    size: PropTypes.oneOf(["large", "medium", "small"]),
    variant: PropTypes.oneOf(["outlined", "text"])
};

StyledPagination.defaultProps = {
    showFirstButton: true,
    showLastButton: true,
    variant: "outlined"
};

export default StyledPagination;