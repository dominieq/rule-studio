import React, { Fragment } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import EditIcon from '@material-ui/icons/Edit';
import TransformIcon from '@material-ui/icons/Transform';
import StyledButton from "../../../Utils/Inputs/StyledButton";
import CustomTooltip from '../../../Utils/DataDisplay/CustomTooltip';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

export default function IconLabelButtons(props) {
    const style = {
      margin: "0px 0px 0px 16px",
    }

    return (
     <Fragment>
        {/*<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />*/}

        <CustomTooltip title={`Add new object at the end of the table`}>
          {props.whichDevice === "desktop" ?
            <StyledButton
              disableElevation={true}
              onClick={() => props.insertRow(0,0)}
              startIcon={<AddIcon />}
              themeVariant={"primary"}
              variant={"contained"}
              style={style}
            >
            Add object
            </StyledButton>
          : <StyledButton
              isIcon={true}
              onClick={() => props.insertRow(0,0)}
              style={style}
            >
              <AddIcon />
            </StyledButton>
        }
        </CustomTooltip>

        <CustomTooltip title={`Delete selected objects`}>
          {props.whichDevice === "desktop" ?
            <StyledButton
              disableElevation={true}
              onClick={() => props.deleteRow()}
              startIcon={<DeleteIcon />}
              themeVariant={"primary"}
              variant={"contained"}
              style={style}
            >
              Delete Selected
            </StyledButton>
          : <StyledButton
              isIcon={true}
              onClick={() => props.deleteRow()}
              style={style}
            >
              <DeleteIcon />
            </StyledButton>
        }
        </CustomTooltip>

        <CustomTooltip title={`Add new attribute`}>
        {props.whichDevice === "desktop" ?
          <StyledButton
            disableElevation={true}
            onClick={() => props.onAddAttribute()}
            startIcon={<AddIcon />}
            themeVariant={"primary"}
            variant={"contained"}
            style={style}
          >
            Add attribute
          </StyledButton>
          : <StyledButton
              isIcon={true}
              onClick={() => props.onAddAttribute()}
              style={style}
            >
              <AddIcon />
            </StyledButton>
          }
        </CustomTooltip>

        <CustomTooltip title={`Edit attributes`}>
        {props.whichDevice === "desktop" ?
            <StyledButton
              disableElevation={true}
              onClick={() => props.onEditAttributes()}
              startIcon={<EditIcon />}
              themeVariant={"primary"}
              variant={"contained"}
              style={style}
            >
              Edit attributes
            </StyledButton>
          : <StyledButton
              isIcon={true}
              onClick={() => props.onEditAttributes()}
              style={style}
            >
              <EditIcon />
            </StyledButton>
          }
        </CustomTooltip>

        <CustomTooltip title={`Save objects (data) and attributes (metadata) to files`}>
        {props.whichDevice === "desktop" ?
            <StyledButton
              disableElevation={true}
              onClick={() => props.saveToFileDialog()}
              startIcon={<SaveAltIcon />}
              themeVariant={"primary"}
              variant={"contained"}
              style={style}
            >
              Save to file
            </StyledButton>
          : <StyledButton
              isIcon={true}
              onClick={() => props.saveToFileDialog()}
              style={style}
            >
              <SaveAltIcon />
            </StyledButton>
          }
        </CustomTooltip>

        <CustomTooltip title={`Performs non-invasive transformation of the data according to the method
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
              disableElevation={true}
              onClick={() => props.openOnTransform()}
              startIcon={<TransformIcon />}
              themeVariant={"primary"}
              variant={"contained"}
              style={style}
            >
              Transform
            </StyledButton>
        :   <StyledButton
              isIcon={true}
              onClick={() => props.openOnTransform()}
              style={style}
            >
              <TransformIcon />
            </StyledButton>
            }
        </CustomTooltip>

        <CustomTooltip title={`undo changes`}>
        {props.whichDevice === "desktop" ?
            <StyledButton
              disableElevation={true}
              onClick={() => props.onBack()}
              startIcon={<UndoIcon />}
              themeVariant={"primary"}
              variant={"contained"}
              style={style}
              disabled={props.historySnapshot <= 0}
            >
              Undo
            </StyledButton>
        :   <StyledButton
              isIcon={true}
              onClick={() => props.onBack()}
              style={style}
              disabled={props.historySnapshot <= 0}
            >
              <UndoIcon />
            </StyledButton>
            }
        </CustomTooltip>

        <CustomTooltip title={`redo changes`}>
        {props.whichDevice === "desktop" ?
            <StyledButton
              disableElevation={true}
              onClick={() => props.onRedo()}
              startIcon={<RedoIcon />}
              themeVariant={"primary"}
              variant={"contained"}
              style={style}
              disabled={props.historyLength-props.historySnapshot <= 1}
            >
              Redo
            </StyledButton>
        :   <StyledButton
              isIcon={true}
              onClick={() => props.onRedo()}
              style={style}
              disabled={props.historyLength-props.historySnapshot <= 1}
            >
              <RedoIcon />
            </StyledButton>
            }
        </CustomTooltip>

    </Fragment>
    );
}