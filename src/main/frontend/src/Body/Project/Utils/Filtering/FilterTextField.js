import React, {useEffect} from "react";
import PropTypes from "prop-types";
import RuleWorkTextField from "../../../../Utils/Inputs/RuleWorkTextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Magnify from "mdi-material-ui/Magnify";

function FilterTextField(props) {
    let timer = null;

    const startTime = (event) => {
        event.persist();

        clearTimeout(timer)
        timer = setTimeout(() => props.onChange(event), 300);
    };

    useEffect(() => {
        return () => {
            clearTimeout(timer)
        }
    });

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
            onChange={startTime}
        />
    )
}

FilterTextField.propTypes = {
    onChange: PropTypes.func,
};

export default FilterTextField;