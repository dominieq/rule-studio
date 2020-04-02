import React from "react";
import { withStyles } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";

const SimpleContent = withStyles(theme=> ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    dividers: {
        borderTopColor: theme.palette.text.default,
        borderBottomColor: theme.palette.text.default,
    }
}),{name: "MuiDialogContent"})(props => (
    <DialogContent dividers={true} {...props} />
));

export default SimpleContent;