import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import filesList from "../resources/dialogs/files-list.png";

function ProjectFiles(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Project files"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Typography>
                        You can take a look at the files that you used to create a project.
                        Simply, click on the “Files details” (Fig. 2). A popup list is going to be displayed
                        below this button (Fig. 13).
                    </Typography>
                    <Image src={filesList} caption={"FIGURE 13: Names of files used in a project"} />
                </React.Fragment>
            }
        />
    );
}

ProjectFiles.propTypes = {
    chapterId: PropTypes.string.isRequired
};

export default ProjectFiles;
