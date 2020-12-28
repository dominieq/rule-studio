import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../../../Utils/Feedback/CircleHelper";
import CustomTextField from "../../../Utils/Inputs/CustomTextField";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./styles/Calculations.module.css"

const tooltip = {
    mainSimple: " is used when calculating lower approximations of unions of ordered decision classes " +
        "according to the Variable Consistency Dominance-based Rough Set Approach (VC-DRSA). " +
        "Available measures are defined as follows:",
    mainExtended: " is used when calculating lower approximations of unions of ordered decision classes " +
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
}, {name: "MultiRow"})

/**
 * <h3>Overview</h3>
 * Presents type of unions and allows user to choose between values.
 *
 * @name TypeOfUnions
 * @constructor
 * @category Project
 * @subcategory Calculations
 * @param {Object} props
 * @param {Object} props.CircleHelperProps - Props applied to the {@link CircleHelper} element.
 * @param {Object} props.TextFieldProps - Props applied to the {@link CustomTextField} element.
 * @param {"simple"|"extended"} [props.variant="simple"] - Determines what text should be displayed in the tooltip.
 * @returns {React.ReactElement}
 */
function TypeOfUnionsSelector(props) {
    const { CircleHelperProps, TextFieldProps: { disabledChildren, ...other }, variant } = props;
    const tooltipClasses = tooltipStyles();

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper} style={props.style}>
            <CircleHelper
                multiRow={true}
                title={
                    <React.Fragment>
                        <p aria-label={"main"} className={tooltipClasses.paragraph}>
                            <b>Consistency measure</b>
                            {tooltip["main" + variant[0].toUpperCase() + variant.slice(1)]}
                        </p>
                        <p aria-label={"epsilon"} className={tooltipClasses.paragraph}>
                            <b>epsilon</b>
                            {tooltip.epsilon}
                        </p>
                        <p aria-label={"rough membership"} className={tooltipClasses.paragraph}>
                            <b>rough membership</b>
                            {tooltip.roughMembership}
                        </p>
                    </React.Fragment>
                }
                WrapperProps={{
                    style: { marginRight: 16 }
                }}
                {...CircleHelperProps}
            />
            <div aria-label={"inner wrapper"} className={styles.InnerWrapper}>
                <CustomTextField
                    outsideLabel={"Select consistency measure"}
                    select={true}
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
                </CustomTextField>
            </div>
        </div>
    )
}

TypeOfUnionsSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    TextFieldProps: PropTypes.shape({
        disabledChildren: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func,
        value: PropTypes.string
    }),
    variant: PropTypes.oneOf(["simple", "extended"])
};

TypeOfUnionsSelector.defaultProps = {
    variant: "simple"
}

export default TypeOfUnionsSelector;
