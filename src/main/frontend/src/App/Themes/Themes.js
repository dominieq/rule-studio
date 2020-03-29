import {createMuiTheme} from "@material-ui/core/styles";

export const LightTheme = createMuiTheme({
    palette: {
        appbar: {
            background:"#98FB98",
            text: "#2A3439"
        },
        background: {
            default: "#F0FFF0",
        },
        button: {
            primary: "#2A3439",
            secondary: "#FB9898",
            contained: {
                background: "#A6E6A8",
                backgroundAction: "#6ACC6E",
                text: "#2A3439",
            }
        },
        chip: {
            background: "#32CD32",
            text: "#2A3439",
        },
        list: {
            background: "#ABFAA9",
            text: "#2A3439",
            subheader: {
                background: "#545F66",
                text: "#ABFAA9"
            }
        },
        paper: {
            background: "#98FB98",
            text: "#2A3439",
        },
        popper: {
            background: "#98FB98",
            text: "#2A3439",
        },
        slider: {
            main: "#ABFAA9",
            rail: "#2A3439"
        },
        tab: {
            background: "#98FB98",
            backgroundAction: "rgb(102,255,102, 0.3)",
            text: "#2A3439",
            textAction: "rgb(84,95,102, 0.8)",
            textIdle: "#2A3439",
        },
        text: {
            default: "#545F66",
        },
    },
});

export const DarkTheme = createMuiTheme({
    palette: {
        appbar: {
            background: "#66FF66",
            text: "#2A3439"
        },
        background: {
            default: "#2A3439",
        },
        button: {
            primary: "#ABFAA9",
            secondary: "#E8D963",
            contained: {
                background: "#ABFAA9",
                backgroundAction: "#6CE06A",
                text: "#2A3439",
            }
        },
        chip: {
            background: "#6BD425",
            text: "#2A3439",
        },
        list: {
            background: "#545F66",
            text: "#ABFAA9",
            subheader: {
                background: "#ABFAA9",
                text: "#147911"
            }
        },
        paper: {
            background: "#545F66",
            text: "#ABFAA9",
        },
        popper: {
            background: "#ABFAA9",
            text: "#2A3439"
        },
        slider: {
            main: "#66FF66",
            rail: "#2A3439"
        },
        tab: {
            background: "#545F66",
            backgroundAction: "rgb(84,95,102, 0.8)",
            text: "#66FF66",
            textAction: "rgb(102,255,102, 0.8)",
            textIdle: "rgb(102,255,102, 0.4)"
        },
        text: {
            default: "#66FF66",
        },
    },
});