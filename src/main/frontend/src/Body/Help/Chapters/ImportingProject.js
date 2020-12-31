import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import importEmpty from "../resources/dialogs/import-project-empty.png";
import importFilled from "../resources/dialogs/import-project-filled.png";

function ImportingProject(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Importing a project"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Typography>
                        If you wish to import a project rather than create it from a scratch, click on the “Open
                        project” button. A dialog is going to show up with a place to select a ZIP file containing
                        your project.
                    </Typography>
                    <Image src={importEmpty} caption={"FIGURE 7: Open project dialog without selected project"} />
                    <Typography>
                        Click on the upload button on the right and select your file. In order to confirm your
                        selection, click on the “Ok” button or press “Enter”.
                    </Typography>
                    <Image src={importFilled} caption={"FIGURE 8: Open project dialog with selected project"} />
                </React.Fragment>
            }
        />
    );
}

ImportingProject.propTypes = {
    chapterId: PropTypes.string.isRequired
}

export default ImportingProject;
