import React from "react";
import PropTypes from "prop-types";
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import RuleWorkTooltip from "../../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import StyledButton from "../../../../RuleWorkComponents/Inputs/StyledButton";
import styles from "./styles/Calculations.module.css";
import Shuffle from "@material-ui/icons/Shuffle";

function SeedSelector(props) {
    const { CircleHelperProps, TextFieldProps: { value, ...other } } = props;

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper}>
            <CircleHelper
                title={"Add more information to tooltip"}
                WrapperProps={{
                    style: { marginRight: 16 }
                }}
                {...CircleHelperProps}
            />
            <div aria-label={"inner wrapper"} className={styles.InnerWrapper}>
                <RuleWorkTextField
                    outsideLabel={"Choose seed"}
                    value={value}
                    {...other}
                />
            </div>
            <RuleWorkTooltip
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
            </RuleWorkTooltip>

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