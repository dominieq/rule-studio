import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import settings from "../resources/dialogs/settings.png";

function ProjectSettings(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Project settings"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Typography>
                        RuLeStudio has an option to customize some of project’s settings. Currently there is a menu
                        to select default names for objects. If you wish to choose different name to be displayed for
                        your objects, click on “Project settings” button. A dialog is going to be displayed.
                        If there are no description or identification attributes in your project, you won’t be able
                        to alter default selection.
                    </Typography>
                    <Image src={settings} caption={"Rename project dialog"} />
                </React.Fragment>
            }
        />
    );
}

ProjectSettings.propTypes = {
    chapterId: PropTypes.string
};

export default ProjectSettings;