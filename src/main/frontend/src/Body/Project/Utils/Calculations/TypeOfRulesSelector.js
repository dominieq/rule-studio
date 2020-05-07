import React from "react";
import PropTypes from "prop-types";
import CircleHelper from "../../../../Utils/Feedback/CircleHelper";
import CustomTextField from "../../../../Utils/Inputs/CustomTextField";
import styles from "./styles/Calculations.module.css";

const tooltip = {
    main: "Certain decision rules are induced using lower approximations of unions of ordered decision classes. " +
        "Possible decision rules are induced using upper approximations of the unions. " +
        "Possible rules can only be induced if selected consistency threshold is “the most restrictive”, " +
        "which implies that VC-DRSA boils down to DRSA. " +
        "For instance, to most restrictive value for measure epsilon is 0.0, while for measure rough membership, it is 1.0. " +
        "Moreover, possible rules cannot be induced if data contain missing values " +
        "that can lead to non-transitivity of dominance relation, i.e., of type mv2"
};

function TypeOfRulesSelector(props) {
    const { CircleHelperProps, TextFieldProps } = props;

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper}>
            <CircleHelper
                title={
                    <p aria-label={"main"} style={{ margin: 0, textAlign: "justify" }}>
                        {tooltip.main}
                    </p>
                }
                WrapperProps={{
                    style: { marginRight: 16 }
                }}
                {...CircleHelperProps}
            />
            <div aria-label={"inner wrapper"} className={styles.InnerWrapper}>
                <CustomTextField
                    outsideLabel={"Select type of rules"}
                    select={true}
                    {...TextFieldProps}
                >
                    {["certain", "possible"]}
                </CustomTextField>
            </div>
        </div>
    )
}

TypeOfRulesSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    TextFieldProps: PropTypes.shape({
        disabledChildren: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func,
        value: PropTypes.string
    })
};

export default TypeOfRulesSelector;
