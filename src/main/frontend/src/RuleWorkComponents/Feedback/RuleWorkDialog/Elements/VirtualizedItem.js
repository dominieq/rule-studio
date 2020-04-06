import React from "react";
import PropTypes from "prop-types";
import getAppropriateColor from "../Utils/getAppropriateColor";
import VirtualizedTable from "../../../DataDisplay/VirtualizedTable";

function VirtualizedItem(props) {
    const { index, informationTable: { attributes, objects } } = props;

    const rowCount = attributes.length;

    const columns = [
        {
            dataKey: "name",
            label: "Attribute name",
            width: 100
        },
        {
            dataKey: "object",
            label: `Object ${index + 1}`,
            width: 100
        }
    ];

    let rows = [];
    for (let i = 0; i < attributes.length; i++) {
        rows.push({
            name: attributes[i].name,
            object: objects[index][attributes[i].name]
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
    index: PropTypes.number.isRequired,
    informationTable: PropTypes.object.isRequired,
};

export default VirtualizedItem;