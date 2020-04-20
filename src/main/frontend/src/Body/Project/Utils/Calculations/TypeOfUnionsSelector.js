import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { calculationStyles } from "./styles";
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import MenuItem from "@material-ui/core/MenuItem";

const tooltip = {
    mainSimple: "Consistency measure is used when calculating lower approximations of unions of ordered decision classes " +
        "according to the Variable Consistency Dominance-based Rough Set Approach (VC-DRSA). " +
        "Available measures are defined as follows:",
    mainExtended: "Consistency measure is used when calculating lower approximations of unions of ordered decision classes " +
        "according to the Variable Consistency Dominance-based Rough Set Approach (VC-DRSA), " +
        "and then, when inducing decision rules. The measures are defined as follows:",
    epsilon: " - measures, for a given object y and given union X, the ratio of " +
        "1) the number of objects from positive (if X is an upward unions of classes) or " +
        "negative (if X is a downward unions of classes) dominance cone originating in y that do not belong to X and " +
        "2) the number of all objects that do not belong to X;",
    roughMembership: " – measures, for a given object y and given union X, the ratio of " +
        "1) the number of objects from positive/negative (see above) dominance cone originating in y that belong to X and " +
        "2) the number of all objects in that dominance cone."
};

const measures = [
    {
        label: "epsilon",
        value: "monotonic"
    },
    {
        label: "rough membership",
        value: "standard"
    }
];

const tooltipStyles = makeStyles({
    paragraph: {
        margin: 0,
        textAlign: "justify"

    }
}, {name: "multi-row-tooltip"})

function TypeOfUnionsSelector(props) {
    const { CircleHelperProps, id, disabledChildren, TextFieldProps, variant, ...other } = props;
    const calculationClasses = calculationStyles();
    const tooltipClasses = tooltipStyles();

    return (
        <div id={id} className={calculationClasses.drawerRow}>
            <CircleHelper
                multiRow={true}
                title={
                    <React.Fragment>
                        <p className={tooltipClasses.paragraph} id={"main"}>
                            {tooltip["main" + variant[0].toUpperCase() + variant.slice(1)]}
                        </p>
                        <p className={tooltipClasses.paragraph} id={"epsilon"}>
                            <b>epsilon</b>
                            {tooltip.epsilon}
                        </p>
                        <p className={tooltipClasses.paragraph} id={"rough-membership"}>
                            <b>rough membership</b>
                            {tooltip.roughMembership}
                        </p>
                    </React.Fragment>
                }
                TooltipProps={{
                    placement: "right-start",
                    PopperProps: {
                        disablePortal: false
                    }
                }}
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
                        <MenuItem
                            key={index}
                            disabled={disabledChildren ? disabledChildren.includes(option.value) : false}
                            value={option.value}
                        >
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
    variant: PropTypes.oneOf(["simple", "extended"])
};

TypeOfUnionsSelector.defaultProps = {
    variant: "simple"
}

export default TypeOfUnionsSelector;