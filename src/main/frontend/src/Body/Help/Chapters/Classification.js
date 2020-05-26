import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import classifyButton from "../resources/classification/classify-button.png";
import fullTab from "../resources/classification/full-tab.png";
import matrix from "../resources/classification/matrix.png";
import objectsDetails from "../resources/classification/objects-details.png";
import settings from "../resources/classification/settings.png";

function Classification(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Classification"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Image src={fullTab} caption={"FIGURE 31: Classification"} />
                    <Typography>
                        The tab is empty when you visit it for the first time. In order to see classified data, click on the
                        “CLASSIFY CURRENT DATA” button. Before you click on this button, you can customize parameters that are 
                        used in calculations. If you wish to do that, click on the button with cog icon. A drawer is going to slide
                        into the tab from the left (Fig. 32). To customize type of classifier and default classification result,
                        click on the corresponding select menu and pick desirable value from the list. The concept of classification
                        and the description of parameters can be found in the user's guide.
                    </Typography>
                    <Image src={settings} caption={"FIGURE 32: Parameters in “CLASSIFICATION”"} />
                    <Typography>
                        If there are more than 50 classified objects, pagination is displayed at the top and at the bottom of the page.
                        If there are less than 6 objects on the page, the upper pagination is hidden. You can filter result list by using
                        the “Search” field. In order to filter objects, use one of the characteristics visible on list items. For example,
                        if you wish to filter out objects that have suggested decision equal to medium, you can type “suggested medium”.
                        There is an option to upload external data file and classify it’s objects. To change default action in split button,
                        click on its left part with filled arrow. A menu is going to appear below the split button (Fig. 33).
                        Choose the second option and then click on your modified button to select an external data file.
                        Reading of this file is going to be executed with the attributes from the “DATA” tab.
                    </Typography>
                    <Image src={classifyButton} caption={"FIGURE 33: Split button in “CLASSIFICATION”"} />
                    <Typography>
                        It is possible to see the details of an object. In order to do that, you have to click on one of the objects from
                        the result list. A new dialog is going to be displayed (Fig. 34).
                    </Typography>
                    <Image src={objectsDetails} caption={"FIGURE 34: Classified object’s details"} />
                    <Typography>
                        There are two tables and two lists in this dialog. The list and the table on the right aren’t visible when you enter
                        this dialog for the first time. The table on the left contains evaluations of the selected object with respect to the
                        considered attributes. Furthermore, the list in the middle consists of rules that are covering selected object. 
                        In order to display rule’s decision, conditions and characteristics, click on an item from the list in the middle.
                        Then, a list and a table appear on the right. The list at the top depicts rule’s decision in the first row and conditions
                        in subsequent rows. The table at the bottom shows rule’s characteristics. Note that you can also see in the title the 
                        original and suggested decision, as well as the certainty of provided suggestion. 
                        There is an option to see more detailed description of a selected covering rule. In order to do that, right click on the upper
                        right list. A context menu is going to be displayed. Select an option to display rule’s details. New content is going to slide
                        into the dialog from the right. Composition of this content was presented in “Rules”.
                        It is also possible to see the ordinal
                        misclassification matrix for the performed classification. To this end, while being in the main view of the
                        “CLASSIFICATION” tab, you have to click on a button with identity matrix icon. Then, a new dialog is going to be displayed (Fig. 35).
                    </Typography>
                    <Image src={matrix} caption={"FIGURE 35: Ordinal misclassifcation matrix in “CLASSIFICATION”"} />
                    <Typography>
                        You can see that there are two tables in this dialog. The one on the left is the misclassification matrix itself,
                        and the one on the right contains detailed statistics of performed classification. There is an option to export 
                        misclassification matrix to a file. In order to do that, you should click on the download icon in the title, 
                        or right click on the matrix. When doing the former, the matrix will be automatically downloaded to your default 
                        download folder. When doing the latter, a context menu appears with an option to save the matrix.
                        Click on it, and the matrix will be downloaded to your default download folder.
                    </Typography>
                </React.Fragment>
            }
        />
    );
}

Classification.propTypes = {
    chapterId: PropTypes.string
};

export default Classification;