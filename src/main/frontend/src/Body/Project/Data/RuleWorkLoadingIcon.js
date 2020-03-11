import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./RuleWorkLoadingIcon.css";

export default function RuleWorkLoadingIcon(props) {
    return (
    <div className="RuleWorkLoadingIcon">      
      <CircularProgress color={props.color} size={props.size} thickness={props.thickness}/>
    </div>
  );
}

RuleWorkLoadingIcon.defaultProps = {
    color: 'primary',
    size: 40,
    thickness: 3.6
}