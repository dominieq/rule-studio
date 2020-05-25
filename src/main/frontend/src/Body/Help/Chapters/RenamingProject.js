import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import rename from "../resources/dialogs/rename.png";

function RenamingProject(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Renaming a project"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Typography>
                        If you wish to rename your current project, click on “Rename project” button (Fig. 2). 
                        A dialog is going to be displayed with an input field to correct or write a new project name (Fig. 7).
                        You can accept new name by clicking on “Ok” button or by pressing “Enter”. You can cancel 
                        this process by clicking on “Cancel” button, pressing “Escape” or clicking outside this dialog.
                        A warning is going to be displayed if you try to accept a name that already exists in RuLeStudio.
                    </Typography>
                    <Image src={rename} caption={"FIGURE 7: Rename project dialog"} />
                </React.Fragment>
            }
        />
    );
}

RenamingProject.propTypes = {
    chapterId: PropTypes.string
};

export default RenamingProject;