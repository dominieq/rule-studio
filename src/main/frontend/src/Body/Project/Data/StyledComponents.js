import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import CustomTextField from "../../../Utils/Inputs/CustomTextField";

export const StyledCheckbox = withStyles(theme => ({
    root: {
      color: theme.palette.background.sub,
      '&$checked': {
        color: theme.palette.background.sub,
      },
    },
    checked: {},
  }))((props) => <Checkbox color="default" {...props} />);


export const StyledRadio = withStyles(theme => ({
    root: {
      color: theme.palette.background.sub,
      '&$checked': {
        color: theme.palette.background.sub,
      },
    },
    checked: {},
  }))((props) => <Radio color="default" {...props} />);


export const StyledCustomTextField = withStyles(theme => ({
    root: {
        '& label.MuiInputLabel-shrink': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.background.sub,
            transform: "translate(14px, -12px) scale(0.75)",
            
        },
        '& label.Mui-focused': {
            color: theme.palette.background.subDark
        },
        marginTop: theme.spacing(2)
    },
}))(CustomTextField);

export const StyledDefaultTextField = withStyles(theme => ({
    root: {
        '& label': {
          color: theme.palette.background.sub,
        },
        '& .MuiInputBase-input': {
          color: theme.palette.text.default,
        },
        '& label.MuiInputLabel-shrink': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.background.sub,
        },
        
        '& .MuiInput-underline:before': {
          borderBottomColor: theme.palette.background.sub,
        },
       
        '& .MuiInput-underline:after': {
          borderBottomColor: theme.palette.background.subDark,
        },
        '& label.Mui-focused': {
            color: theme.palette.background.subDark
        },
    },
  }))(TextField);