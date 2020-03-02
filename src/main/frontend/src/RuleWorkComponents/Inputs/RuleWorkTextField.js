import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const useStylesTypography = makeStyles({
    root: {
        minWidth: "fit-content",
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
                borderColor: "#66FF66"
            },
            '&.Mui-focused fieldset': {
                borderColor: "#66FF66",
            },
            '&:hover': {
                backgroundColor: "#6BD425"
            },
            '&.Mui-focused': {

                backgroundColor: "#6BD425"
            },
        },
    },
});

function RuleWorkTextField(props) {
    const {label, value, onChange} = props;
    const classesTypography = useStylesTypography();
    const classesOutlinedInput = useStylesOutlinedInput();

    return (
        <Fragment>
            {label ?
                <Typography
                    aria-label={"rule-work-text-field"}
                    classes={{root: classesTypography.root}}
                >
                    {label}
                </Typography>
                :
                null
            }
            <TextField
                fullWidth={true}
                aria-labelledby={"rule-work-text-field"}
                classes={{root: classesOutlinedInput.root}}
                value={value}
                onChange={onChange}
                variant={"outlined"}
                margin={"dense"}
            />
        </Fragment>
    )
}

RuleWorkTextField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

export default RuleWorkTextField;