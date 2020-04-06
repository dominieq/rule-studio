import React from "react";
import PropTypes from "prop-types";
import VirtualizedTable from "../../../DataDisplay/VirtualizedTable";

const columns = [
    {
        dataKey: "key",
        label: "Name",
        width: 200,
    },
    {
        dataKey: "value",
        label: "Value",
        width: 200,
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

function VirtualizedTraits(props) {
    const {traits} = props;

    return (
        <VirtualizedTable
            rowCount={Object.keys(traits).length}
            rowGetter={({ index }) => getRows(traits)[index]}
            columns={columns}
        />
    )
}

// Expected props:
// traits (required) <-- object containing characteristics of selected item

// Example of props:
/* traits = {accuracyOfApproximation: 0.17234567898765} */
VirtualizedTraits.propTypes = {
    traits: PropTypes.object.isRequired,
};

export default VirtualizedTraits;