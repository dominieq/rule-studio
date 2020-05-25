import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import fullTab from "../resources/cones/full-tab.png";
import objectsDetails from "../resources/cones/objects-details.png";

function DominanceCones(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Dominance cones"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Image src={fullTab} caption={"FIGURE 22: Dominance cones"} />
                    <Typography>
                        Dominance cones are the first thing that you can calculate. The concept of dominance cones can be found in the user's guide.
                        The tab is empty, when you visit it for the first time. 
                        In order to see dominance cones for each object in your data set, click on the “CALCULATE” button. 
                        If there are more than 50 objects, pagination is displayed at the top and at the bottom of the page. 
                        If there are less than 6 objects on a page, the upper pagination is hidden.You can filter the result list by using 
                        the “Search” input field. In order to filter objects, use one of the characteristics visible on list items.
                        For example, if you want to filter out objects that have 20 other objects in their positive dominance cone, you can
                        type “positive 20”. It is possible to see the details of dominance cones of an object. In order to do that,
                        you have to click on one of the objects from the result list. A new dialog is going to be displayed (Fig. 23).
                    </Typography>
                    <Image src={objectsDetails} caption={"FIGURE 23: Dominance cones details"} />
                    <Typography>
                        There are two lists and one table in this dialog. The list in the middle and table on the right aren’t visible when you
                        enter this dialog for the first time. The list on the left contains all dominance cones for the selected object.
                        If you click on one of the elements, a new list is displayed in the middle. This new list contains objects that belong
                        to the selected dominance cone. You can go further and select one of the objects from this list. Then, you are going
                        to see a table with a comparison between the object in the origin of the cone and selected object.
                    </Typography>
                </React.Fragment>
            }
        />
    );
}

DominanceCones.propTypes = {
    chapterId: PropTypes.string
};

export default DominanceCones;