import React from "react";
import PropTypes from "prop-types";
import { calculationStyles } from "./styles";
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";

function TypeOfUnionsSelector(props) {
    const { CircleHelperProps, id, TextFieldProps, ...other } = props;
    const calculationClasses = calculationStyles();

    return (
        <div id={id} className={calculationClasses.drawerRow}>
            <CircleHelper
                title={"Add more information to tooltip"}
                WrapperProps={{
                    style: {marginRight: 16}
                }}
                {...CircleHelperProps}
            />
            <RuleWorkSmallBox className={calculationClasses.inputElement}>
                <RuleWorkTextField
                    outsideLabel={"Select type of unions"}
                    select={true}
                    {...TextFieldProps}
                    {...other}
                >
                    {["monotonic", "standard"]}
                </RuleWorkTextField>
            </RuleWorkSmallBox>
        </div>
    )
}

TypeOfUnionsSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    disabledChildren: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    TextFieldProps: PropTypes.object,
    value: PropTypes.string,
};

export default TypeOfUnionsSelector;