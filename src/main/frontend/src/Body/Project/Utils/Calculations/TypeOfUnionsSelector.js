import React, {Fragment} from "react";
import PropTypes from "prop-types";
import RuleWorkHelper from "../../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";

function TypeOfUnionsSelector(props) {
    return (
        <Fragment>
            <RuleWorkHelper
                style={{marginRight: 16}}
            >
                {"Add more information to tooltip"}
            </RuleWorkHelper>
            <RuleWorkTextField
                outsideLabel={"Select consistency measure"}
                select={true}
                {...props}
            >
                {["monotonic", "standard"]}
            </RuleWorkTextField>
        </Fragment>
    )
}

TypeOfUnionsSelector.propTypes = {
    disabledChildren: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    value: PropTypes.string,
};

export default TypeOfUnionsSelector;