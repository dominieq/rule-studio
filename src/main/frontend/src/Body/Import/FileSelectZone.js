import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import "./FileSelectZone.css"

class FileSelectZone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileUploaded: false,
            fileName: "epstein didn't kill himself",
        };

        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    handleFileUpload(event) {
        const uploadedFile = event.target.files[0];
        this.setState({
            fileUploaded: true,
            fileName: uploadedFile.name,
        })
    }

    render() {
        return (
            <div className={"file-select-zone"}>

                <Typography component={"p"}>
                    {this.props.children}
                </Typography>
                <div hidden={!this.state.fileUploaded}>
                    <TextField
                        id={this.props.textField}
                        value={this.state.fileName}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </div>
                <input id={this.props.input} type={"file"} onChange={this.handleFileUpload}/>
                <label htmlFor={this.props.input}>
                    <IconButton component={"span"} color={"primary"}>
                        <CloudUploadIcon/>
                    </IconButton>
                </label>
            </div>
        );
    }
}

export default FileSelectZone;