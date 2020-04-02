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
                backgroundColor: "#FFF",
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