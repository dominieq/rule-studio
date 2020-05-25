import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import fullTab from "../resources/unions/full-tab.png";
import settings from "../resources/unions/settings.png";
import unionsDetails from "../resources/unions/unions-details.png";

function ClassUnions(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Class unions"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Image src={fullTab} caption={"FIGURE 24: Class unions"} />
                    <Typography>
                        The tab is empty when you visit it for the first time. In order to see class unions, 
                        click on the “CALCULATE” button. Before you click on this button, you can customize 
                        parameters used in calculations. If you wish to do that, click on the button with a cog icon.
                        A drawer is going to slide into current tab from the left (Fig. 25). To customize consistency measure,
                        click on the select menu and pick your value from the list. To choose consistency threshold,
                        write your number in the text field or use the slider. The concept of class unions and the description 
                        of parameters can be found in the user's guide.
                    </Typography>
                    <Image src={settings} caption={"FIGURE 25: Parameters in “Class unions”"} />
                    <Typography>
                        If there are more than 50 class unions, pagination is displayed at the top and at the bottom of the page.
                        If there are less than 6 class unions on a page, the upper pagination is hidden. You can filter the result
                        list by using the “Search” input field. In order to filter unions, use one of the characteristics visible
                        on list items. For example, if you want to filter out class unions that have accuracy of approximation equal
                        to 0.5, you can type “accuracy 0.5”. It is possible to see the details of a class union. In order to do that,
                        you have to click on one of the class unions from the result list. A new dialog is going to be displayed (Fig. 26).
                    </Typography>
                    <Image src={unionsDetails} caption={"FIGURE 26: Union’s details"} />
                    <Typography>
                        There are two lists and two tables in this dialog. The list in the middle and the table in the bottom right 
                        corner aren’t visible when you enter this dialog for the first time. The list on the left contains collections
                        that describe selected class union. Furthermore, the table in the top right corner shows the characteristics
                        of the selected union. If you click on one of the collections from the list on the left, a new list is going
                        to be displayed in the middle of this dialog. This new list contains objects that belong to the selected 
                        collection. You can also see the details of any of these objects if you click on it. Then, there is going 
                        to be displayed a table, in the bottom right corner, that depicts attributes of the selected object.
                    </Typography>
                </React.Fragment>
            }
        />
    );
}

ClassUnions.propTypes = {
    chapterId: PropTypes.string
};

export default ClassUnions;