import {createMuiTheme} from "@material-ui/core/styles";

const typography = {
    typography: {
        subheader: {
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.05rem",
            textTransform: "uppercase",
        },
    }
};

export const LightTheme = createMuiTheme( {
    ...typography,
    palette: {
        appbar: {
            background:"#1769AA",
            text: "#FFF"
        },
        background: {
            default: "#D3D3D3",
            defaultDark: "#939393",
            defaultLight: "#DBDBDB",
            main: "#FFF",
            mainDark: "#B2B2B2",
            mainLight: "#FFF",
            sub: "#2196F3",
            subDark: "#1769AA", // TODO change color
            subLight: "#4DABF5",
            special: "#1769AA",
            specialDark: "#104976",
            specialLight: "#4587BB"
        },
        button: {
            primary: "#2196f3",
            secondary: "#f50057",
            contained: {
                background: "#2196F3",
                backgroundAction: "#1769AA",
                text: "#000",
            }
        },
        chip: {
            background: "#1769AA",
            text: "#FFF",
        },
        list: {
            background: "#FFF",
            text: "#000",
            subheader: {
                background: "#4DABF5",
                text: "#FFF"
            }
        },
        paper: {
            background: "#FFF",
            text: "#000",
        },
        popper: {
            background: "#4DABF5",
            text: "#000",
        },
        slider: {
            main: "#4DABF5",
            rail: "#F5F5F5"
        },
        tab: {
            background: "#FFF",
            backgroundAction: "#E8E8E8",
            text: "#000",
            textAction: "#000",
            textIdle: "#000",
        },
        text: {
            default: "#000",
            defaultDark: "#000",
            defaultLight: "#333333",
            main: "#2196F3",
            mainDark: "#1769AA",
            mainLight: "#4DABF5",
            sub: "#FFF",
            subDark: "#B2B2B2",
            subLight: "#FFF",
            special: "#F50057",
            specialDark: "#AB003C",
            specialLight: "#F73378"
        },
        reactDataGrid: {
            cell: {
                backgroundColor: "#FFFFFF",
                color: "rgb(0,0,0, 0.8)",/* #66FF66 */
                borderRight: "1px solid #EEEEEE",
                borderBottom: "1px solid #DDDDDD",
            },
            headerCell: {
                backgroundColor: "#FFFFFF",
                borderRight: "1px solid #EEEEEE",
                borderBottom: "1px solid #DDDDDD",
            },
            rowHover: {
                backgroundColor: "#F0F0F0"
            },
            rowMarked: {
                backgroundColor: "#DBECFA"
            },
            cellDragging: {
                background: "rgba(102,175,233,0.4) !important" /* #66FF66 */
            },
            cellSelected: {
                border: "2px solid #66AFE9",
                squareDragHandle: {
                    background: "#66AFE9",
                    onHover: {
                        border: "1px solid white",
                    }
                }
            },
            cellEditor: {
                simple: {
                    backgroundColor: "#EEEEEE !important",
                    color: "black !important"
                },
                dropDown: {
                    backgroundColor: "#EEEEEE !important",
                    color: "black !important"
                },
                outline: {
                    border: "2px solid #66AFE9 !important"
                }
            },
            checkbox: {
                deselected: {
                    background: "#FFF",
                    boxShadow: "inset 0px 0px 0px 4px #DDD"
                },
                selected: {
                    background: "#005295",
                    border: "2px solid #FFF"
                }
            },
            search: {
                backgroundColor: "#FFF",
                color: "#495057",
                focused: {
                    color: "#495057 !important",
                    backgroundColor: "#FFF !important",
                    borderColor: "#80BDFF !important"
                },
                placeholder: {
                    color: "#7D828C !important", /* Chrome, Firefox, Safari */
                    opacity: "1 !important" /* Firefox */
                }
            },
            contextMenu: {
                backgroundColor: "#2196F3",
                border: "1px solid rgba(0,0,0,.15)",
                hover: {
                    color: "#000000",
                    backgroundColor: "#20A0FF"
                }
            }
        }
    },
});

export const DarkTheme = createMuiTheme({
    ...typography,
    palette: {
        appbar: {
            background: "#66FF66",
            text: "#2A3439"
        },
        background: {
            default: "#2A3439",
            defaultDark: "#1D2427",
            defaultLight: "#545C60",
            main: "#545F66",
            mainDark: "#3A4247",
            mainLight: "#767F84",
            sub: "#ABFAA9",
            subDark: "#6CE06A", // "#77AF76",
            subLight: "#BBFBBA",
            special: "#66FF66",
            specialDark: "#47B247",
            specialLight: "#84FF84"
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
            default: "#ABFAA9",
            defaultDark: "#6CE06A", //"#77AF76",
            defaultLight: "#BBFBBA",
            main: "#66FF66",
            mainDark: "#47B247",
            mainLight: "#84FF84",
            sub: "#2A3439",
            subDark: "#1D2427",
            subLight: "#545C60",
            special: "#E8D963",
            specialDark: "#A29745",
            specialLight: "#ECE082"
        },
        reactDataGrid: {
            cell: {
                backgroundColor: "#2A3439",
                color: "rgb(102,255,102, 0.8)", /* #66FF66 */
                borderRight: "1px solid rgb(102,255,102, 0.4)",
                borderBottom: "1px solid rgb(102,255,102, 0.4)"
            },
            headerCell: {
                backgroundColor: "#2A3439",
                borderRight: "1px solid rgb(102,255,102, 0.4)",
                borderBottom: "1px solid rgb(102,255,102, 0.4)"
            },
            rowHover: {
                backgroundColor: "#545F66"
            },
            rowMarked: {
                backgroundColor: "rgb(58, 79, 90)"
            },
            cellDragging: {
                background: "rgba(102,255,102,0.4) !important"
            },
            cellSelected: {
                border: "2px solid #66FF66",
                squareDragHandle: {
                    background: "#66FF66",
                    onHover: {
                        border: "1px solid white"
                    }
                }
            },
            cellEditor: {
                simple: {
                    backgroundColor: "rgb(58, 79, 90) !important",
                    color: "#66FF66 !important"
                },
                dropDown: {
                    backgroundColor: "rgb(58, 79, 90) !important",
                    color: "#66FF66 !important"
                },
                outline: {
                    border: "2px solid #66FF66 !important"
                }
            },
            checkbox: {
                deselected: {
                    background: "#2A3439",
                    border: "2px solid #DDDDDD",
                },
                selected: {
                    background: "#ABFAA9",
                    boxShadow: "inset 0px 0px 0px 4px rgb(58, 79, 90)"
                }
            },
            search: {
                backgroundColor: "#2A3439",
                color: "rgb(102,255,102, 0.8)",
                focused: {
                    color: "#66FF66 !important",
                    backgroundColor: "rgb(58, 79, 90) !important",
                    borderColor: "#66FF66 !important"
                },
                placeholder: {
                    color: "rgb(102,255,102, 0.6) !important", /* Chrome, Firefox, Safari */
                    opacity: "1 !important" /* Firefox */
                }
            },
            contextMenu: {
                backgroundColor: "rgb(171,250,169)",
                border: "1px solid rgb(94, 255, 0)",
                hover: {
                    color: "#000000",
                    backgroundColor: "rgb(158,230,156)"
                }
            }
        }
    },
});