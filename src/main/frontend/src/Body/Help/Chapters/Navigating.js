import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import appBarProject from "../resources/navigating/app-bar-project.png";
import appBarStart from "../resources/navigating/app-bar-start.png";

function Navigating(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Navigating in RuLeStudio"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Image src={appBarStart} caption={"FIGURE 1: App bar when no project is selected"} />
                    <Typography component={'span'}>
                        From left to right:
                        <ol>
                            <li> Home button - displays RuLeStudio's homepage. </li>
                            <li> New project button - shows a page where you can create a new project. </li>
                            <li> Project menu - displays a menu list with your projects. </li>
                            <li> Help button - shows the summary of this manual. </li>
                            <li> Change colors button - changes palette from dark to light or the other way around. </li>
                        </ol>
                    </Typography>
                    <Image src={appBarProject} caption={"FIGURE 2: App bar after selecting a project"} />
                    <Typography component={'span'}>
                    New buttons appear after creating or selecting an existing project. From left to right:
                    <ol>
                        <li> Files details - displays a popup list with names of files used in the current project. </li>
                        <li> Settings - displays a dialog with project settings. Currently, there is only one option. You are able to customize objects' names. </li>
                        <li> Rename project - displays a dialog where you can alter current project's name. </li>
                        <li> Delete project - displays a dialog with an input field to type project's name. Project will be deleted after confirmation. </li>
                    </ol>
                    </Typography>
                </React.Fragment>
            }
        />
    );
}

Navigating.propTypes = {
    chapterId: PropTypes.string
};

export default Navigating;