import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const menuStyles = makeStyles(theme => ({
  list: {
    backgroundColor: theme.palette.background.sub,
    color: theme.palette.text.main2,
  }  
}));

/**
 * Displays right click column header menu with available options
 * 
 * @class
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props
 * @param {Array} props.items - These are options that are available to choose in the menu.
 * @param {function} props.handleClose - Method runs after selecting the option from the menu. 
 * @param {Object} props.event - Represents an event that takes place in DOM tree.
 * @returns {React.ReactElement}
 * It is used to set the top left corner of the menu in the right place.
 */
export default function ColumnHeaderMenu(props) {
  const menuClasses = menuStyles();

  const handleClose = (e) => {
    props.handleClose(e.currentTarget.dataset.chosenOption);
  };

  return (
    <div>
      <Menu
        id="column-header-menu"
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