import React, { useEffect } from "react";
import PropTypes from "prop-types";
import CustomTextField from "../../../Utils/Inputs/CustomTextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Magnify from "mdi-material-ui/Magnify";

/**
 * <h3>Overview</h3>
 * The {@link CustomTextField} element with custom styling.
 * When user starts typing a timer is set for 300 milliseconds.
 * When the time is up, <code>onChange</code> function is fired with user's input as argument.
 *
 * @constructor
 * @category Project
 * @subcategory Filtering
 * @param {Object} props
 * @param {Object} props.inputRef - Reference object forwarded to the {@link CustomTextField} element.
 * @param {function} props.onChange - Callback fired when input was changed.
 * @returns {React.ReactElement}
 */
function FilterTextField(props) {
    let timer = null;

    const startTime = (event) => {
        event.persist();

        clearTimeout(timer);
        timer = setTimeout(() => props.onChange(event), 300);
    };

    const startTimeOnFocus = (event) => {
        event.persist();

        if (event.target.value.toString() != null) {
            clearTimeout(timer);
            timer = setTimeout(() => props.onChange(event), 300);
        }
    };

    useEffect(() => {
        return () => {
            clearTimeout(timer);
        };
    });

    return (
        <CustomTextField
            type={"search"}
            placeholder={"Search..."}
            InputProps={{
                startAdornment: (
                    <InputAdornment position={"start"}>
                        <Magnify />
                    </InputAdornment>
                )
            }}
            inputRef={props.inputRef}
            onChange={startTime}
            onFocus={startTimeOnFocus}
        />
    );
}

FilterTextField.propTypes = {
    inputRef: PropTypes.object,
    onChange: PropTypes.func
};

export default FilterTextField;
