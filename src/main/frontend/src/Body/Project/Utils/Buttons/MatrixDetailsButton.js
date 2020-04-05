import React from "react";
import PropTypes from "prop-types";
import RuleWorkTooltip from "../../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import StyledButton from "../../../../RuleWorkComponents/Inputs/StyledButton";
import TableSettings from "mdi-material-ui/TableSettings";

function MatrixDetailsButton(props) {
    const { title, ...other } = props;
    return (
        <RuleWorkTooltip id={"matrix-details-button"} title={title}>
            <StyledButton
                aria-label={"matrix-details-button"}
                isIcon={true}
                themeVariant={"secondary"}
                {...other}
            >
                <TableSettings />
            </StyledButton>
        </RuleWorkTooltip>
    )
}

MatrixDetailsButton.propTypes = {
    onClick: PropTypes.func,
    title: PropTypes.string.isRequired,
};

export default MatrixDetailsButton;