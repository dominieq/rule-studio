import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/Calculations.module.css";
import CircleHelper from "../../../../Utils/Feedback/CircleHelper";
import CustomTextField from "../../../../Utils/Inputs/CustomTextField";

const tooltip = {
    main: "Number of parts of equal (or differing by 1) size that the training data set is randomly split into " +
        "to perform a stratified cross-validation. " +
        "In each fold, all but one parts are treated as a learning information table (training set), " +
        "and the remaining part is treated as a test set, " +
        "and used to evaluate performance of the chosen rule classifier " +
        "(employing rules induced using the training set)."
};

/**
 * Presents number of folds and allows user to type new value.
 *
 * @name NumberOfFolds
 * @class
 * @category Tabs
 * @subcategory Calculations
 * @param {Object} props
 * @param {Object} props.CircleHelperProps - Props applied to the {@link CircleHelper} element.
 * @param {Object} props.TextFieldProps - Props applied to the {@link CustomTextField} element.
 * @returns {React.ReactElement}
 */
function NumberOfFoldsSelector(props) {
    const { CircleHelperProps, TextFieldProps } = props;

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper} style={props.style}>
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
