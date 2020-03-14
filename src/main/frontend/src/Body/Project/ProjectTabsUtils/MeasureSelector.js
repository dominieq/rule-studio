import React, {Fragment} from "react";
import PropTypes from "prop-types";
import RuleWorkHelper from "../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import RuleWorkSelect from "../../../RuleWorkComponents/Inputs/RuleWorkSelect";

function MeasureSelector(props) {
    return (
        <Fragment>
            <RuleWorkHelper
                style={{marginRight: 16}}
            >
                {"Add more information to tooltip"}
            </RuleWorkHelper>
            <RuleWorkSelect
                disabledChildren={["rough membership"]}
                label={"Select consistency measure"}
                {...props}
            >
                {["epsilon", "rough membership"]}
            </RuleWorkSelect>
        </Fragment>
    )
}

MeasureSelector.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
};

export default MeasureSelector;