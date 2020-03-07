import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {useOutlinedInputStyles} from "./MakeOutlinedInputStyles";
import StyledTypography from "../DataDisplay/StyledTypography";
import TextField from "@material-ui/core/TextField";

function RuleWorkTextField(props) {
    const {children, childVariant, ...other} = props;
    const classes = useOutlinedInputStyles();

    return (
        <Fragment>
            {children ?
                <StyledTypography styleVariant={"label"} variant={childVariant}>
                    {children}
                </StyledTypography>
                :
                null
            }
            <TextField
                classes={{root: classes.root}}
                margin={"dense"}
                variant={"outlined"}
                {...other}
            />
        </Fragment>
    )
}

RuleWorkTextField.propTypes = {
    children: PropTypes.node,
    childVariant: PropTypes.string,
};

RuleWorkTextField.defaultProps = {
    childVariant: "body1",
};

export default RuleWorkTextField;