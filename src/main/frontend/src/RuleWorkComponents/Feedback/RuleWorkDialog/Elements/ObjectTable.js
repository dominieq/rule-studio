import React from "react";
import PropTypes from "prop-types";
import getAppropriateColor from "../Utils/getAppropriateColor";
import VirtualizedTable from "../../../DataDisplay/VirtualizedTable";

function ObjectTable(props) {
    const {
        informationTable: { attributes, objects },
        objectHeader,
        objectIndex
    } = props;

    const rowCount = attributes.length;

    const columns = [
        {
            dataKey: "name",
            label: "Attribute name",
            width: 100
        },
        {
            dataKey: "object",
            label: objectHeader ? objectHeader : `Object ${objectIndex + 1}`,
            width: 100
        }
    ];

    let rows = [];
    for (let i = 0; i < attributes.length; i++) {
        rows.push({
            name: attributes[i].name,
            object: objects[objectIndex][attributes[i].name]
        })
    }

    return (
        <VirtualizedTable
            columns={columns}
            rowCount={rowCount}
            rowGetter={({ index }) => rows[index]}
            rowStyle={({index}) => index >= 0 && getAppropriateColor(attributes[index])}
        />
    )
}

ObjectTable.propTypes = {
    informationTable: PropTypes.object.isRequired,
    objectIndex: PropTypes.number.isRequired,
    objectHeader: PropTypes.string,
};

export default ObjectTable;