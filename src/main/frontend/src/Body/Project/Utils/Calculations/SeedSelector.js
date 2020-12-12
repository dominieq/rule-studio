import React from "react";
import PropTypes from "prop-types";
import CircleHelper from "../../../../Utils/Feedback/CircleHelper";
import CustomTextField from "../../../../Utils/Inputs/CustomTextField";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../../../Utils/Buttons";
import styles from "./styles/Calculations.module.css";
import Shuffle from "@material-ui/icons/Shuffle";

const tooltip = {
    main: "Numeric value used by random number generator. " +
        "Using the same seed guarantees the repeatability of cross-validation for given data set."
};

/**
 * Presents seed and allows user to type or randomize new value.
 *
 * @name Seed
 * @class
 * @category Tabs
 * @subcategory Calculations
 * @param {Object} props
 * @param {Object} props.CircleHelperProps - Props applied to the {@link CircleHelper} element.
 * @param {Object} props.randomizeSeed - Callback fired when user requests to randomize seed.
 * @param {Object} props.TextFieldProps - Props applied to the {@link CustomTextField} element.
 * @returns {React.ReactElement}
 */
function SeedSelector(props) {
    const { CircleHelperProps, TextFieldProps: { value, ...other } } = props;

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper} style={props.style}>
            <CircleHelper
                title={
                    <p aria-label={"main"} style={{margin: 0, textAlign: "justify"}}>
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
                    outsideLabel={"Choose seed"}
                    value={value}
                    {...other}
                />
            </div>
            <CustomTooltip
                title={"Randomize seed"}
                WrapperProps={{
                    style: { marginLeft: 8 }
                }}
            >
                <StyledIconButton
                    aria-label={"randomize seed"}
                    color={"secondary"}
                    onClick={props.randomizeSeed}
                >
                    <Shuffle />
                </StyledIconButton>
            </CustomTooltip>

        </div>
    )
}

SeedSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    randomizeSeed: PropTypes.func,
    TextFieldProps: PropTypes.shape({
        onChange: PropTypes.func,
        value: PropTypes.any,
    })
};

export default SeedSelector;
