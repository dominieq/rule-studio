import React from "react";
import PropTypes from "prop-types";
import RuleWorkHelper from "../../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";

function TypeOfRulesSelector(props) {
    const { id } = props;

    return (
        <div id={id} style={{display: "flex", alignItems: "center", margin: "4px 0"}}>
            <RuleWorkHelper style={{marginRight: 16}}>
                {"Add more information to tooltip"}
            </RuleWorkHelper>
            <RuleWorkSmallBox style={{flexGrow: 1, margin: 0}}>
                <RuleWorkTextField
                    outsideLabel={"Choose type of rules"}
                    select={true}
                    {...props}
                >
                    {["certain", "possible"]}
                </RuleWorkTextField>
            </RuleWorkSmallBox>
        </div>
    )
}

TypeOfRulesSelector.propTypes = {
    disabledChildren: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
};

export default TypeOfRulesSelector;