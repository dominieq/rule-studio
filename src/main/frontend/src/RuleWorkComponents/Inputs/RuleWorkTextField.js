import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const useStylesTypography = makeStyles({
    root: {
        marginRight: "15px",
    },
});

const useStylesOutlinedInput = makeStyles({
    root: {
        '& .MuiOutlinedInput-root': {
            backgroundColor: "#ABFAA9",
            '& fieldset': {
                borderColor: "#ABFAA9",
            },
            '&:hover fieldset': {
                borderColor: "#6BD425"
            },
            '&.Mui-focused fieldset': {
                borderColor: "#6BD425",
            },
            '&:hover': {
                backgroundColor: "#66FF66"
            },
            '&.Mui-focused': {

                backgroundColor: "#66FF66"
            },
        },
    },
});

function RuleWorkTextField(props) {
    const {label, defaultValue, onChange} = props;
    const classesTypography = useStylesTypography();
    const classesOutlinedInput = useStylesOutlinedInput();

    return (
        <Fragment>
            <Typography
                aria-label={"rule-work-text-field"}
                classes={{root: classesTypography.root}}
            >
                {label}
            </Typography>
            <TextField
                aria-labelledby={"rule-work-text-field"}
                classes={{root: classesOutlinedInput.root}}
                defaultValue={defaultValue}
                onChange={onChange}
                variant={"outlined"}
                margin={"dense"}
            />
        </Fragment>
    )
}

RuleWorkTextField.propTypes = {
    label: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

RuleWorkTextField.defaultProps = {
    label: "Rule work textfield",
    defaultValue: "",
    onChange: event => console.log(event.target.value),
};

export default RuleWorkTextField;