import React from "react";
import PropTypes from "prop-types";
import { calculationStyles } from "./styles";
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import MenuItem from "@material-ui/core/MenuItem";

const measures = [
    {
        label: "epsilon",
        value: "monotonic"
    },
    {
        label: "rough membership",
        value: "standard"
    }
]

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
                    outsideLabel={"Select consistency measure"}
                    select={true}
                    {...TextFieldProps}
                    {...other}
                >
                    {measures.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
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