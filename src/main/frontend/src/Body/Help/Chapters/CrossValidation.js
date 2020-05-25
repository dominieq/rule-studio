import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import foldMatrix from "../resources/crossvalidation/fold-matrix.png";
import foldSection from "../resources/crossvalidation/section-fold.png";
import foldSelect from "../resources/crossvalidation/fold-select.png";
import fullTab from "../resources/crossvalidation/full-tab.png";
import meanMatrix from "../resources/crossvalidation/mean-matrix.jpg";
import objectsDetails from "../resources/crossvalidation/objects-details.jpg";
import sectionAllFolds from "../resources/crossvalidation/section-all-folds.png";
import settings from "../resources/crossvalidation/settings.png";
import sumMatrix from "../resources/crossvalidation/sum-matrix.jpg";

function CrossValidation(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Cross-validation"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Image src={fullTab} caption={"FIGURE 36: Cross-validation"} />
                    <Typography>
                        The tab is empty when you visit it for the first time. In order to see cross-validation results, click on the
                        “CALCULATE” button. Before you click on this button, you can customize parameters that are used in calculations.
                        If you wish to do that, click on the button with cog icon. Then, a drawer is going to slide into the tab from the
                        left (Fig. 37). Five parameters from this drawer were described in the sections concerning decision rules (“Rules”)
                        and classification (“Classification”). To customize seed, write an integer value in the text field or click on the 
                        button on the right to draw a random number. To choose the number of cross-validation folds, write that number in the text field.
                    </Typography>
                    <Image src={settings} caption={"FIGURE 37: Parameters in “Cross-Validation”"} />
                    <Typography>
                        If there are more than 50 test objects in a fold, pagination is displayed at the top and at the bottom of the page.
                        If there are less than 6 objects on the page, the upper pagination is hidden. For each calculated fold, you can filter
                        result list by using the “Search” field. In order to filter test objects, use one of the characteristics visible on list items.
                        For example, if you wish to filter out test objects that have suggested decision equal to medium, you can type “suggested medium”.
                        It is possible to see the details of an object. In order to do that, you have to click on one of the objects from the current fold.
                        Then, a new dialog is displayed (Fig. 38).
                    </Typography>
                    <Image src={objectsDetails} caption={"FIGURE 38: Object’s details"} />
                    <Typography>
                        There are two tables and two lists in this dialog. The list and the table on the right aren’t visible when you enter this
                        dialog for the first time. The table on the left contains evaluations of the selected object with respect to the considered
                        attributes. Furthermore, the list in the middle consists of rules that are covering selected object. In order to display rule’s
                        decision, conditions and characteristics, click on an item from the list in the middle. Then, a list and a table appear on the
                        right. The list at the top depicts rule’s decision in the first row and conditions in subsequent rows. The table at the bottom
                        shows rule’s characteristics. Note that you can also see in the title the original and suggested decision, as well as the
                        certainty of provided suggestion. There is an option to examine objects from a different fold. In order to do that,
                        click on the select menu and pick another fold number from the list (Fig. 39).
                    </Typography>
                    <Image src={foldSelect} caption={"FIGURE 39: Selection of different fold"} />
                    <Typography>
                        It is possible to see mean and accumulated ordinal misclassification matrices, summarizing performed cross-validation.
                        There are two buttons in “All folds” section (Fig. 40). The first one opens a dialog for the mean misclassification matrix (Fig. 41),
                        and the second one for the accumulated misclassification matrix (Fig. 42).
                    </Typography>
                    <Image src={sectionAllFolds} caption={"FIGURE 40: “All folds” section"} />
                    <Typography>
                        You can move from mean matrix to accumulated matrix and the other way around without closing the dialog.
                        Just click on the first button in the title (with two arrows), and you will be transferred to the other matrix.
                    </Typography>
                    <Image src={meanMatrix} caption={"FIGURE 41: Mean ordinal misclassification matrix"} />
                    <Typography>
                        You can see that there are three tables in the mean misclassification matrix dialog. The one on the left is the
                        mean misclassification matrix itself. In the middle, you can examine deviations from the means presented in the
                        mean misclassification matrix. The table on the right contains detailed statistics of performed cross-validation.
                    </Typography>
                    <Image src={sumMatrix} caption={"FIGURE 42: Accumulated ordinal misclassification matrix"} />
                    <Typography>
                        On the other hand, there are only two tables in accumulated misclassification matrix dialog. The one on the left
                        is the accumulated misclassification matrix itself, and the one on the right contains detailed statistics of performed
                        cross-validation. Both matrices can be exported to a file. This process was already described in the “Classification”
                        (see the description of Fig. 35). It is also possible to see ordinal misclassification matrix for a particular fold,
                        using a button with identity matrix, located in the “Fold” section (Fig. 43). Click on it to open a new dialog (Fig. 44).
                    </Typography>
                    <Image src={foldSection} caption={"FIGURE 43: “Fold” section"} />
                    <Image src={foldMatrix} caption={"FIGURE 44: Ordinal misclassification matrix for a single fold"} />
                    <Typography>
                        As you can see, there are two tables in the fold misclassification matrix dialog. On the left, there is the matrix itself,
                        and on the right, you can examine detailed statistics of the classification performed in the selected fold. 
                        Fold’s misclassification matrix can be exported to a file as well. To this end, follow the instructions presented
                        in the “Classification” (see the description of Fig. 35).
                    </Typography>
                </React.Fragment>
            }
        />
    );
}

CrossValidation.propTypes = {
    chapterId: PropTypes.string
};

export default CrossValidation;