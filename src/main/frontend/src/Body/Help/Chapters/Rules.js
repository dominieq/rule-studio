import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import fullTab from "../resources/rules/full-tab.png";
import ruleDetails from "../resources/rules/rule-details.jpg";
import settings from "../resources/rules/settings.png";
import sort from "../resources/rules/sort.png";

function Rules(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Rules"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Image src={fullTab} caption={"Rules"} />
                    <Typography>
                        The tab is empty, when you visit it for the first time. In order to see rules, click on the “CALCULATE” button.
                        Before you click on this button, you can customize the parameters that are used in calculations.
                        If you wish to do that, click on the button with cog icon. A drawer is going to slide into current tab from the left.
                        To customize type of rules and consistency measure, click on the corresponding select menu and pick desirable value 
                        from the list. To choose consistency threshold, write a number in the text field or use the slider.
                    </Typography>
                    <Image src={settings} caption={"Parameters in “Rules”"} />
                    <Typography>
                        If there are more than 50 rules, pagination is displayed at the top and at the bottom of the page.
                        If there are less than 6 rules on the page, the upper pagination is hidden. You can filter result 
                        list by using the “Search” field. In order to filter rules, use one of the characteristics visible 
                        on list items. For example, if you want to filter out rules that have strength equal to 1, you can 
                        type “strength 1”. You can sort the result list by rule’s characteristics. In order to do that, you
                        should click on “Sort rules” icon. Then, a menu is going to appear below this icon. 
                        It contains a list of rule’s characteristics and two sorting orders: ascending and descending.
                        Default values are shown in:
                    </Typography>
                    <Image src={sort} caption={"Sort menu in “Rules”"} />
                    <Typography>
                        In RuLeStudio, you can upload your own rule set. Click on “Upload file” button and select your file.
                        It should be a valid XML file that implements RuleML standard. Note that the data in your project should 
                        be a valid training set for uploaded rules. If it is not, you will be able to see uploaded rules, however
                        there won’t be any information about covered and supporting objects. There is an option to export current
                        rule set to XML or TXT file. In order to do that, click on “Save rules to RuleML” or “Save rules to TXT” button.
                        The current rule set is going to be automatically downloaded to your default download folder. It is possible 
                        to see details of any rule. In order to do that, you have to click on one of the rules from the result list. 
                        A new dialog is going to be displayed.
                    </Typography>
                    <Image src={ruleDetails} caption={"Rule’s details"} />
                    <Typography>
                        There are two tables and one list in this dialog. The table on the right isn’t visible when you enter this 
                        dialog for the first time. The table on the left contains characteristics of the selected rule. Furthermore,
                        the list in the middle consists of objects that are covered by a rule. Green left border means that the object
                        is covered by a rule and is a supporting object as well. Red left border means that the object is covered by a 
                        rule but it does not support the selected rule. In order to display object’s evaluations on the attributes, 
                        you should click on an item from the list in the middle. Then, a table is going to appear on the right. 
                        Note that the line presenting the selected rule is scrollable. Thus, when the rule doesn’t have enough space 
                        and is partially hidden, you can hover over that line and scroll to the end.
                    </Typography>
                </React.Fragment>
            }
        />
    );
}

Rules.propTypes = {
    chapterId: PropTypes.string
};

export default Rules;