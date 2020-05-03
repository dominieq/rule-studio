import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import RuleWorkTextField from "../../../Utils/Inputs/RuleWorkTextField";

export const StyledCheckbox = withStyles(theme => ({
    root: {
      color: theme.palette.button.primary,
      '&$checked': {
        color: theme.palette.button.primary,
      },
    },
    checked: {},
  }))((props) => <Checkbox color="default" {...props} />);


export const StyledRadio = withStyles(theme => ({
    root: {
      color: theme.palette.button.primary,
      '&$checked': {
        color: theme.palette.button.primary,
      },
    },
    checked: {},
  }))((props) => <Radio color="default" {...props} />);


export const StyledRuleWorkTextField = withStyles(theme => ({
    root: {
        '& label.MuiInputLabel-shrink': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.button.contained.background,
            transform: "translate(14px, -12px) scale(0.75)",
            
        },
        '& label.Mui-focused': {
            color: theme.palette.button.contained.backgroundAction
        },
        marginTop: theme.spacing(2)
    },
}))(RuleWorkTextField);

export const StyledDefaultTextField = withStyles(theme => ({
    root: {
        '& label': {
          color: theme.palette.button.contained.background,
        },
        '& .MuiInputBase-input': {
          color: theme.palette.text.default,
        },
        '& label.MuiInputLabel-shrink': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.button.contained.background,            
        },
        
        '& .MuiInput-underline:before': {
          borderBottomColor: theme.palette.button.contained.background,
        },
       
        '& .MuiInput-underline:after': {
          borderBottomColor: theme.palette.button.contained.backgroundAction,
        },
        '& label.Mui-focused': {
            color: theme.palette.button.contained.backgroundAction
        },
    },
  }))(TextField);