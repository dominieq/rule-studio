import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

/**
 * It is the notification (rectangle) that appears at the bottom center of the screen.
 * 
 * @function
 * @param {Object} props
 * @param {boolean} props.open - If true the notification will appear on the screen.
 * @param {function} props.closeOpenedNotification - This is the method used to close the notification.
 * @param {string} props.message - This is the html element (mainly text) displayed in the notification.
 * @param {string} props.variant - One of [error, warning, info, success]. This is the variant of the notification, usually recognizable by color (red, orange, blue, green).
 */
export default function CustomizedSnackbars(props) {
  const classes = useStyles();
  const [open] = React.useState(true);

  const handleClose = (event, reason) => {
    return props.closeOpenedNotification(event, reason);
  };
  
  return props.open ? (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={props.variant}>
            {props.message}
        </Alert>
      </Snackbar>
    </div>
  ) : null ;
}