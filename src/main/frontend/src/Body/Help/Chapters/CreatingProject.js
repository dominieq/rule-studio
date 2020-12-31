import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import csvDialog from "../resources/new_project/csv-dialog.png";
import full from "../resources/new_project/full.png";
import middle from "../resources/new_project/middle.png";
import start from "../resources/new_project/start.png";

function CreatingProject(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Creating a project"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Image src={start} caption={"FIGURE 3: Empty “New project” page"} />
                    <Typography>
                        After clicking on the “New project” button, RuLeStudio displays a page where you can customize
                        name for your new project and upload files. Although it is easier to have a dataset ready 
                        for calculations, you don’t have to upload any files to create a project. You will have 
                        an opportunity to add attributes and objects in the “DATA” tab. However, if you wish to add
                        files to your project click on the switch with “Create project with metadata” label.
                        New content will be displayed below this switch (Fig. 4).
                    </Typography>
                    <Image src={middle} caption={"FIGURE 4: Creating new project with metadata"} />
                    <Typography>
                        Metadata represents attributes in your project. It should be a valid JSON file. 
                        There should be an array in this file and each element from this array should describe one attribute.
                        The way of writing attributes to a file was specifically prepared for the needs of ruleLearn library.
                        At this point, you are able to create new project. In the “DATA” tab you will be able to see a table with attributes
                        as names of columns. However, if you wish to add data or rules, click on the divider with
                        “Optional files” label. New content will be displayed below this divider.
                    </Typography>
                    <Image src={full} caption={"FIGURE 5: Creating new project with metadata, data and rules"} />
                    <Typography>
                        Data represents objects in your project and should be a CSV or JSON file. Rules should 
                        be an XML file that implements RuleML standard. If choosing a CSV file with objects,
                        an additional dialog will be displayed (Fig. 6), where you can select a separator and choose 
                        if the first row of the file should be treated as a header row. The default separator
                        is a comma. Other options are tab, space and semicolon.
                        The data written in a JSON file does not require any extra options. For this type of a file,
                        RuLeStudio reads and writes data as an array of elements, where each element corresponds to a single object.
                        The values of an object for subsequent attributes are written as “key”:“value” pairs (where the key equals attribute’s name).
                    </Typography>
                    <Image src={csvDialog} caption={"FIGURE 6: CSV dialog"} />
                </React.Fragment>
            }
        />
    );
}

CreatingProject.propTypes = {
    chapterId: PropTypes.string.isRequired
};

export default CreatingProject;
