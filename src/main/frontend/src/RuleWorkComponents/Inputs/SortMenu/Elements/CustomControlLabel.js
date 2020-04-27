import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const CustomControlLabel = withStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "space-between",
        marginLeft: 0,
        marginRight: 0,
        '&:hover': {
            color: theme.palette.button.contained.backgroundAction
        }
    }
}), {name: "CustomControlLabel"})(props => (
    <FormControlLabel labelPlacement={"start"} {...props} />
));

export default CustomControlLabel;
