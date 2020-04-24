import React, {Fragment} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const labelStyles = makeStyles({
    label: {
        minWidth: "fit-content",
        marginRight: 16
    }
}, {name: "rule-work"});

const inputStyles = makeStyles(theme => ({
    root: {
        height: 40,
        backgroundColor: theme.palette.button.contained.background,
        '& fieldset': {
            borderColor: theme.palette.button.contained.background,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.default
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.default,
        },
        '&:hover': {
            backgroundColor: theme.palette.button.contained.backgroundAction
        },
        '&.Mui-focused': {
            backgroundColor: theme.palette.button.contained.backgroundAction
        },
    },
}), {name: "MuiOutlinedInput"});

const menuStyles = makeStyles(theme => ({
    list: {
        backgroundColor: theme.palette.popper.background,
        color: theme.palette.popper.text,
    }
}), {name: "MuiMenu"});

function RuleWorkTextField(props) {
    const { children, disabledChildren, outsideLabel, select, ...other } = props;
    const { InputProps, OutsideLabelProps, SelectProps } = props;
    const inputClasses = inputStyles();
    const labelClasses = labelStyles();
    const menuClasses = menuStyles();

    const renderMenuItems = () => {
        if (Array.isArray(children) && children.length) {
            if (React.isValidElement(children[0])){
                return children;
            } else {
                return (
                    children.map((option, index) => (
                        <MenuItem
                            key={index}
                            disabled={disabledChildren ? disabledChildren.includes(option) : false}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))
                );
            }
        }
    };

    return (
        <Fragment>
            {outsideLabel &&
                <Typography className={labelClasses.label} {...OutsideLabelProps}>
                    {outsideLabel}
                </Typography>
            }
            <TextField
                InputProps={{
                    ...InputProps,
                    classes: {root: inputClasses.root}
                }}
                select={select}
                SelectProps={{
                    ...SelectProps,
                    MenuProps: {classes: {list: menuClasses.list}}
                }}
                {...other}
            >
                {select && renderMenuItems()}
            </TextField>
        </Fragment>
    )
}

RuleWorkTextField.propTypes = {
    autoComplete: PropTypes.bool,
    autoFocus: PropTypes.bool,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["primary", "secondary"]),
    children: PropTypes.array,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    disabledChildren: PropTypes.array,
    error: PropTypes.bool,
    FormHelperTextProps: PropTypes.object,
    fullWidth: PropTypes.bool,
    helperText: PropTypes.node,
    id: PropTypes.string,
    InputLabelProps: PropTypes.object,
    InputProps: PropTypes.object,
    inputProps: PropTypes.object,
    inputRef: PropTypes.object,
    label: PropTypes.node,
    margin: PropTypes.oneOf(["none", "dense", "normal"]),
    multiline: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    outsideLabel: PropTypes.node,
    OutsideLabelProps: PropTypes.object,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rowsMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    select: PropTypes.bool,
    SelectProps: PropTypes.object,
    size: PropTypes.oneOf(["small", "medium"]),
    type: PropTypes.string,
    value: PropTypes.any,
    variant: PropTypes.oneOf(["standard", "outlined", "filled"]),
};

RuleWorkTextField.defaultProps = {
    margin: "none",
    variant: "outlined",
};

export default RuleWorkTextField;