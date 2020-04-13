import React from "react";
import PropTypes from "prop-types";
import VirtualizedTable from "../../../DataDisplay/VirtualizedTable";

function TraitsTable(props) {
    const { ratio, traits, widthOffset, ...other } = props;

    const rowCount = Object.keys(traits).length;

    const columns = [
        {
            dataKey: "key",
            label: "Name",
            width: widthOffset * ratio,
        },
        {
            dataKey: "value",
            label: "Value",
            width: widthOffset * (1 - ratio),
        }
    ];

    const getRows = () => {
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

    return (
        <VirtualizedTable
            columns={columns}
            rowCount={rowCount}
            rowGetter={({ index }) => getRows()[index]}
            {...other}
        />
    )
}

TraitsTable.propTypes = {
    cellRenderer: PropTypes.func,
    ratio: PropTypes.number,
    traits: PropTypes.object.isRequired,
    widthOffset: PropTypes.number,
};

TraitsTable.defaultProps = {
    ratio: 0.5,
    widthOffset: 200,
};

export default TraitsTable;