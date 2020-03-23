import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";
import RuleWorkBox from "../../Containers/RuleWorkBox";
import RuleWorkCharacteristics from "./Elements/RuleWorkCharacteristics";
import RuleWorkComparison from "./Elements/RuleWorkComparison";
import RuleWorkDataTables from "./Elements/RuleWorkDataTables";
import RuleWorkTableElements from "./Elements/RuleWorkTableElements";
import StyledButton from "../../Inputs/StyledButton";
import StyledDialog from "../StyledDialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import "./RuleWorkDialog.css";

class RuleWorkDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tableIndex: undefined,
            itemInTableIndex: undefined,
        };

        this.indexOfIndicesOfCoveredObjects = 2;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.item.name !== this.props.item.name){
            this.setState({
                tableIndex: undefined,
                itemInTableIndex: undefined
            });
        }
    }

    onTableSelected = (index) => {
        this.setState({
            tableIndex: index,
            itemInTableIndex: undefined
        });
    };

    onItemInTableSelected = (index) => {
        this.setState({itemInTableIndex: index});
    };

    getChosenTableForRules = (tables) => {
        let counter = 0;
        for(let i in tables) {
            if(this.indexOfIndicesOfCoveredObjects === counter) return tables[i];        
            counter++;
        }
    };

    render() {
        const {tableIndex, itemInTableIndex} = this.state;
        const {item, projectResult, tabName, onClose, ...other} = this.props;
       
        let characteristicsExist = false;
        if(item.traits) characteristicsExist = (Object.keys(item.traits).length !== 0);


        return (
            <StyledDialog fullScreen {...other} onClose={onClose}>
                <DialogContent className="ruleWorkDialog">
                    <div className="ruleWorkDialog-top">
                    <DialogContentText color="inherit">
                        {"Selected item: " + item.name}
                    </DialogContentText>
                    </div>
                    {tabName !== "rules" &&
                        <div className="ruleWorkDialog-bottom">
                            <div className="ruleWorkDialog-left">
                                <div className="ruleWorkDialog-left-first">
                                    <RuleWorkBox id={"dialog-object-list-left"} styleVariant={"tab-body"}>
                                        <RuleWorkDataTables
                                            onTableSelected={this.onTableSelected}
                                            tables={item.tables}
                                        />
                                    </RuleWorkBox>
                                </div>
                                <div className="ruleWorkDialog-left-second">
                                    {!Number.isNaN(Number(tableIndex)) &&
                                        <RuleWorkBox id={"dialog-object-list-right"} styleVariant={"tab-body"}>
                                            <RuleWorkTableElements
                                                onTableItemSelected={this.onItemInTableSelected}
                                                table={Object.values(item.tables)[tableIndex]}
                                            />
                                        </RuleWorkBox>
                                    }
                                </div>
                            </div>
                            <div className="ruleWorkDialog-right">
                                {item.traits &&
                                    <Fragment>
                                        <div className="ruleWorkDialog-right-up">
                                            <RuleWorkCharacteristics traits={item.traits} />
                                        </div>
                                        {!Number.isNaN(Number(itemInTableIndex)) &&
                                            <div className={'ruleWorkDialog-right-down'}>
                                                <RuleWorkComparison
                                                    informationTable={projectResult.informationTable}
                                                    itemIndex={item.id}
                                                    itemInTableIndex={itemInTableIndex}
                                                />
                                            </div>
                                        }
                                    </Fragment>
                                }
                                {!item.traits && !Number.isNaN(Number(itemInTableIndex))
                                    &&  <RuleWorkComparison
                                            informationTable={projectResult.informationTable}
                                            itemIndex={item.id}
                                            itemInTableIndex={itemInTableIndex}
                                        />
                                }
                            </div>
                        </div>
                    }
                    {tabName === "rules" &&
                        <div className="ruleWorkDialog-bottom">
                            <div className="ruleWorkDialog-left">
                                <div className="ruleWorkDialog-left-first">
                                    { characteristicsExist === true &&
                                        <RuleWorkCharacteristics traits={item.traits} />
                                    }
                                </div>
                                <div className="ruleWorkDialog-left-second">
                                    {
                                        <RuleWorkBox id={"dialog-object-list"} styleVariant={"tab-body"}>
                                            <RuleWorkTableElements
                                                onTableItemSelected={this.onItemInTableSelected}
                                                table={this.getChosenTableForRules(item.tables)}
                                            />
                                        </RuleWorkBox>
                                    }
                                </div>
                            </div>
                            <div className="ruleWorkDialog-right">
                                {  itemInTableIndex !== -1
                                    &&  <RuleWorkComparison
                                            informationTable={projectResult.informationTable}
                                            itemIndex={item.id}
                                            itemInTableIndex={itemInTableIndex}
                                        />
                                }
                            </div>
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                    <StyledButton onClick={onClose} themeVariant={"secondary"} variant={"outlined"}>
                        Close
                    </StyledButton>
                </DialogActions>
            </StyledDialog>
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
    item: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        traits: PropTypes.object,
        actions: PropTypes.object,
        tables: PropTypes.object,
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool,
    projectResult: PropTypes.object,
    tabName: PropTypes.oneOf(["unions", "cones", "rules", "classification", "cross-validation"]),
};

export default RuleWorkDialog;