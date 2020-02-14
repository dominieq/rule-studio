import React from 'react';
import './EditDataButtons.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
}));

export default function IconLabelButtons(props) {
    const classes = useStyles();

    return (
      <div className="left-aligned">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={() => props.insertRow(0,0)}
        >
          Add new example
        </Button>

        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<DeleteIcon />}
          onClick={() => props.deleteRow()}
        >
          Delete Selected
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<SaveIcon />}
          onClick={() => props.sendModifiedDataToServer()}
        >
          Save changes
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<SaveAltIcon />}
          onClick={() => props.saveFileLocally()}
        >
          Save file locally
        </Button>
       
      </div>
    );
}