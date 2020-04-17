import { makeStyles } from "@material-ui/core/styles";

const calculationStyles = {
    drawerRow: {
        alignItems: "center",
        display: "flex",
        margin: "4px 0",
        overflow: "hidden"
    },
    inputElement: {
        flexGrow: 1,
        margin: 0
    }
};

export default makeStyles(calculationStyles, {name: "calculations"})