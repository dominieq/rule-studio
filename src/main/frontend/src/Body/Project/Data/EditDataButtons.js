import React, { Fragment } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import EditIcon from '@material-ui/icons/Edit';
import TransformIcon from '@material-ui/icons/Transform';
import { StyledButton, StyledIconButton } from "../../../Utils/Buttons";
import CustomTooltip from '../../../Utils/DataDisplay/CustomTooltip';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

/**
 * These are buttons displayed above the grid (e.g. Add object, Delete selected etc.) except the filter button.
 *
 * @class
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props
 * @param {string} props.whichDevice - One of [desktop, mobile]. If the device width is too small (look into css) then smaller buttons are displayed.
 * @param {function} props.insertRow - Method used to inserting the row after clicking the button.
 * @param {function} props.deleteRow - Method used to deleting selected rows after clicking the button.
 * @param {function} props.onAddAttribute - Method used to open the Add attribute dialog after clicking the button.
 * @param {function} props.onEditAttributes - Method used to open the Edit attributes dialog after clicking the button.
 * @param {function} props.saveToFileDialog - Method used to open the Save to file dialog after clicking the button.
 * @param {function} props.openOnTransform - Method used to open the Impose preference orders dialog after clicking the button.
 * @param {function} props.onBack - Method used to go to the previous step in the history of changes.
 * @param {function} props.onRedo - Method used to go to the next step in the history of changes.
 * @returns {React.ReactElement}
 */
function IconLabelButtons(props) {
    const style = {
        margin: "0px 0px 0px 16px",
    }

    return (
        <Fragment>
            {/*<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />*/}

            <CustomTooltip disableGpu={true} title={`Add new object at the end of the table`}>
                {props.whichDevice === "desktop" ?
                    <StyledButton
                        color={"primary"}
                        disableElevation={true}
                        onClick={() => props.insertRow(0,0)}
                        startIcon={<AddIcon />}
                        style={style}
                        variant={"contained"}
                    >
                        Add object
                    </StyledButton>
                    : <StyledIconButton
                        onClick={() => props.insertRow(0,0)}
                        style={style}
                    >
                        <AddIcon />
                    </StyledIconButton>
                }
            </CustomTooltip>

            <CustomTooltip disableGpu={true} title={`Delete selected objects`}>
                {props.whichDevice === "desktop" ?
                    <StyledButton
                        color={"primary"}
                        disableElevation={true}
                        onClick={() => props.deleteRow()}
                        startIcon={<DeleteIcon />}
                        style={style}
                        variant={"contained"}
                    >
                        Delete Selected
                    </StyledButton>
                    : <StyledIconButton
                        onClick={() => props.deleteRow()}
                        style={style}
                    >
                        <DeleteIcon />
                    </StyledIconButton>
                }
            </CustomTooltip>

            <CustomTooltip disableGpu={true} title={`Add new attribute`}>
                {props.whichDevice === "desktop" ?
                    <StyledButton
                        color={"primary"}
                        disableElevation={true}
                        onClick={() => props.onAddAttribute()}
                        startIcon={<AddIcon />}
                        style={style}
                        variant={"contained"}
                    >
                        Add attribute
                    </StyledButton>
                    : <StyledIconButton
                        onClick={() => props.onAddAttribute()}
                        style={style}
                    >
                        <AddIcon />
                    </StyledIconButton>
                }
            </CustomTooltip>

            <CustomTooltip disableGpu={true} title={`Edit attributes`}>
                {props.whichDevice === "desktop" ?
                    <StyledButton
                        color={"primary"}
                        disableElevation={true}
                        onClick={() => props.onEditAttributes()}
                        startIcon={<EditIcon />}
                        style={style}
                        variant={"contained"}
                    >
                        Edit attributes
                    </StyledButton>
                    : <StyledIconButton
                        onClick={() => props.onEditAttributes()}
                        style={style}
                    >
                        <EditIcon />
                    </StyledIconButton>
                }
            </CustomTooltip>

            <CustomTooltip disableGpu={true} title={`Save objects (data) and attributes (metadata) to files`}>
                {props.whichDevice === "desktop" ?
                    <StyledButton
                        color={"primary"}
                        disableElevation={true}
                        onClick={() => props.saveToFileDialog()}
                        startIcon={<SaveAltIcon />}
                        style={style}
                        variant={"contained"}
                    >
                        Save to file
                    </StyledButton>
                    : <StyledIconButton
                        onClick={() => props.saveToFileDialog()}
                        style={style}
                    >
                        <SaveAltIcon />
                    </StyledIconButton>
                }
            </CustomTooltip>

            <CustomTooltip disableGpu={true} title={`Performs non-invasive transformation of the data according to the method
               described in Błaszczyński, J., Greco, S., Słowiński, R., Inductive
               discovery of laws using monotonic rules, Engineering Applications of
               Artificial Intelligence, 25, 2012, pp. 284-294. For an ordinal
               classification problem (where decision attribute has "gain" or "cost"
               preference type), it is verified which active condition (evaluation)
               attributes are eligible for preference order imposition or binarization.
               If any active condition (evaluation) attribute has preference type
               "none" and value type different than "enumeration", it is cloned. Then,
               the first clone is assigned a "gain" preference type, and the second one
               is assigned a "cost" preference type. If any active condition
               (evaluation) attribute has preference type "none", value type
               "enumeration", and at least three different evaluations in its value set
               (domain), it can be binarized, depending on user’s choice.`}>
                {props.whichDevice === "desktop" ?
                    <StyledButton
                        color={"primary"}
                        disableElevation={true}
                        onClick={() => props.openOnTransform()}
                        startIcon={<TransformIcon />}
                        style={style}
                        variant={"contained"}
                    >
                        Transform
                    </StyledButton>
                    :   <StyledIconButton
                        onClick={() => props.openOnTransform()}
                        style={style}
                    >
                        <TransformIcon />
                    </StyledIconButton>
                }
            </CustomTooltip>

            <CustomTooltip disableGpu={true} title={`Undo changes`}>
                {props.whichDevice === "desktop" ?
                    <StyledButton
                        color={"primary"}
                        disabled={props.historySnapshot <= 0}
                        disableElevation={true}
                        onClick={() => props.onBack()}
                        startIcon={<UndoIcon />}
                        style={style}
                        variant={"contained"}
                    >
                        Undo
                    </StyledButton>
                    :   <StyledIconButton
                        disabled={props.historySnapshot <= 0}
                        onClick={() => props.onBack()}
                        style={style}
                    >
                        <UndoIcon />
                    </StyledIconButton>
                }
            </CustomTooltip>

            <CustomTooltip disableGpu={true} title={`Redo changes`}>
                {props.whichDevice === "desktop" ?
                    <StyledButton
                        color={"primary"}
                        disabled={props.historyLength-props.historySnapshot <= 1}
                        disableElevation={true}
                        onClick={() => props.onRedo()}
                        startIcon={<RedoIcon />}
                        style={style}
                        variant={"contained"}
                    >
                        Redo
                    </StyledButton>
                    :   <StyledIconButton
                        disabled={props.historyLength-props.historySnapshot <= 1}
                        onClick={() => props.onRedo()}
                        style={style}
                    >
                        <RedoIcon />
                    </StyledIconButton>
                }
            </CustomTooltip>

        </Fragment>
    );
}

export default IconLabelButtons;
