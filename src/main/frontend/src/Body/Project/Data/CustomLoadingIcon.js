import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./CustomLoadingIcon.css";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  colorPrimary: {
    color: theme.palette.text.default,
  }  
}));

/**
 * It is responsible for the loading circle icon
 * 
 * @function
 * @param {Object} props
 * @param {Number} props.size - The size of the circle (usually stays default)
 * @param {Number} props.thickness - The thickness of the circle (usually stays default)
 */
export default function CustomLoadingIcon(props) {
  const classes = useStyles();
    return (
    <div className="CustomLoadingIcon">      
      <CircularProgress classes={{...classes}} size={props.size} thickness={props.thickness}/>
    </div>
  );
}

CustomLoadingIcon.defaultProps = {
    color: 'primary',
    size: 40,
    thickness: 3.6
}