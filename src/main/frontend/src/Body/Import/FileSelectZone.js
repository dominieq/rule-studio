import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import RuleWorkTooltip from "../../RuleWorkComponents/DataDisplay/RuleWorkTooltip"
import StyledFileChip from "../../RuleWorkComponents/DataDisplay/StyledFileChip";
import RuleWorkUpload from "../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledButton from "../../RuleWorkComponents/Inputs/StyledButton";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import DeleteCircle from "mdi-material-ui/DeleteCircle"
import FileUpload from "mdi-material-ui/FileUpload";
import styles from "./styles/FileSelectZone.module.css";

const useStyles = makeStyles({
    tooltip: {
        display: "flex",
        flexDirection: "column",
        '& > *:not(:first-child)': {
            marginTop: "1em"
        }
    },
    tooltipTitle: {
        margin: 0,
        textAlign: "center"
    },
    tooltipDesc: {
        margin: 0,
        textAlign: "justify"
    }
}, {name: "file-select-zone"})

function FileSelectZone(props)  {
    const [file, setFile] = useState(null);
    const classes = useStyles();
    const { accept, title, variant } = props;

    const onInputChange = (event) => {
        if (event.target.files.length !== 1) return;

        const uploadedFile = event.target.files[0];

        setFile(uploadedFile);
        props.onInputChange({
            file: uploadedFile,
            type: variant
        });
    };

    const onInputDelete = () => {
        props.onInputDelete({
            file: file,
            type: variant
        });
        setFile(null);
    };

    return (
        <div className={styles.Root}>
            <Typography className={styles.Label} style={{marginRight: 8}}>
                {"Choose " + variant + " file: "}
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
                <Skeleton
                    animation={"wave"}
                    width={"100%"}
                />
            }
            <RuleWorkTooltip
                arrow={true}
                classes={{tooltip: classes.tooltip}}
                placement={"right"}
                title={
                    <React.Fragment>
                        <p aria-label={"title"} className={classes.tooltipTitle} >
                            <b>{"Upload " + variant}</b>
                        </p>
                        {title &&
                            <p aria-label={"desc"} className={classes.tooltipDesc} >
                                {title}
                            </p>
                        }
                    </React.Fragment>
                }
            >
                <RuleWorkUpload
                    accept={accept}
                    id={"upload-" + variant}
                    onChange={onInputChange}
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

FileSelectZone.propTypes = {
    accept: PropTypes.string,
    onInputChange: PropTypes.func,
    onInputDelete: PropTypes.func,
    title: PropTypes.node,
    variant: PropTypes.oneOf(["metadata", "data", "rules"])
};

FileSelectZone.defaultProps = {
    accept: ".json,.xml,.csv"
};

export default FileSelectZone;
