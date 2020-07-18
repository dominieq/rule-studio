import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

const StyledPaginationItem = withStyles(theme => ({
    root: {
        color: theme.palette.text.main1,
    },
    outlined: {
        borderColor: theme.palette.text.main1,
    },
    page: {
        '&.Mui-selected': {
            backgroundColor: theme.palette.text.main1,
            color: theme.palette.background.default,
            '&:hover': {
                backgroundColor: theme.palette.text.main1,
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

/**
 * The Pagination component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/pagination/" target="_blank">Pagination</a>.
 * <br>
 * A position of the component determines whether a <code>margin-bottom</code> (<code>position='top'</code>)
 * or a <code>margin-top</code> (<code>position='bottom'</code>) attribute should be added.
 *
 * @constructor
 * @param props {Object} - Any other props will be forwarded the Pagination component.
 * @param props.position {('top'|'bottom')} - Specifies the position of the component.
 * @returns {React.ReactElement} - The Pagination component from Material-UI library.
 */
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