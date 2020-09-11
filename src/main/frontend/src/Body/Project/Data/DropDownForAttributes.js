import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CustomTooltip from '../../../Utils/DataDisplay/CustomTooltip';
import clsx from "clsx";

const tooltip = {
  mv15: <p style={{textAlign: "justify"}}>
          <b> mv<sub>1.5</sub> </b> – when comparing two evaluations with respect to the attribute, <b> the following relations hold: </b> <br/>
          <b>{"? \u2ab0 x, ? \u2ab0 ?,"}</b> <br/>
          <b>{"? \u2aaf x, ? \u2aaf ?."}</b> 
        </p>,
  mv2:  <p style={{textAlign: "justify"}}>
          <b> mv<sub>2</sub> </b> – when comparing two evaluations with respect to the attribute, <b> apart from the relations of mv<sub>1.5</sub>,</b> also <b> the following relations hold: </b> <br/>
          <b>{"x \u2ab0 ?,"}</b> <br/>
          <b>{"x \u2aaf ?."}</b> 
        </p>
};

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(2)
  },
  root: {
    backgroundColor: theme.palette.background.sub,
    '& fieldset': {
        borderColor: theme.palette.background.sub,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.text.default
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.text.default,
    },
    '&:hover': {
        backgroundColor: theme.palette.background.subDark
    },
    '&.Mui-focused': {
        backgroundColor: theme.palette.background.subDark
    },
    '& label.MuiInputLabel-shrink': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.background.sub,
      transform: "translate(14px, -13px) scale(0.75)",
    },
    '& label.Mui-focused': {
        color: theme.palette.background.subDark
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor:  theme.palette.text.default
    },
    borderRadius: "4px"
  },
}));

const menuStyles = makeStyles(theme => ({
  list: {
    backgroundColor: theme.palette.background.sub,
    color: theme.palette.text.main2,
  }
}), {name: "CustomMenu"});

export default function DropDownForAttributes(props) { 
  const { defaultValue, defaultWidth, displayName, getSelected, items, missingVal, name } = props;

  const [selectedOption, setSelectedOption] = React.useState(defaultValue);
  const classes = useStyles();
  const menuClasses = menuStyles();

  React.useEffect(() => { 
      if(defaultValue === selectedOption) {
        getSelected(defaultValue); 
      }
  }, [defaultValue, getSelected, selectedOption]);

  const handleChange = (event) => {
    if(selectedOption !== event.target.value) {
      setSelectedOption(event.target.value);
      getSelected(event.target.value);
    }
  };

  return (
    <Fragment key="dropDownForAttributes">
      <FormControl margin={"dense"} required variant="outlined" style={{minWidth: defaultWidth}} className={clsx(classes.formControl, classes.root)}>
        <InputLabel id="dialog-dropdown">
          {displayName}
        </InputLabel>
        <Select
          labelId="dialog-dropdown"
          id={name}  
          value={selectedOption}
          onChange={handleChange}
          MenuProps={{classes: {list: menuClasses.list}}}
        >
        {items.map((x,index) => { 
          if(missingVal) {
            if(x === "1.5") return <MenuItem style={{display: "inherit"}} key={index} value={`mv${x}`}> <CustomTooltip arrow={true} disableGpu={true} placement={'right-end'} title={tooltip.mv15}>mv<sub>{x}</sub></CustomTooltip></MenuItem>
            else return <MenuItem style={{display: "inherit"}} key={index} value={`mv${x}`}> <CustomTooltip arrow={true} disableGpu={true} placement={'right-end'} title={tooltip.mv2}>mv<sub>{x}</sub></CustomTooltip></MenuItem>
          }
          return <MenuItem key={index} value={x}>{x}</MenuItem>
          })}
        </Select>
      </FormControl>
      
    </Fragment>
  );
}

DropDownForAttributes.defaultProps = {
  defaultValue: '', 
  defaultWidth: "100%"
}