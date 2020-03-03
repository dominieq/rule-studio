import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {useOutlinedInputStyles} from "./MakeOutlinedInputStyles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const useStylesTypography = makeStyles({
    root: {
        minWidth: "fit-content",
        marginRight: "15px",
    },
});

function StyledTypography(props) {
    const {label, labelSize} = props;
    const classes = useStylesTypography();

    return (
        {
            "none": null,
            "small": <Typography classes={{root: classes.root}} variant={"subtitle2"}>
                {label}
            </Typography>,
            "default": <Typography classes={{root: classes.root}}>
                {label}
            </Typography>,
            "big": <Typography classes={{root: classes.root}} variant={"h6"}>
                {label}
            </Typography>
        }[labelSize]
    )
}

function RuleWorkTextField(props) {
    const {label, labelSize, ...other} = props;
    const classes = useOutlinedInputStyles();

    return (
        <Fragment>
            <StyledTypography
                label={label}
                labelSize={labelSize}
            />
            <TextField
                aria-labelledby={"rule-work-text-field"}
                classes={{root: classes.root}}
                fullWidth={true}
                margin={"dense"}
                variant={"outlined"}
                {...other}

            />
        </Fragment>
    )
}

RuleWorkTextField.propTypes = {
    label: PropTypes.string,
    labelSize: PropTypes.oneOf(["none", "small", "default", "big"]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

RuleWorkTextField.defaultProps = {
    labelSize: "default",
};

export default RuleWorkTextField;