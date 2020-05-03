import React from "react";
import PropTypes from "prop-types";
import StyledButton from "../../../../Utils/Inputs/StyledButton";
import RuleWorkTooltip from "../../../../Utils/DataDisplay/RuleWorkTooltip";
import Matrix from "mdi-material-ui/Matrix";

function MatrixButton(props) {
    const {title, ...other} = props;
    
    return (
        <RuleWorkTooltip id={"matrix-button-tooltip"} title={title}>
            <StyledButton
                aria-label={"matrix-button"}
                isIcon={true}
                themeVariant={"secondary"}
                {...other}
            >
                <Matrix />
            </StyledButton>
        </RuleWorkTooltip>
    )

}

MatrixButton.propTypes = {
    onClick: PropTypes.func,
    title: PropTypes.string.isRequired,
};

export default MatrixButton;