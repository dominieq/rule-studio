import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {withStyles} from "@material-ui/core/styles";
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

const useStyles = makeStyles({
    root: {
        marginTop: 12,
    },
});

function StyledPagination(props) {
    const classes = useStyles();

    return (
        <Pagination
            classes={{root: classes.root}}
            renderItem={
                item => <StyledPaginationItem {...item}/>
            }
            {...props}
        />
    )
}

export default StyledPagination;