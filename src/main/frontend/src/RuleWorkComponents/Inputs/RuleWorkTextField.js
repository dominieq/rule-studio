import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import StyledTypography from "../DataDisplay/StyledTypography";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
    root: {
        '& .MuiOutlinedInput-root': {
            height: 40,
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
}, {name: "MuiFormControl"});

function RuleWorkTextField(props) {
    const {children, disabledChildren, hasOutsideLabel, outsideLabel, outsideLabelProps, select, ...other} = props;
    const classes = useStyles();

    return (
        <Fragment>
            {hasOutsideLabel ?
                <StyledTypography {...outsideLabelProps}>
                    {outsideLabel}
                </StyledTypography>
                :
                null
            }
            <TextField classes={{root: classes.root}} select={select} {...other}>
                {select ?
                    children.map((option, index) => (
                        <MenuItem
                            key={index}
                            disabled={disabledChildren ? disabledChildren.includes(option) : false}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))
                    :
                    null
                }
            </TextField>
        </Fragment>
    )
}

RuleWorkTextField.propTypes = {
    children: PropTypes.array,
    disabledChildren: PropTypes.array,
    hasOutsideLabel: PropTypes.bool,
    margin: PropTypes.oneOf(["none", "dense", "normal"]),
    outsideLabel: PropTypes.node,
    outsideLabelProps: PropTypes.shape({
        styleVariant: PropTypes.oneOf(["label"]),
        variant: PropTypes.string,
    }),
    select: PropTypes.bool,
    variant: PropTypes.oneOf(["standard", "outlined", "filled"]),
};

RuleWorkTextField.defaultProps = {
    hasOutsideLabel: false,
    margin: "none",
    outsideLabelProps: {
        styleVariant: "label",
        variant: "body1"
    },
    select: false,
    variant: "outlined",
};

export default RuleWorkTextField;