import React, {Component} from 'react';
import PropTypes from "prop-types";
import "./RuleWorkDialog.css";
import StyledDialog from "../../RuleWorkComponents/Feedback/StyledDialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import RuleWorkCharacteristics from "../DataDisplay/RuleWorkCharacteristics";
import RuleWorkDataTables from "../DataDisplay/RuleWorkDataTables";
import RuleWorkTableElements from "../DataDisplay/RuleWorkTableElements";
import RuleWorkComparison from "../DataDisplay/RuleWorkComparison";
import RuleWorkBox from "../Containers/RuleWorkBox";

class RuleWorkDialog extends Component {
    constructor(props) {
        super(props);


        this.state = {
            tableIndex: -1,     
            objectIndex: -1,      
        };

        this.indexOfIndicesOfCoveredObjects = 2;
    }

    componentDidUpdate(prevProps) {
        if(prevProps.name !== this.props.name)
        this.setState({
            tableIndex: -1,     
            objectIndex: -1,
        })
    }

    setChosenTable = (index) => {
        this.setState({
            tableIndex: index,     
            objectIndex: -1, //reset object index
        })
    }

    getChosenTable = (tables, index) => {
        let counter = 0;
        for(let i in tables) {
            if(index === counter) return tables[i];        
            counter++;
        }
    }

    getChosenTableForRules = (tables) => {
        let counter = 0;
        for(let i in tables) {
            if(this.indexOfIndicesOfCoveredObjects === counter) return tables[i];        
            counter++;
        }
    }

    setChosenObject = (index) => {
        this.setState({
            objectIndex: index
        })
    }

    getChosenObject = (tables) => {
        return this.getChosenTable(tables,this.state.tableIndex)[this.state.objectIndex];
    }
   
    getObjectBeforeDialog = (id, tabName) => {
        if(tabName !== "unions" && tabName !== "rules") {
            return parseInt(id,10);
        }
        return undefined;
    }

    render() {
        const {id, name, tables, tabName, traits, onClose, result, ...other} = this.props;
       
        let characteristicsExist = false;
        if(traits) characteristicsExist = (Object.keys(traits).length !== 0 ? true : false);
        return (
            <div>
               <StyledDialog fullScreen {...other} onClose={onClose}> 
               <DialogContent className="ruleWorkDialog">
                   <div className="ruleWorkDialog-top">
                    <DialogContentText color="inherit">
                        {tabName === "cones" ? `Selected object: ${name}`
                        : (tabName === "unions" ? `Selected union: ${name}` 
                        : (tabName === "rules" ? `Selected rule: ${name}` 
                        : null
                        ))}
                    </DialogContentText>
                    </div>

                    {tabName !== "rules" &&
                        <div className="ruleWorkDialog-bottom"> 
                            <div className="ruleWorkDialog-left">
                                <div className="ruleWorkDialog-left-first">
                                                <RuleWorkBox id={"dialog-object-list-left"} styleVariant={"tab-body1"}>
                                                    <RuleWorkDataTables tables={tables} setChosenTable={this.setChosenTable} tabName={tabName}/>
                                                </RuleWorkBox>  
                                </div>
                                <div className="ruleWorkDialog-left-second">
                                        {this.state.tableIndex !== -1 && 
                                            <RuleWorkBox id={"dialog-object-list-right"} styleVariant={"tab-body1"}>
                                                <RuleWorkTableElements setChosenObject={this.setChosenObject} chosenTable={this.getChosenTable(tables,this.state.tableIndex)} tabName={tabName} />
                                            </RuleWorkBox>
                                        } 
                                </div>
                            </div>
                            <div className="ruleWorkDialog-right">
                                { characteristicsExist === true //if charecteristics exist then display them on the half of the heigt of the screen
                                    &&  <div className="ruleWorkDialog-right-up">
                                            <RuleWorkCharacteristics traits={traits} />
                                        </div>
                                }
                                {characteristicsExist === true //and also display object comparison
                                    &&  <div className={'ruleWorkDialog-right-down'}>
                                            {this.state.objectIndex !== -1 && 
                                                <RuleWorkComparison  objectInDialog={this.getChosenObject(tables)} objectBeforeDialog={this.getObjectBeforeDialog(id,tabName)} informationTable={result.informationTable} />
                                            }
                                        </div>
                                }
                                { characteristicsExist === false //if characteristics don't exist then display comparison on full height
                                    &&  this.state.objectIndex !== -1 
                                    &&  <RuleWorkComparison  objectInDialog={this.getChosenObject(tables)} objectBeforeDialog={this.getObjectBeforeDialog(id,tabName)} informationTable={result.informationTable} />
                                }

                            </div>
                        </div>
                    }
                    {tabName === "rules" &&
                        <div className="ruleWorkDialog-bottom"> 
                            <div className="ruleWorkDialog-left">
                                <div className="ruleWorkDialog-left-first">
                                    { characteristicsExist === true &&
                                        <RuleWorkCharacteristics traits={traits} />
                                    }
                                </div>
                                <div className="ruleWorkDialog-left-second">
                                        {
                                            <RuleWorkBox id={"dialog-object-list"} styleVariant={"tab-body1"}>
                                                <RuleWorkTableElements setChosenObject={this.setChosenObject} chosenTable={this.getChosenTableForRules(tables)} tabName={tabName} />
                                            </RuleWorkBox>
                                        } 
                                </div>
                            </div>
                            <div className="ruleWorkDialog-right">
                                {  this.state.objectIndex !== -1 
                                    &&  <RuleWorkComparison  objectInDialog={this.getChosenTableForRules(tables)[this.state.objectIndex]} objectBeforeDialog={this.getObjectBeforeDialog(id,tabName)} informationTable={result.informationTable} />
                                }

                            </div>
                        </div>
                    }

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit"> Close </Button>
                </DialogActions>
                </StyledDialog>
                
            </div>
        );
    }
}

// Expected props:
// id (required) <-- id of the object
// name (optional) <-- name of the object
// tabName (required) <-- tells from which tab the dialog was run (one of "cones","unions","rules")
// traits (required) <-- key value pairs explaining the characteristic
// tables (required) <-- this is the object of arrays of integers (object indexes)
// result (required) <-- this is the result from the project (needed only for informationTable)
// onClose (func, required) <-- function responsible for closing the dialog (also executed on Escape);
// other things (required) <-- other needed things should be:
//      - open={bool value} //if true then dialog is open, if false then dialog is closed

//Example of props:
/*
    id: "1",
    name: "at most",
    traits: { accuracyOfApproximation: 0.7390350877192983, qualityOfApproximation: 0.8199513381995134 },
    tables: {        
        objects: (411) [0, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, …],
        lowerApproximation: (337) [1, 2, 3, 4, 5, 7, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 39, 40, 41, 42, 44, 45, …],
        upperApproximation: (456) [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, …],
        boundary: (119) [0, 6, 8, 20, 21, 37, 38, 50, 52, 53, 57, 64, 65, 66, 90, 94, 97, 102, 103, 104, 112, 115, 116, 118, 121, 125, 142, 161, 165, 209, 224, 228, 230, 231, …],
        positiveRegion: (337) [132, 198, 264, 263, 67, 197, 265, 200, 134, 196, 464, 130, 199, 133, 201, 465, 131, 463, 462, 458, 459, 461, 460, 268, 70, 260, 137, 193, 195, …],
        negativeRegion: (90) [338, 478, 445, 412, 528, 330, 321, 322, 9, 436, 405, 364, 521, 479, 477, 446, 362, 520, 485, 354, 480, 526, 538, 386, 365, 373, 361, 447, 216, …],
        boundaryRegion: (119) [0, 66, 396, 165, 363, 116, 50, 347, 346, 115, 529, 65, 395, 279, 527, 397, 315, 314, 231, 230, 542, 443, 394, 448, 118, 52, 381, 545, 378, 301, …],
    },
    result: {
        id: "560e468a-5453-40f1-ac17-27b19538c09c",
        name: "new project",
        informationTable: {attributes: Array(11), objects: Array(546)},
        dominanceCones: {numberOfObjects: 546, positiveDCones: Array(546), negativeDCones: Array(546), positiveInvDCones: Array(546), negativeInvDCones: Array(546)},
        ruleSetWithCharacteristics: (243) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …],
        calculatedDominanceCones: true,
        calculatedUnionsWithSingleLimitingDecision: true,
        unionsWithSingleLimitingDecision: {downwardUnions: Array(3), upwardUnions: Array(3)},
    },
    tabName: {"unions"},
    onClose={this.onClose}
    open={this.state.isOpen}
}
*/

RuleWorkDialog.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    traits: PropTypes.object,
    tables: PropTypes.object,
    result: PropTypes.object,
    tabName: PropTypes.oneOf(["unions","cones","rules"]),
    onClose: PropTypes.func,
    open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default RuleWorkDialog;