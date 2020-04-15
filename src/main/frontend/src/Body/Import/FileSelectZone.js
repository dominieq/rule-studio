import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RuleWorkTooltip from "../../RuleWorkComponents/DataDisplay/RuleWorkTooltip"
import StyledFileChip from "../../RuleWorkComponents/DataDisplay/StyledFileChip";
import RuleWorkUpload from "../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledButton from "../../RuleWorkComponents/Inputs/StyledButton";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import DeleteCircle from "mdi-material-ui/DeleteCircle"
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

    renderFile = (file) => {
        if (file) {
            return (
                <StyledFileChip
                    clickable={true}
                    deleteIcon={<DeleteCircle />}
                    label={file.name}
                    onDelete={this.onInputDelete}
                    size={"small"}
                />
            )
        } else {
            return (
                <Skeleton animation={"wave"}/>
            )
        }
    };

    render() {
        const {variant, accept} = this.props;
        const file = this.state.file;

        return (
            <div className={"file-select-zone"}>
                <Typography component={"p"}>
                    {"Choose " + variant + " file: "}
                </Typography>
                {this.renderFile(file)}
                <RuleWorkTooltip title={"Upload " + variant}>
                    <RuleWorkUpload
                        accept={accept}
                        id={"upload-" + variant}
                        onChange={this.onInputChange}
                    >
                        <StyledButton
                            aria-label={"upload-" + variant}
                            isIcon={true}
                            component={"span"}
                            themeVariant={"primary"}
                        >
                            <FileUpload/>
                        </StyledButton>
                    </RuleWorkUpload>
                </RuleWorkTooltip>
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