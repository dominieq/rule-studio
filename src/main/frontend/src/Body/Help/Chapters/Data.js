import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import fullTab from "../resources/data/full_tab.png";
import buttons from "../resources/data/buttons2.png";
import columnsHeaders from "../resources/data/columns_headers.png";
import headerContextMenu from "../resources/data/header_right_click.png";
import copyPaste from "../resources/data/copy_paste.png";
import dragCell from "../resources/data/drag_cell.png";
import rowContextMenu from "../resources/data/row_right_click.png";
import addAttribute from "../resources/data/add_attribute.png";
import editAttributes from "../resources/data/edit_attributes.png";
import saveToFile from "../resources/data/save_to_file_filled.png";
import transform from "../resources/data/transform.png";

function Data(props) {
    const { chapterId } = props;

    return (
        <React.Fragment>
            <Chapter
                title={"Data"}
                titleId={chapterId}
                content={
                    <React.Fragment>
                        <Image src={fullTab} caption={"FIGURE 14: Data"} />
                        <Typography component={'span'}>
                            Data tab is responsible for displaying objects (rows) and attributes (columns) loaded to the project.
                            If nothing was loaded, this is the place where you can create either attributes or objects, or both.
                            In figure 11 you can see from the top:
                            <ol>
                                <li> App bar </li>
                                <li> Bar with main tabs (the DATA tab is selected) </li>
                                <li> Bar with buttons (FILTER, ADD OBJECT, etc.) </li>
                                <li> Colored columns headers with filter fields underneath </li>
                                <li> Rows </li>
                            </ol>
                        </Typography>
                        <Typography component={"header"} paragraph={true} variant={"h6"}>
                            Specific Tab Description
                        </Typography>
                        <Typography> 1. Buttons </Typography>
                        <Image src={buttons} caption={"FIGURE 15: Data buttons"} />
                        <Typography component={'span'}>
                            From left to right:
                            <ol type="a">
                                <li> Filter - if filter fields aren’t visible, then by clicking on this button the fields will appear. 
                                    Otherwise click results in clearing all the filter fields and hiding them. </li>
                                <li> Add object – adds new object at the end of the rows table. </li>
                                <li> Delete selected – removes rows next to which checkbox was selected.
                                    If the top checkbox is selected, then all the checkboxes will be selected </li>
                                <li> Add attribute – opens the “add attribute” dialog (Fig. 18). </li>
                                <li> Edit attributes – opens the “edit attributes” dialog (Fig. 19). </li>
                                <li> Save to file – opens the “save to file” dialog (Fig. 20). </li>
                                <li> Transform – opens the “impose preference orders” dialog (Fig. 21). </li>
                                <li> Undo – undo changes made to either objects or attributes. </li>
                                <li> Redo – redo changes made to either objects or attributes. </li>
                            </ol>
                            </Typography>
                        <Typography> 2. Columns headers </Typography>
                        <Image src={columnsHeaders} caption={"FIGURE 16: Columns headers with filters"} />
                        <Typography>
                            Figure 16 presents columns headers. Each header has meaningful color, which informs about the nature
                            of the attribute. Gray color indicates an attribute which is inactive or its type is either identification or description.
                            Green color means that the attribute preference type is “gain”, while red one relates to “cost” preference type.
                            Blue color indicates that the attribute does not have a preference type (its preference type is “none”).
                            Columns are resizable and draggable. To resize the column, you need to drag the end of its header. 
                            To change the order of columns you need to drag and drop the header of the column. Left click on a header sorts rows 
                            in respective column – in such case, the arrow on the left of the column name represents sorting order.
                            Right click on the header opens header context menu (Fig. 17).
                        </Typography>
                        <Image src={headerContextMenu} caption={"FIGURE 17: Header context menu"} />
                        <Typography>
                            This menu enables to change attribute from active to inactive, and vice versa, open the “Edit attributes” dialog,
                            or remove the attribute.
                        </Typography>
                        <Typography> 3. Rows </Typography>
                        <Typography> 
                            The rows are displayed in the form of a table. To filter rows you have to enter the value in the filter field underneath
                            the column header. Values in cells can be modified in multiple ways. First one involves double click on a cell
                            and entering a new value. Second one is entering new value by pressing keyboard keys. If the attribute is of enumeration type,
                            which has predefined domain elements, you can select the domain element by pressing the first letter of its name.
                            Third method employs copy-paste mode. By pressing the keyboard shortcut Ctrl + C, you copy the value of the highlighted
                            cell and enter the copy-paste mode, which is indicated by dark blue background color of the cell (Fig. 18).
                            To paste the copied value, just press Ctrl + V in the target cell. To exit from the copy-paste mode, you need
                            to press Escape key on the keyboard.
                        </Typography>
                        <Image src={copyPaste} caption={"FIGURE 18: Copy-paste mode"} />
                        <Typography>
                            It is possible to modify multiple cells in the same column. To set the cells to the same value as selected cell,
                            you need to click on a square located in the bottom right corner of the cell and start dragging it upwards or downwards (Fig. 19).
                            At the chosen position, release the drag. Moreover if you hold the Ctrl button while dragging,
                            cells will be filled with consecutive numbers.
                            It is also possible to modify all the cells below the selected cell with either holding Ctrl button or not.
                            To do that, you need to double click on the square used for dragging.
                        </Typography>
                        <Image src={dragCell} caption={"FIGURE 19: Dragging downwards"} />
                        <Typography>
                            Similarly to the header context menu, there is a row context menu. To open the menu, right click on the cell (Fig. 20).
                            The menu enables to remove the object presented in cell’s row, and add new object above or below current object.
                        </Typography>
                        <Image src={rowContextMenu} caption={"FIGURE 20: Row context menu"} />
                        <Typography component={"header"} paragraph={true} variant={"h6"}>
                            Add attribute
                        </Typography>
                        <Image src={addAttribute} caption={"FIGURE 21: Add attribute dialog"} />
                        <Typography>
                            To create a new attribute, you have to fill all the mandatory fields (marked by asterisk) in the “Add attribute” dialog (Fig. 21).
                            If the selected value type is “enumeration”, then additional button will appear to add domain elements, 
                            like in the “Edit attributes” dialog (Fig. 22). After filling the fields, click “APPLY” to save changes and close the dialog.
                            If you want to cancel the changes, press “Escape” key on the keyboard, “CANCEL” button visible in the dialog,
                            or click anywhere outside the dialog.
                        </Typography>
                        <Typography component={"header"} paragraph={true} variant={"h6"}>
                            Edit attributes
                        </Typography>
                        <Image src={editAttributes} caption={"FIGURE 22: Edit attributes dialog"} />
                        <Typography>
                            In order to edit an attribute, you have to select it from the “ATTRIBUTES” list. After selecting the attribute,
                            all the attribute fields will appear (Fig. 22), and you can make desirable changes. After that, you have to click “APPLY” button
                            to save that changes and close the dialog. If you want to cancel the changes, press “Escape” key on the keyboard,
                            “CANCEL” button visible in the dialog, or click anywhere outside the dialog.
                        </Typography>
                        <Typography component={"header"} paragraph={true} variant={"h6"}>
                            Save to file
                        </Typography>
                        <Image src={saveToFile} caption={"FIGURE 23: Save to file dialog"} />
                        <Typography>
                            This dialog enables to save attributes (metadata) to JSON file and objects (data) to JSON or CSV file.
                            If the CSV file option is marked, then you can also choose the separator and indicate if the data should have the header row.
                            The default separator is a comma, other options are tab, space and semicolon.
                        </Typography>

                        <Typography component={"header"} paragraph={true} variant={"h6"}>
                            Transform
                        </Typography>
                        <Image src={transform} caption={"FIGURE 24: Impose preference orders dialog"} />
                        <Typography>
                            This dialog enables to perform non-invasive transformation of the data (more details in user's guide).
                            For an ordinal classification problem (where decision attribute has “gain” or “cost” preference type),
                            it is verified which active condition (evaluation) attributes are eligible for preference order imposition or binarization.
                            If any active condition (evaluation) attribute has preference type “none” and value type different than “enumeration”,
                            it is cloned. Then, the first clone is assigned a “gain” preference type, and the second one is assigned a “cost” preference type.
                            If any active condition (evaluation) attribute has preference type “none”, value type “enumeration”, and at least three
                            different evaluations in its value set (domain), it can be binarized, depending on user’s choice.
                        </Typography>
                    </React.Fragment>
                }
            />
        </React.Fragment>
    );
}

Data.propTypes = {
    chapterId: PropTypes.string.isRequired
};

export default Data;
