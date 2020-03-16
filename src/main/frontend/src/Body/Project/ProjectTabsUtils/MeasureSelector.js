import React, {Fragment} from "react";
import PropTypes from "prop-types";
import RuleWorkHelper from "../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";

function MeasureSelector(props) {
    return (
        <Fragment>
            <RuleWorkHelper
                style={{marginRight: 16}}
            >
                {"Add more information to tooltip"}
            </RuleWorkHelper>
            <RuleWorkTextField
                disabledChildren={["rough membership"]}
                hasOutsideLabel={true}
                outsideLabel={"Select consistency measure"}
                select={true}
                {...props}
            >
                {["epsilon", "rough membership"]}
            </RuleWorkTextField>
        </Fragment>
    )
}

MeasureSelector.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
};

export default MeasureSelector;