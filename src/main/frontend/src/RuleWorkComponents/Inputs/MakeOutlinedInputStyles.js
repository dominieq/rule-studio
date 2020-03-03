import {makeStyles} from "@material-ui/core/styles";

export const useOutlinedInputStyles = makeStyles({
    root: {
        '& .MuiOutlinedInput-root': {
            height: 40,
            backgroundColor: "#ABFAA9",
            '& fieldset': {
                borderColor: "#ABFAA9",
            },
            '&:hover fieldset': {
                borderColor: "#66FF66"
            },
            '&.Mui-focused fieldset': {
                borderColor: "#66FF66",
            },
            '&:hover': {
                backgroundColor: "#6BD425"
            },
            '&.Mui-focused': {

                backgroundColor: "#6BD425"
            },
        },
    },
}, {name: "MuiFormControl"});