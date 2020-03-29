import React from "react";
import PropTypes from "prop-types";
import getAppropriateColor from "../Utils/getAppropriateColor";
import VirtualizedTable from "../Utils/VirtualizedTable";

function VirtualizedItem(props) {
    const { informationTable: { attributes, objects }, itemInTableIndex } = props;

    const rowCount = attributes.length;

    const columns = [
        {
            dataKey: "name",
            label: "Attribute name",
            width: 100
        },
        {
            dataKey: "object",
            label: `Object ${itemInTableIndex}`,
            width: 100
        }
    ];

    let rows = [];
    for (let i = 0; i < attributes.length; i++) {
        rows.push({
            name: attributes[i].name,
            object: objects[itemInTableIndex][attributes[i].name]
        })
    }

    const setRowsStyle = ({index}) => {
        if (index >= 0) return getAppropriateColor(attributes[index]);
    };

    return (
        <VirtualizedTable
            columns={columns}
            rowCount={rowCount}
            rowGetter={({ index }) => rows[index]}
            rowStyle={setRowsStyle}
        />
    )

}

VirtualizedItem.propTypes = {
    informationTable: PropTypes.object.isRequired,
    itemInTableIndex: PropTypes.number.isRequired
};

export default VirtualizedItem;