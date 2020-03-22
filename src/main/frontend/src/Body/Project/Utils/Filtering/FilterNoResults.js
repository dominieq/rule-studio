import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import StyledTypography from "../../../../RuleWorkComponents/DataDisplay/StyledTypography";

const useStyles = makeStyles(theme=> ({
    "no-results": {
        color: theme.palette.text.default,
    }
}), {name: "filter"});

function FilterNoResults() {
    const classes = useStyles();

    return (
        <StyledTypography className={classes["no-results"]} variant={"h6"}>
            Oops... it appears that there are no objects containing your phrase.
        </StyledTypography>
    )
}

export default FilterNoResults;