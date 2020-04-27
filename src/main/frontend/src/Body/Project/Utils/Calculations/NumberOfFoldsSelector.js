import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/Calculations.module.css";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";

function NumberOfFoldsSelector(props) {
    const { CircleHelperProps, TextFieldProps } = props;

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper}>
            <div aria-label={"inner wrapper"} className={styles.InnerWrapper}>
                <RuleWorkTextField
                    outsideLabel={"Choose number of folds"}
                    style={{maxWidth: 72}}
                    {...TextFieldProps}
                />
            </div>
        </div>
    )
}

NumberOfFoldsSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    TextFieldProps: PropTypes.shape({
        onChange: PropTypes.func,
        value: PropTypes.any
    })
};

export default NumberOfFoldsSelector;