import React, {Component} from 'react';
import PropTypes from "prop-types";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkButton from "../../../RuleWorkComponents/Inputs/RuleWorkButton";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar"
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import FilePlus from "mdi-material-ui/FilePlus";
import Divider from "@material-ui/core/Divider";

class Rules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            displayedData: [],
            snackbarProps: {
                open: false,
                message: "",
                variant: "info",
            },
        };
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
        const {loading, displayedData, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-rules"} styleVariant={"tab"}>
                <StyledPaper id={"rules-bar"} styleVariant={"bar"} square={true} variant={"outlined"}>
                    <RuleWorkButton
                        accept={".json"}
                        ariaLabel={"rules-upload-button"}
                        buttonVariant={"icon"}
                        isUpload={true}
                        onClick={this.onUploadFileChanged}
                        title={"Upload file"}
                    >
                        <CloudUploadIcon />
                    </RuleWorkButton>
                    <Divider orientation={"vertical"} flexItem={true}/>
                    <RuleWorkButton
                        ariaLabel={"rules-save-button"}
                        buttonVariant={"icon"}
                        onClick={this.onSaveFileClick}
                        title={"Save file"}
                    >
                        <SaveIcon />
                    </RuleWorkButton>
                    <Divider orientation={"vertical"} flexItem={true}/>
                    <RuleWorkButton
                        ariaLabel={"rules-new-button"}
                        buttonVariant={"icon"}
                        onClick={this.onNewFileClick}
                        title={"New file"}
                    >
                        <FilePlus />
                    </RuleWorkButton>
                    <span style={{flexGrow: 1}} />
                    <StyledButton
                        buttonVariant={"contained"}
                        styleVariant={"green"}
                        onClick={this.onCalculateClick}
                    >
                        Calculate
                    </StyledButton>
                </StyledPaper>
                <RuleWorkBox id={"rules-body"} styleVariant={"tab-body1"}>
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