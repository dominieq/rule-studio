import React from "react";
import PropTypes from "prop-types";
import getAppropriateColor from "../Utils/getAppropriateColor";
import getAppropriateSign from "../Utils/getAppropriateSign";
import VirtualizedTable from "../../../DataDisplay/VirtualizedTable";

function VirtualizedComparison(props) {
    const { informationTable: { attributes, objects }, itemIndex, itemInTableIndex } = props;

    const rowCount = attributes.length;

    const columns = [
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

    let rows = [];
    for (let i = 0; i < attributes.length; i++) {
        rows.push({
            name: attributes[i].name,
            'object-left': objects[itemIndex][attributes[i].name],
            'object-right': objects[itemInTableIndex][attributes[i].name],
            relation: getAppropriateSign(objects[itemIndex], objects[itemInTableIndex], attributes[i]),
        });
    }

    const setRowsStyle = ({index}) => {
        if(index >= 0) return getAppropriateColor(attributes[index]);
    };

    return (
        <VirtualizedTable
            columns={columns}
            rowCount={rowCount}
            rowGetter={({ index }) => rows[index]}
            rowStyle={setRowsStyle}
        />
    );
}

// Expected props:
// itemIndex (required) <-- index of an item selected in RuleWorkList inside ProjectTabs
// itemInTableIndex (required) <-- index of an item from one of tables
// informationTable (required) <-- informationTable from project
VirtualizedComparison.propTypes = {
    informationTable: PropTypes.object.isRequired,
    itemIndex: PropTypes.number.isRequired,
    itemInTableIndex: PropTypes.number.isRequired,
};

export default VirtualizedComparison;