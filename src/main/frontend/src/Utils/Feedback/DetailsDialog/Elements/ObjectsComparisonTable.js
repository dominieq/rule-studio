import React from "react";
import PropTypes from "prop-types";
import getAppropriateColor from "../Utils/getAppropriateColor";
import getAppropriateSign from "../Utils/getAppropriateSign";
import VirtualizedTable from "../../../DataDisplay/VirtualizedTable";

function ObjectsComparisonTable(props) {
    const {
        informationTable: { attributes, objects },
        objectHeader,
        objectIndex,
        objectInTableHeader,
        objectInTableIndex,
        tableIndex
    } = props;

    const rowCount = attributes.length;

    const columns = [
        {
            dataKey: 'name',
            label: 'Attribute name',
            width: 50,
        },
        {
            dataKey: 'object-left',
            label: objectHeader ? objectHeader : `Object ${objectIndex + 1}`,
            width: 50,
        },
        {
            dataKey: 'relation',
            label: 'Relation',
            width: 50,
        },
        {
            dataKey: 'object-right',
            label: objectInTableHeader ? objectInTableHeader : `Object ${objectInTableIndex + 1}`,
            width: 50,
        }
    ];

    let rows = [];
    for (let i = 0; i < attributes.length; i++) {
        rows.push({
            name: attributes[i].name,
            'object-left': objects[objectIndex][attributes[i].name],
            relation: getAppropriateSign(objects[objectIndex], objects[objectInTableIndex], attributes[i], tableIndex),
            'object-right': objects[objectInTableIndex][attributes[i].name],
        });
    }

    return (
        <VirtualizedTable
            columns={columns}
            rowCount={rowCount}
            rowGetter={({ index }) => rows[index]}
            rowStyle={({index}) => index >= 0 && getAppropriateColor(attributes[index])}
        />
    );
}

ObjectsComparisonTable.propTypes = {
    informationTable: PropTypes.object.isRequired,
    objectHeader: PropTypes.string,
    objectIndex: PropTypes.number.isRequired,
    objectInTableHeader: PropTypes.string,
    objectInTableIndex: PropTypes.number.isRequired,
    tableIndex: PropTypes.number,
};

export default ObjectsComparisonTable;