import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme=> ({
    "no-results": {
        color: theme.palette.text.default,
    }
}), {name: "filter"});

function FilterNoResults() {
    const classes = useStyles();

    return (
        <Typography className={classes["no-results"]} variant={"h6"}>
            Oops... it appears that there are no objects containing your phrase.
        </Typography>
    )
}

export default FilterNoResults;