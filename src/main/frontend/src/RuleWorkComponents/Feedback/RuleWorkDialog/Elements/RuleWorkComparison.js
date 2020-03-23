import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import VirtualizedTable from "./VirtualizedTable";
import Paper from "@material-ui/core/Paper";

class RuleWorkComparison extends PureComponent {

    getColumns = () => {
        const {itemIndex, itemInTableIndex} = this.props;

        return [
            {
                dataKey: 'name',
                label: 'Attribute name',
                width: 50,
            },
            {
                dataKey: 'object-left',
                label: `Object ${itemIndex + 1}`,
                width: 50,
            },
            {
                dataKey: 'relation',
                label: 'Relation',
                width: 50,
            },
            {
                dataKey: 'object-right',
                label: `Object ${itemInTableIndex + 1}`,
                width: 50,
            }
        ];
    };

    getAppropriateSign = (o1,o2, attributeName) => {
        const column = this.props.informationTable.attributes.find(attribute => attribute.name === attributeName);

        if (Object.keys(column).includes("preferenceType")){
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
        } else {
            return "uncomparable"
        }
    };

    getRows = () => {
        const {itemIndex, itemInTableIndex} = this.props;
        const objects = [...this.props.informationTable.objects];
        console.log(objects[itemInTableIndex]);
        console.log(objects[itemIndex]);
        const allProperties = Object.keys(objects[itemInTableIndex]);
        let rows = [];
        for (let i = 0; i < allProperties.length; i++) {
            if (allProperties[i] !== 'uniqueLP') {
                rows.push({
                    name: allProperties[i],
                    'object-left': objects[itemIndex][allProperties[i]],
                    'object-right': objects[itemInTableIndex][allProperties[i]],
                    relation: this.getAppropriateSign(objects[itemIndex], objects[itemInTableIndex], allProperties[i]),
                });
            }
        }
        return rows;
    };

    setRowsStyle = (row) => {
        const attributes = [...this.props.informationTable.attributes];

        if(row.index >= 0) { //row index = -1 for header column
            const attribute = attributes[row.index];
            if(attribute.active === false || attribute.identifierType !== undefined || attribute.type === "description" ) {
                return { backgroundColor: "#A0A0A0" };
            }
            else {
                if(attribute.preferenceType === "gain") return { backgroundColor: "#228B22" };
                else if(attribute.preferenceType === "cost") return { backgroundColor: "#DC143C" };
                else if(attribute.preferenceType === "none") return { backgroundColor: "#3F51B5" };
                else return { backgroundColor: "#A0A0A0" }
            }
        }
    };

    render() {
        const {itemInTableIndex, informationTable} = this.props;

        console.log(informationTable.objects[this.props.itemIndex]);
        console.log(informationTable.objects[itemInTableIndex]);

        const columns = this.getColumns();
        const rows = this.getRows();
        console.log(rows);
        let rowCount = Object.keys(informationTable.objects[itemInTableIndex]).length;
        if (Object.keys(informationTable.objects[itemInTableIndex]).includes("uniqueLP")) rowCount = rowCount -1;

        return (
            <Paper style={{ height: '100%', width: '100%' }}>
                <VirtualizedTable
                    columns={columns}
                    rowCount={rowCount}
                    rowGetter={({ index }) => rows[index]}
                    rowStyle={this.setRowsStyle}
                />
            </Paper>
        );
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
    informationTable: PropTypes.object.isRequired,
    itemIndex: PropTypes.number.isRequired,
    itemInTableIndex: PropTypes.number.isRequired,
};

export default RuleWorkComparison;