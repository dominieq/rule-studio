import React from "react";
import PropTypes from "prop-types";
import { Chapter } from "../Elements";
import Typography from "@material-ui/core/Typography";

function ExportingProject(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Exporting a project"}
            titleId={chapterId}
            content={
                <Typography>
                    If you wish to export a project click on the “Export project” button (Fig. 2). Project
                    is going to be compressed to a ZIP file and then downloaded to your default download
                    folder.
                </Typography>
            }
        />
    );
}

ExportingProject.propTypes = {
    chapterId: PropTypes.string.isRequired
};

export default ExportingProject;
