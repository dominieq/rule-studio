import React, { Fragment } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import EditIcon from '@material-ui/icons/Edit';
import TransformIcon from '@material-ui/icons/Transform';
import StyledButton from "../../../Utils/Inputs/StyledButton";
import RuleWorkTooltip from '../../../Utils/DataDisplay/RuleWorkTooltip';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

export default function IconLabelButtons(props) {
    const style = {
      margin: "0px 0px 0px 16px",
    }

    return (
     <Fragment>
        {/*<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />*/}

        <RuleWorkTooltip title={`Add new example at the end of the table`}>
          {props.whichDevice === "desktop" ?
            <StyledButton
              disableElevation={true}
              onClick={() => props.insertRow(0,0)}
              startIcon={<AddIcon />}
              themeVariant={"primary"}
              variant={"contained"}
              style={style}
            >
            Add example
            </StyledButton>
          : <StyledButton
              isIcon={true}
              onClick={() => props.insertRow(0,0)}
              style={style}
            >
              <AddIcon />
            </StyledButton>
        }
        </RuleWorkTooltip>

        <RuleWorkTooltip title={`Delete selected examples`}>
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
        </RuleWorkTooltip>

        <RuleWorkTooltip title={`Add new attribute`}>
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
        </RuleWorkTooltip>

        <RuleWorkTooltip title={`Edit attributes`}>
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
        </RuleWorkTooltip>

        <RuleWorkTooltip title={`Save objects (data) and attributes (metadata) to files`}>
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
        </RuleWorkTooltip>

        <RuleWorkTooltip title={`Impose preference orders`}>
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
        </RuleWorkTooltip>

        <RuleWorkTooltip title={`undo changes`}>
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
        </RuleWorkTooltip>

        <RuleWorkTooltip title={`redo changes`}>
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
        </RuleWorkTooltip>

    </Fragment>
    );
}