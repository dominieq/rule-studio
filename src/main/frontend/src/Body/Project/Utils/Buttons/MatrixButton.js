import React from "react";
import PropTypes from "prop-types";
import StyledButton from "../../../../RuleWorkComponents/Inputs/StyledButton";
import RuleWorkTooltip from "../../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import Matrix from "mdi-material-ui/Matrix";

function MatrixButton(props) {
    return (
        <RuleWorkTooltip id={"matrix-button-tooltip"} title={"Show misclassification matrix"}>
            <StyledButton
                isIcon={true}
                themeVariant={"secondary"}
                {...props}
            >
                <Matrix />
            </StyledButton>
        </RuleWorkTooltip>
    )

}

MatrixButton.propTypes = {
    onClick: PropTypes.func,
};

export default MatrixButton;