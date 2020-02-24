import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function SimpleMenu(props) {
  const handleClose = (e) => {
    props.handleClose(e.currentTarget.dataset.chosenOption);
  };

  return (
    <div>
      <Menu
        id="simple-menu"
        anchorEl={props.anchorEl}
        keepMounted
        open={Boolean(props.anchorEl)}
        onClose={handleClose}
       
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        getContentAnchorEl={null}
      >
        {props.items.map((x,index) => { 
          return <MenuItem key={index} onClick={handleClose} data-chosen-option={x}>{x}</MenuItem>})
        }
      </Menu>
    </div>
  );
}