import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 210,
  }
  
}));

export default function SimpleSelect(props) { 
  const [selectedOption, setSelectedOption] = React.useState(props.defaultValue);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => { setLabelWidth(inputLabel.current.offsetWidth); props.getSelected(props.defaultValue); }, []);

  const handleChange = event => {
    setSelectedOption(event.target.value);
    props.getSelected(event.target.value);
  };

  return (
    <div>
      <FormControl required variant="outlined" className={useStyles().formControl}>
        <InputLabel ref={inputLabel} id="dialog-dropdown">
          {props.displayName}
        </InputLabel>
        <Select
          labelId="dialog-dropdown"
          id={props.name}  
          value={selectedOption}
          onChange={handleChange}
          labelWidth={labelWidth}
        >
        {props.items.map((x,index) => { return <MenuItem key={index} value={x}>{x}</MenuItem>})}
        </Select>
      </FormControl>
      
    </div>
  );
}

SimpleSelect.defaultProps = {
  defaultValue: '', 
}