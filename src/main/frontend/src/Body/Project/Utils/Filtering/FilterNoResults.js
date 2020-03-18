import React from "react";
import StyledTypography from "../../../../RuleWorkComponents/DataDisplay/StyledTypography";

function FilterNoResults() {
    return (
        <StyledTypography styleVariant={"filter-no-results"} variant={"h6"}>
            Oops... it appears that there are no objects containing your phrase.
        </StyledTypography>
    )
}

export default FilterNoResults;