import React from "react";
import PropTypes from "prop-types";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Magnify from "mdi-material-ui/Magnify";

function FilterTextField(props) {
    return (
        <RuleWorkTextField
            type={"search"}
            placeholder={"Search..."}
            InputProps={{
                startAdornment: (
                    <InputAdornment position={"start"}>
                        <Magnify />
                    </InputAdornment>
                )
            }}
            {...props}
        />
    )
}

FilterTextField.propTypes = {
    onChange: PropTypes.func,
};

export default FilterTextField;