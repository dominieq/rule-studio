import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./RuleWorkLoadingIcon.css";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  colorPrimary: {
    color: theme.palette.text.default,
  }  
}));

export default function RuleWorkLoadingIcon(props) {
  const classes = useStyles();
    return (
    <div className="RuleWorkLoadingIcon">      
      <CircularProgress classes={{...classes}} size={props.size} thickness={props.thickness}/>
    </div>
  );
}

RuleWorkLoadingIcon.defaultProps = {
    color: 'primary',
    size: 40,
    thickness: 3.6
}