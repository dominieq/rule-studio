import React, {Component} from 'react';
import Divider from "@material-ui/core/Divider";
import RulesBar from "./surfaces/RulesBar";
import RulesBody from "./surfaces/RulesBody";
import ConesBarButton from "./inputs/ConesBarButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import FilePlus from "mdi-material-ui/FilePlus";
import "./Rules.css";

class Rules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rules: [],
        };
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

    render() {
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
                <RulesBody>
                    Rules
                </RulesBody>
            </div>
        )
    }
}

export default Rules;