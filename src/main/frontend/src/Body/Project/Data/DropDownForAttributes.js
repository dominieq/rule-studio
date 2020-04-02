import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: "16vw",
  },
  root: {
      '& label': {
        color: 'black',
        backgroundColor: '#ABFAA9',
      },
      '&:hover label': {
          backgroundColor: "#6BD425",
      },
      '& label.Mui-focused': {
        color: 'black',
        backgroundColor: '#66FF66'
      },
    '& .MuiOutlinedInput-root': {
        height: 40,
        backgroundColor: "#ABFAA9",
        '&:hover fieldset': {
            borderColor: "#66FF66",
        },
        '&.Mui-focused fieldset': {
            borderColor: "#66FF66",
        },
        '&:hover': {
            backgroundColor: "#6BD425",
            '& label': {
              backgroundColor: '#ABFAA9'
            }
        },
        '&.Mui-focused': {
            backgroundColor: "#6BD425"
        },
    },
  }, 
}));

export default function SimpleSelect(props) { 
  const [selectedOption, setSelectedOption] = React.useState(props.defaultValue);
  const classes = useStyles();

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => { setLabelWidth(inputLabel.current.offsetWidth); props.getSelected(props.defaultValue); }, []);

  const handleChange = event => {
    setSelectedOption(event.target.value);
    props.getSelected(event.target.value);
  };

  return (
    <Fragment key="dropDownForAttributes">
      <FormControl margin={"dense"} required variant="outlined" className={classNames(classes.formControl, classes.root)}>
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
      
    </Fragment>
  );
}

SimpleSelect.defaultProps = {
  defaultValue: '', 
}