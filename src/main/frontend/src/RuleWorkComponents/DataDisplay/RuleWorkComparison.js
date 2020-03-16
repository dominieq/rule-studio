import React, {Component} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import VirtualizedTable from "./VirtualizedTable";
import Paper from "@material-ui/core/Paper";

class RuleWorkComparison extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.setRowsStyle = this.setRowsStyle.bind(this);
    }

    getColumns() {
        if(this.props.objectBeforeDialog !== undefined)
            return [{width: 50, label: 'Attribute name:', dataKey: 'name'},
                    {width: 50, label: `Object ${this.props.objectBeforeDialog+1}`, dataKey: "o1", },
                    {width: 50, label: 'Relation', dataKey: 'relation'},
                    {width: 50, label: `Object ${this.props.objectInDialog+1}`, dataKey: "o2"}];       
        
        return [{width: 50, label: 'Attribute name:', dataKey: 'name'},
                {width: 50, label: `Value of Object ${this.props.objectInDialog+1}:`, dataKey: "o1", }];
    }

    getAppropriateSign(o1,o2, attributeName) {
        const column = this.props.informationTable.attributes.find(x => x.name === attributeName);
        switch(column.preferenceType) {
            case "gain":
                if(o1[attributeName] > o2[attributeName]) return "\u2ab0"; // >= \u227B >
                else if (o1[attributeName] < o2[attributeName]) return "\u2aaf"; // <= \u227A <
                else return "=";
            case "cost":
                if(o1[attributeName] > o2[attributeName]) return "\u2aaf";
                else if (o1[attributeName] < o2[attributeName]) return "\u2ab0";
                else return "=";
            default:
                return "uncomparable";
        }
    }

    getRows() {
        const objects = [...this.props.informationTable.objects];
        const objectInDialog = this.props.objectInDialog;
        const tmp = [];

        const allProperties = Object.keys(objects[objectInDialog]);
        if(this.props.objectBeforeDialog !== undefined) {
            const objectBeforeDialog = this.props.objectBeforeDialog;
            for(let property in allProperties) {
                tmp.push({  name: allProperties[property],
                            o1: objects[objectBeforeDialog][allProperties[property]],
                            o2: objects[objectInDialog][allProperties[property]],
                            relation: this.getAppropriateSign(objects[objectBeforeDialog], objects[objectInDialog], allProperties[property]),
                        });
            }        
            return tmp;
        } else {
            for(let property in allProperties) {
                tmp.push({  name: allProperties[property],
                            o1: objects[objectInDialog][allProperties[property]],
                        });
            }        
            return tmp;
        }
        
    }

    rowCount() {
        return Object.keys(this.props.informationTable.objects[this.props.objectInDialog]).length;
    }

    setRowsStyle(row) {
        const attributes = [...this.props.informationTable.attributes];

        const attribute = attributes[row.index];
        if(row.index >= 0) { //row index = -1 for header column
            if(attribute.active === false || attribute.identifierType !== undefined || attribute.type === "description" ) return { backgroundColor: "#A0A0A0" }
            else {
                if(attribute.preferenceType === "gain") return { backgroundColor: "#228B22" }
                else if(attribute.preferenceType === "cost") return { backgroundColor: "#DC143C" }
                else if(attribute.preferenceType === "none") return { backgroundColor: "#3F51B5" }
                else return { backgroundColor: "#A0A0A0" }
            }
        }
    }

    render() {
        const {objectBeforeDialog, objectInDialog, informationTable, ...other} = this.props;
        return (
            <Paper style={{ height: '100%', width: '100%' }} {...other}>
                <VirtualizedTable
                    rowCount={this.rowCount()}
                    rowGetter={({ index }) => this.getRows()[index]}
                    columns={this.getColumns()}
                    rowStyle={this.setRowsStyle}
                />
            </Paper>
        )
        
    }
}

// Expected props:
// objectBeforeDialog (optional) <-- index of the chosen object (e.g. in cones after click on the object the full width dialog appears and to that dialog this objectBeforeDialog is passed as prop in children)
//                                    (optional because e.g. unions are "AT MOST or AT LEAST" something, meaning we don't choose any object.) 
// objectInDialog (required) <-- index of the object clicked in one of the tables (already in dialog) 
// informationTable (required) <-- informationTable from project 
// anything other (optional) <-- additional settings for Paper

//Example of props:
/*
    objectBeforeDialog = {4},
    objectInDialog = {46},
    informationTable = {attributes=[...], objects:[...]}
}
*/

RuleWorkComparison.propTypes = {
    objectBeforeDialog: PropTypes.number,
    objectInDialog: PropTypes.number,
    informationTable: PropTypes.object,
};

export default RuleWorkComparison;