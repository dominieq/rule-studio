import React from "react";
import PropTypes from "prop-types";
import VirtualizedTable from "../../../DataDisplay/VirtualizedTable";

function TraitsTable(props) {
    const { columnsLabels, ratio, traits, widthOffset, ...other } = props;

    const rowCount = Object.keys(traits).length;

    const columns = [
        {
            dataKey: "key",
            label: columnsLabels.key,
            width: widthOffset * ratio,
        },
        {
            dataKey: "value",
            label: columnsLabels.value,
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
    columnsLabels: PropTypes.exact({
        key: PropTypes.string,
        value: PropTypes.string
    }),
    ratio: PropTypes.number,
    traits: PropTypes.object.isRequired,
    widthOffset: PropTypes.number,
};

TraitsTable.defaultProps = {
    columnsLabels: {
        key: "Characteristic",
        value: "Value"
    },
    ratio: 0.5,
    widthOffset: 200,
};

export default TraitsTable;