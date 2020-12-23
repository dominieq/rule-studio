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
        background: {
            default: "#D3D3D3",
            defaultDark: "#939393",
            defaultLight: "#DBDBDB",
            main1: "#FFF",
            main1Dark: "#B2B2B2",
            main1Light: "#FFF",
            main2: "#1769AA",
            main2Dark: "#104976",
            main2Light: "#4587BB",
            sub: "#2196F3",
            subDark: "#1C7FCF",
            subLight: "#4DABF5"
        },
        text: {
            default: "#2196F3",
            defaultDark: "#1769AA",
            defaultLight: "#4DABF5",
            main1: "#000",
            main1Dark: "#000",
            main1Light: "#333333",
            main2: "#000",
            main2Dark: "#000",
            main2Light: "#333333",
            special1: "#F50057",
            special1Dark: "#AB003C",
            special1Light: "#F73378",
            special2: "#FFF",
            special2Dark: "#B2B2B2",
            special2Light: "#FFF"
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
        background: {
            default: "#2A3439",
            defaultDark: "#1D2427",
            defaultLight: "#545C60",
            main1: "#545F66",
            main1Dark: "#3A4247",
            main1Light: "#767F84",
            main2: "#66FF66",
            main2Dark: "#47B247",
            main2Light: "#84FF84",
            sub: "#ABFAA9",
            subDark: "#6CE06A",
            subLight: "#BBFBBA"
        },
        text: {
            default: "#66FF66",
            defaultDark: "#47B247",
            defaultLight: "#84FF84",
            main1: "#ABFAA9",
            main1Dark: "#6CE06A",
            main1Light: "#BBFBBA",
            main2: "#2A3439",
            main2Dark: "#1D2427",
            main2Light: "#545C60",
            special1: "#E8D963",
            special1Dark: "#A29745",
            special1Light: "#ECE082",
            special2: "#147911",
            special2Dark: "#0E540B",
            special2Light: "#439340"
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