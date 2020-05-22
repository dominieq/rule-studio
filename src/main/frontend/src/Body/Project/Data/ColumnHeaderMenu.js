import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const menuStyles = makeStyles(theme => ({
  list: {
    backgroundColor: theme.palette.popper.background,
    color: theme.palette.popper.text,
  }  
}));

export default function SimpleMenu(props) {
  const menuClasses = menuStyles();

  const handleClose = (e) => {
    props.handleClose(e.currentTarget.dataset.chosenOption);
  };

  return (
    <div>
      <Menu
        id="simple-menu"
        keepMounted
        open={Boolean(props.event.currentTarget)}
        onClose={handleClose}
        classes={{...menuClasses}}
        anchorPosition={{ top: props.event.clientY, left: props.event.clientX }}
        anchorReference={"anchorPosition"}
      >
        {props.items.map((x,index) => { 
          return <MenuItem key={index} onClick={handleClose} data-chosen-option={x}>{x}</MenuItem>})
        }
      </Menu>
    </div>
  );
}