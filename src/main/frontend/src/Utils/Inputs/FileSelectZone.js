import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../DataDisplay/CustomTooltip"
import StyledFileChip from "../DataDisplay/StyledFileChip";
import CustomUpload from "./CustomUpload";
import { StyledIconButton } from "../Buttons";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import DeleteCircle from "mdi-material-ui/DeleteCircle"
import FileUpload from "mdi-material-ui/FileUpload";
import styles from "./styles/FileSelectZone.module.css";

const useStyles = makeStyles({
    multilineTooltip: {
        display: "flex",
        flexDirection: "column",
        '& > *:not(:first-child)': {
            marginTop: "1em"
        }
    }
}, {name: "FileSelectZone"});

/**
 * <h3>Overview</h3>
 * A section used to upload a file.
 *
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props
 * @param {string} [props.accept = ".json,.xml,.csv"] - Specifies what file types the user can pick from the file input dialog box.
 * @param {Object} [props.ButtonProps] - Props applied to the {@link StyledIconButton} element.
 * @param {string} props.id - The id attribute of the {@link CustomUpload} element.
 * @param {string} props.label - The content of the {@link Typography} element.
 * @param {Object} [props.LabelProps] - The props applied to the {@link Typography} element.
 * @param {boolean} [props.multilineTooltip = false] - If <code>true</code> tooltip will display text in multiple lines.
 * @param {function} props.onInputChange - Callback fired when an input was changed.
 * @param {function} props.onInputDelete - Callback fired when an input requests to be deleted.
 * @param {React.ReactNode} props.title - The title property of the {@link CustomTooltip} element.
 * @param {Object} [props.TooltipProps] - Props applied to the {@link CustomTooltip} element.
 * @param {string} props.variant - The custom type of uploaded file.
 * @param {Object} [props.UploadProps] - Props applied to the {@link CustomUpload} element.
 * @returns {React.ReactElement}
 */
function FileSelectZone(props)  {
    const [file, setFile] = useState(null);
    const {
        accept,
        ButtonProps,
        id,
        label,
        LabelProps,
        multilineTooltip,
        title,
        TooltipProps,
        type,
        UploadProps
    } = props;

    const classes = useStyles();

    const onInputChange = (event) => {
        if (event.target.files.length !== 1) return;

        const uploadedFile = event.target.files[0];

        setFile(uploadedFile);
        props.onInputChange({ file: uploadedFile, type: type });
    };

    const onInputDelete = () => {
        props.onInputDelete({ file: file, type: type });
        setFile(null);
    };

    return (
        <div className={styles.Root}>
            <Typography className={styles.Label} style={{ marginRight: 8 }} {...LabelProps}>
                {label}
            </Typography>
            {file ?
                <StyledFileChip
                    clickable={true}
                    deleteIcon={<DeleteCircle />}
                    label={file.name}
                    onDelete={onInputDelete}
                    size={"small"}
                />
                :
                <Skeleton animation={"wave"} width={"100%"} />
            }
            <CustomTooltip
                arrow={true}
                classes={multilineTooltip ? {tooltip: classes.tooltip} : undefined}
                placement={"right"}
                title={title}
                {...TooltipProps}
            >
                <CustomUpload
                    accept={accept}
                    id={id}
                    onChange={onInputChange}
                    {...UploadProps}
                >
                    <StyledIconButton
                        aria-label={id}
                        color={"primary"}
                        component={"span"}
                        {...ButtonProps}
                    >
                        <FileUpload/>
                    </StyledIconButton>
                </CustomUpload>
            </CustomTooltip>
        </div>
    );
}

FileSelectZone.propTypes = {
    accept: PropTypes.string,
    ButtonProps: PropTypes.object,
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    LabelProps: PropTypes.object,
    multilineTooltip: PropTypes.bool,
    onInputChange: PropTypes.func,
    onInputDelete: PropTypes.func,
    title: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
    type: PropTypes.string.isRequired,
    UploadProps: PropTypes.object
};

FileSelectZone.defaultProps = {
    accept: ".json,.xml,.csv",
    multilineTooltip: false
};

export default FileSelectZone;
