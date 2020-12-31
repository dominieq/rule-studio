import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import settings from "../resources/dialogs/settings.png";
import settingsReset from "../resources/dialogs/settings-reset.png";

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
                        your objects, click on the “Project settings” button (Fig. 2). A dialog is going to be displayed (Fig. 11).
                        If there are no description or identification attributes in your project, you won’t be able
                        to alter default selection.
                    </Typography>
                    <Image src={settings} caption={"FIGURE 11: Project settings dialog"} />
                    <Typography>
                        RuLeStudio offers a possibility to refresh your selection. Assume that you have changed
                        a visible object name in some place in the application and you don’t even remember where
                        you did it. If that’s the case, next time you open this dialog you will see a warning (Fig. 12)
                        with an option to refresh your selection everywhere.
                    </Typography>
                    <Image src={settingsReset} caption={"FIGURE 12: Project settings dialog with refresh option"} />
                </React.Fragment>
            }
        />
    );
}

ProjectSettings.propTypes = {
    chapterId: PropTypes.string.isRequired
};

export default ProjectSettings;
