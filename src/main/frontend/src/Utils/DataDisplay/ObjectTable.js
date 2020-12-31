import React from "react";
import PropTypes from "prop-types";
import getAppropriateColor from "../Dialogs/DetailsDialog/Utils/getAppropriateColor";
import VirtualizedTable from "./VirtualizedTable";

/**
 * <h3>Overview</h3>
 * The {@link VirtualizedTable} element that presents attributes of an object.
 *
 * @constructor
 * @category Utils
 * @subcategory Data Display
 * @param {Object} props
 * @param {Object} props.attributes - The array of attributes from information table.
 * @param {number} props.object - An object selected from information table.
 * @param {string} props.objectHeader - The name of a selected object.
 * @returns {React.ReactElement}
 */
function ObjectTable(props) {
    const { attributes, object, objectHeader } = props;

    const rowCount = attributes.length;

    const columns = [
        {
            dataKey: "name",
            label: "Attribute name",
            width: 100
        },
        {
            dataKey: "object",
            label: objectHeader,
            width: 100
        }
    ];

    let rows = [];
    for (let i = 0; i < attributes.length; i++) {
        rows.push({
            name: attributes[i].name,
            object: object[attributes[i].name]
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
    attributes: PropTypes.arrayOf(PropTypes.object),
    object: PropTypes.object,
    objectHeader: PropTypes.string,
};

export default ObjectTable;
