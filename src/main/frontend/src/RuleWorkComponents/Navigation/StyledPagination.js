import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {withStyles} from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

const StyledPaginationItem = withStyles({
    root: {
        color: "#ABFAA9",
    },
    outlined: {
        borderColor: "#ABFAA9",
    },
    page: {
        '&.Mui-selected': {
            backgroundColor: "#ABFAA9",
            color: "#2A3439",
            '&:hover': {
                backgroundColor: "#ABFAA9",
            },
        },
    }
})(props => <PaginationItem {...props}/>);

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