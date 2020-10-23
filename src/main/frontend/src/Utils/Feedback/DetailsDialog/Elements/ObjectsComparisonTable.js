import React from "react";
import PropTypes from "prop-types";
import getAppropriateColor from "../Utils/getAppropriateColor";
import getAppropriateSign from "../Utils/getAppropriateSign";
import VirtualizedTable from "../../../DataDisplay/VirtualizedTable";

/**
 *  The {@link VirtualizedTable} element that presents a comparison of two objects.
 *
 * @name ObjectsComparisonTable
 * @constructor
 * @category Details Dialog
 * @subcategory Utilities
 * @param {Object} props
 * @param {Object} props.informationTable - The information table from current project.
 * @param {string} [props.objectHeader] - The name of an object that has it's details displayed in a dialog.
 * @param {number} props.objectIndex - The index of an object that has it's details displayed in a dialog.
 * @param {string} [props.objectInTableHeader] - The name of an object from a dominance cone.
 * @param {number} props.objectInTableIndex - The index of an object from a dominance cone.
 * @param {number} props.tableIndex - The index of a dominance cone.
 * @returns {React.ReactElement}
 */
function ObjectsComparisonTable(props) {
    const {
        attributes,
        firstObject,
        firstObjectHeader,
        secondObject,
        secondObjectHeader,
        coneIndex
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
            label: firstObjectHeader,
            width: 50,
        },
        {
            dataKey: 'relation',
            label: 'Relation',
            width: 50,
        },
        {
            dataKey: 'object-right',
            label: secondObjectHeader,
            width: 50,
        }
    ];

    let rows = [];
    for (let i = 0; i < attributes.length; i++) {
        rows.push({
            name: attributes[i].name,
            'object-left': firstObject[attributes[i].name],
            relation: getAppropriateSign(firstObject, secondObject, attributes[i], coneIndex),
            'object-right': secondObject[attributes[i].name],
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
    attributes: PropTypes.arrayOf(PropTypes.object).isRequired,
    firstObject: PropTypes.object.isRequired,
    firstObjectHeader: PropTypes.string,
    secondObject: PropTypes.object.isRequired,
    secondObjectHeader: PropTypes.string,
    coneIndex: PropTypes.number.isRequired,
};

export default ObjectsComparisonTable;
