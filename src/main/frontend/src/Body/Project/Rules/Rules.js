import React, {Component} from 'react';
import PropTypes from "prop-types";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer";
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkTooltip from "../../../RuleWorkComponents/Inputs/RuleWorkTooltip";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import SvgIcon from "@material-ui/core/SvgIcon";
import Calculator from "mdi-material-ui/Calculator";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import FilePlus from "mdi-material-ui/FilePlus";
import {mdiCloseThick, mdiCog} from "@mdi/js";
import ThresholdSelector from "../ProjectTabsUtils/ThresholdSelector";
import MeasureSelector from "../ProjectTabsUtils/MeasureSelector";

class Rules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            displayedData: [],
            threshold: 0.0,
            measure: "epsilon",
            openSettings: false,
            snackbarProps: {
                open: false,
                message: "",
                variant: "info",
            },
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        const project = this.props.project;

        this.setState({
            loading: true,
        }, () => {
            fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
                method: "GET",
            }).then(response => {
                return response.json();
            }).then(result => {
                console.log(result);

                const items = this.getItems(result);

                this.setState({
                    loading: false,
                    data: items,
                    displayedData: items,
                });
            }).catch(error => {
                this.setState({
                    loading: false,
                    snackbarProps: {
                        open: true,
                        message: "Server error. Couldn't load rules",
                        variant: "error",
                    },
                }, () => {
                    console.log(error);
                });
            });
        });
    }

    onSettingsClick = () => {
        this.setState(prevState => ({
            openSettings: !prevState.openSettings,
        }));
    };

    onSettingsClose = () => {
        this.setState({
            openSettings: false,
        });
    };

    onThresholdChange = (threshold) => {
        this.setState({
            threshold: threshold,
        });
    };

    onMeasureChange = (event) => {
        this.setState({
            measure: event.target.value,
        });
    };

    onCalculateClick = () => {
        this.setState({
            loading: true,
        }, () => {
            const project = this.props.project;

            fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
                method: "PUT",
            }).then(response => {
                return response.json();
            }).then(result => {
                console.log(result);

                const items = this.getItems(result);

                this.setState({
                    loading: false,
                    data: items,
                    displayedData: items,
                });
            }).catch(error => {
                this.setState({
                    loading: false,
                    snackbarProps: {
                        open: true,
                        message: "Server error. Couldn't calculate rules!",
                        variant: "error",
                    },
                }, () => {
                    console.log(error);
                });
            });
        });
    };

    onUploadFileChanged = (event) => {
        const file = event.target.files[0];
        console.log("Uploading file..." + file.name);
    };

    onSaveFileClick = () => {
        console.log("Saving file...");
    };

    onNewFileClick = () => {
        console.log("Creating new file...");
    };

    onSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            snackbarProps: {
                open: false,
                message: "",
                variant: "info",
            },
        });
    };


    getItems = (data) => {
        let items = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const id = i.toString();
                const name = data[i].rule.toString;
                const traits = data[i].ruleCharacteristics;
                const tables = {
                    indicesOfPositiveObjects: data[i].ruleCoverageInformation.indicesOfPositiveObjects,
                    indicesOfNeutralObjects: data[i].ruleCoverageInformation.indicesOfNeutralObjects,
                    indicesOfCoveredObjects: data[i].ruleCoverageInformation.indicesOfCoveredObjects,
                    decisionsOfCoveredObjects: data[i].ruleCoverageInformation.decisionsOfCoveredObjects,
                };

                const item = new Item(id, name, traits, null, tables);
                items = [...items, item];
            }
        }
        return items;
    };

    render() {
        const {loading, displayedData, measure, openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-rules"} styleVariant={"tab"}>
                <StyledPaper
                    id={"rules-bar"}
                    paperRef={this.upperBar}
                    styleVariant={"bar"}
                    square={true}
                    variant={"outlined"}
                >
                    <RuleWorkTooltip title={"Click to choose consistency & measure"}>
                        <StyledButton
                            aria-label={"rules-settings-button"}
                            isIcon={true}
                            onClick={this.onSettingsClick}
                            themeVariant={"primary"}
                            variant={"contained"}
                        >
                            <SvgIcon><path d={mdiCog} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <StyledButton
                        aria-label={"rules-calculate-button"}
                        disabled={!this.props.project || loading}
                        disableElevation={true}
                        onClick={this.onCalculateClick}
                        startIcon={<Calculator />}
                        themeVariant={"primary"}
                        variant={"contained"}
                    >
                        Calculate
                    </StyledButton>
                    <StyledDivider />
                    <RuleWorkTooltip title={"Upload file"}>
                        <RuleWorkUpload
                            accept={".json"}
                            id={"rules-upload-button"}
                            onChange={this.onUploadFileChanged}
                        >
                            <StyledButton
                                aria-label={"rules-upload-button"}
                                isIcon={true}
                                component={"span"}
                            >
                                <CloudUploadIcon />
                            </StyledButton>
                        </RuleWorkUpload>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={"Save file"}>
                        <StyledButton
                            aria-label={"rules-save-button"}
                            isIcon={true}
                            onClick={this.onSaveFileClick}
                        >
                            <SaveIcon />
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkTooltip title={"New file"}>
                        <StyledButton
                            aria-label={"rules-new-button"}
                            isIcon={true}
                            onClick={this.onNewFileClick}
                        >
                            <FilePlus />
                        </StyledButton>
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                </StyledPaper>
                <RuleWorkDrawer
                    height={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                    id={"rules-settings-drawer"}
                    open={openSettings}
                >
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"rules-measure-selector"}>
                        <MeasureSelector
                            onChange={this.onMeasureChange}
                            value={measure}
                        />
                    </RuleWorkSmallBox>
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"rules-threshold-selector"}>
                        <ThresholdSelector
                            onChange={this.onThresholdChange}
                        />
                    </RuleWorkSmallBox>
                    <RuleWorkSmallBox id={"rules-settings-footer"} styleVariant={"footer"}>
                        <StyledButton
                            aria-label={"rules-close-settings-button"}
                            isIcon={true}
                            onClick={this.onSettingsClose}
                            themeVariant={"secondary"}
                        >
                            <SvgIcon><path d={mdiCloseThick} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkSmallBox>
                </RuleWorkDrawer>
                <RuleWorkBox id={"rules-body"} styleVariant={"tab-body"}>
                    {loading ?
                        <StyledCircularProgress />
                        :
                        <RuleWorkList>
                            {displayedData}
                        </RuleWorkList>
                    }
                </RuleWorkBox>
                <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        )
    }
}

Rules.propTypes = {
    changed: PropTypes.array,
    project: PropTypes.object.isRequired,
    updateProject: PropTypes.func,
    value: PropTypes.number,
};

export default Rules;