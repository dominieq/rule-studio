import React from "react";
import PropTypes from "prop-types";
import VirtualizedTable from "../../../DataDisplay/VirtualizedTable";

const columns = [
    {
        dataKey: "key",
        label: "Name",
        width: 100,
    },
    {
        dataKey: "value",
        label: "Value",
        width: 100,
    }
];

const getRows = (traits) => {
    let rows = [];
    const keys = Object.keys(traits);
    for (let i = 0; i < keys.length; i++) {
        rows.push({
            key: keys[i],
            value: traits[keys[i]],
        });
    }
    return rows;
};

function TraitsTable(props) {
    const { traits } = props;

    return (
        <VirtualizedTable
            columns={columns}
            rowCount={Object.keys(traits).length}
            rowGetter={({ index }) => getRows(traits)[index]}
        />
    )
}

TraitsTable.propTypes = {
    traits: PropTypes.object.isRequired,
};

export default TraitsTable;