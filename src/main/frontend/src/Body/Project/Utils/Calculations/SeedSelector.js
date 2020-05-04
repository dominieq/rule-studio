import React from "react";
import PropTypes from "prop-types";
import CircleHelper from "../../../../Utils/Feedback/CircleHelper";
import CustomTextField from "../../../../Utils/Inputs/CustomTextField";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import StyledButton from "../../../../Utils/Inputs/StyledButton";
import styles from "./styles/Calculations.module.css";
import Shuffle from "@material-ui/icons/Shuffle";

const tooltip = {
    main: "Numeric value used by random number generator." +
        "Using the same seed guarantees the repeatability of cross-validation for given data set."
};

function SeedSelector(props) {
    const { CircleHelperProps, TextFieldProps: { value, ...other } } = props;

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper}>
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
                <StyledButton
                    aria-label={"randomize seed"}
                    isIcon={true}
                    onClick={props.randomizeSeed}
                    themeVariant={"secondary"}
                >
                    <Shuffle />
                </StyledButton>
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