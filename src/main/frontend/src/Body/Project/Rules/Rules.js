import React, {Component} from 'react';
import Divider from "@material-ui/core/Divider";
import RulesBar from "./surfaces/RulesBar";
import RulesList from "./surfaces/RulesList";
import RuleItem from "./data-display/RuleItem";
import RuleDescription from "./data-display/RuleDescription";
import ConesBarButton from "./inputs/ConesBarButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import FilePlus from "mdi-material-ui/FilePlus";
import "./Rules.css";

class Rules extends Component {
    constructor(props) {
        super(props);

        this.ruleDesc = React.createRef();
    }

    componentDidMount() {
        // TODO fetch rules from server
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
            <div className={"rules"}>
                <RulesBar>
                    <ConesBarButton
                        variant={"upload"}
                        title={"Upload file"}
                        label={"upload-file"}
                        icon={<CloudUploadIcon />}
                        onButtonClick={(e) => this.onUploadFileChanged(e)}
                    />
                    <Divider orientation={"vertical"} flexItem={true}/>
                    <ConesBarButton
                        title={"Save file"}
                        label={"save-file"}
                        icon={<SaveIcon />}
                        onButtonClick={() => this.onSaveFileClick()}
                    />
                    <Divider orientation={"vertical"} flexItem={true}/>
                    <ConesBarButton
                        title={"New file"}
                        label={"new-file"}
                        icon={<FilePlus />}
                        onButtonClick={() => this.onNewFileClick()}
                    />
                </RulesBar>
                <div className={"rules-body"}>
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
                </div>
            </div>
        )
    }
}

export default Rules;