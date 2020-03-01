import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RuleWorkButton from "../../../RuleWorkComponents/Inputs/RuleWorkButton";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import DeleteCircle from "mdi-material-ui/DeleteCircle";
import FileUpload from "mdi-material-ui/FileUpload";
import "./FileSelectZone.css"


class FileSelectZone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
        };
    }

    onInputChange = (event) => {
        if (event.target.files.length !== 1) return;

        const uploadedFile = event.target.files[0];
        this.setState({
            file: uploadedFile,
        }, () => {
            const message = {file: uploadedFile, type: this.props.variant};
            this.props.onInputChange(message);
        });
    };

    onInputDelete = () => {
        const file = this.state.file;
        this.setState({
            file: null,
        }, () => {
            const message = {file: file, type: this.props.variant};
            this.props.onInputDelete(message);
        })
    };

    render() {
        const {variant, accept} = this.props;
        const file = this.state.file;

        return (
            <div className={"file-select-zone"}>
                <Typography component={"p"}>
                    {"Choose " + variant + " file: "}
                </Typography>
                <span>
                    <Chip
                        hidden={!file}
                        label={file ? file.name : ""}
                        color={"primary"}
                        clickable={true}
                        onDelete={this.onInputDelete}
                        deleteIcon={<DeleteCircle />}
                    />
                </span>
                <RuleWorkButton
                    variant={"upload"}
                    uploadAccept={accept}
                    tooltipTitle={"Upload " + variant}
                    buttonLabel={variant + "-upload-button"}
                    content={<FileUpload color={"primary"}/>}
                    onButtonClick={this.onInputChange}
                    id={"rule-work-upload-" + variant + "-button"}
                />
            </div>
        );
    }
}

FileSelectZone.propTypes = {
    variant: PropTypes.oneOf(["metadata", "data", "rules"]).isRequired,
    accept: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    onInputDelete: PropTypes.func.isRequired,
};

FileSelectZone.defaultProps = {
    variant: "metadata",
    accept: ".json,.xml,.csv"
};

export default FileSelectZone;