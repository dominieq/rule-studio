import React, {Component} from 'react';
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkButton from "../../../RuleWorkComponents/Inputs/RuleWorkButton";
import RulesList from "./surfaces/RulesList";
import RuleItem from "./data-display/RuleItem";
import RuleDescription from "./data-display/RuleDescription";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import FilePlus from "mdi-material-ui/FilePlus";
import "./Rules.css";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";

class Rules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: "",
        };

        this.ruleDesc = React.createRef();
    }

    componentDidMount() {
        const project = this.props.project;

        fetch(`http://localhost:8080/projects/${project.result.id}/rules`, {
            method: "GET",
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(result => {
            console.log(result);
            this.setState({
                data: result,
            });
        }).catch(error => {
            console.log(error);
            console.log(error.message)
        })
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
                console.log(response);
                return response.json();
            }).then(result => {
                console.log(result);
                this.setState({
                    loading: false,
                    data: result,
                });
            }).catch(error => {
                this.setState({
                    loading: false,
                }, () => {
                    console.log(error);
                    console.log(error.message)
                });
            });
        });
    };


    onRuleAction = (hidden, rule) => {
        this.ruleDesc.current.onRuleAction(hidden, rule);
    };

    render() {
        const rules = [
            {
                name: "rule 1",
                description: "I am rule number 1",
            },
            {
                name: "rule 2",
                description: "I am rule number 2",
            },
        ];

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
                <RuleWorkBox id={"rules-body"} styleVariant={"tab-body2"}>
                    <RulesList>
                        {rules.map((rule, index) => (
                            <RuleItem
                                key={index}
                                rule={rule}
                                onRuleClick={(h, r) => this.onRuleAction(h, r)}
                                onRuleBlur={(h, r) => this.onRuleAction(h, r)}
                            />
                        ))}
                    </RulesList>
                    <RuleDescription ref={this.ruleDesc}/>
                </RuleWorkBox>
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