import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import TextWithHoverTooltip from "./TextWithHoverTooltip";
import { makeStyles } from '@material-ui/core/styles';
import { AutoSizer, Column, Table } from 'react-virtualized';

/**
 * Estimates height of the VirtualizedTable for given data.
 *
 * @function
 * @param data {Array} - An array of objects that is going to be displayed in {@link VirtualizedTable}.
 * @param [rowHeight=48] {number} - Height of a row from the table.
 * @returns {number} An estimated height of the table.
 */
export const estimateTableHeight = (data, rowHeight = 48) => {
    return (data.length + 1) * rowHeight;
};

const tableStyles = makeStyles(theme => ({
    table: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            background: theme.palette.background.main1,
            color: theme.palette.text.main1,
        },
        '& .ReactVirtualized__Table__headerRow': {
            backgroundColor: theme.palette.background.subLight,
            color: theme.palette.text.special2
        }
    },
    tableRow: {
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        display: "flex",
    },
    tableColumn: {
        alignItems: 'center',
        display: 'flex',
        flexGrow: "1 !important",
        padding: "8px 16px",
        width: "100%"
    },
    headerColumn: {
        overflow: "hidden"
    },
    headerCell: {
        ...theme.typography.subheader,
    },
    textCell: {
        cursor: "default"
    },
}), {name: "virtualized-table"});

/**
 *  A Table component wrapped around in AutoSizer from react-virtualized library with custom styling.
 *  There are default <code>cellRenderer</code> and <code>headerRenderer</code> functions in this component.
 *  However, you can forward your own functions to replace them.
 *  For full documentation check out this react-virtualized docs on
 *  <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md">Table</a>,
 *  <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md">AutoSizer</a> and
 *  <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/Column.md">Column</a>.
 *
 * @constructor
 * @param props {Object} - Any other props will be forwarded to the Table component.
 * @param [props.classes] {Object} - Override or extend the styles applied to the component.
 * @param props.columns {Object[]} - A data set that is going to be displayed in VirtualizedTable.
 * @returns {React.PureComponent} The Table component wrapped around in AutoSizer from react-virtualized library.
 */
function VirtualizedTable(props) {
    const { cellRenderer, classes, columns, rowHeight, headerRender, headerHeight, ...tableProps } = props;
    const tableClasses = {...tableStyles(), ...classes};

    /**
     *  Default <code>cellRenderer</code> for <code>VirtualizedTable</code>.
     *  It renders a {@link TextWithHoverTooltip}.
     *  <br>
     *  For full documentation check out react-virtualized docs on
     *  <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/Column.md#cellrenderer">cellRenderer</a>
     *
     * @param cellData {*} - The content of a table cell.
     * @param dataKey {string} - The key property of a table cell.
     * @returns {React.Component} {@link TextWithHoverTooltip}.
     */
    const cellRendererDefault = ({ cellData, dataKey }) => {
        return (
            <Fragment>
                {cellData &&
                    <TextWithHoverTooltip
                        roundNumbers={false}
                        text={cellData}
                        TooltipProps={{
                            id: dataKey
                        }}
                        TypographyProps={{
                            className: tableClasses.textCell
                        }}
                    />
                }
            </Fragment>
        );
    };

    /**
     * Default <code>headerRenderer</code> for <code>VirtualizedTable</code>.
     * It renders a {@link TextWithHoverTooltip}.
     * <br>
     * For full documentation check out react-virtualized docs on
     * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/Column.md#headerrenderer">headerRenderer</a>
     *
     * @param label {*} - The content of a header cell.
     * @returns {React.Component} {@link TextWithHoverTooltip}
     */
    const headerRendererDefault = ({ label }) => {
        return (
            <Fragment>
                {label &&
                    <TextWithHoverTooltip
                        text={label}
                        TypographyProps={{
                            className: clsx(tableClasses.textCell, tableClasses.headerCell)
                        }}
                    />
                }
            </Fragment>
        );
    };

    return (
        <AutoSizer>
            {({ height, width }) => (
                <Table
                    className={tableClasses.table}
                    headerHeight={headerHeight}
                    headerClassName={clsx(tableClasses.tableColumn, tableClasses.headerColumn)}
                    height={height}
                    gridStyle={{direction: 'inherit'}}
                    rowClassName={tableClasses.tableRow}
                    rowHeight={rowHeight}
                    width={width}
                    {...tableProps}
                >
                    {columns.map(({ dataKey, ...other }) => {
                        return (
                            <Column
                                cellRenderer={
                                    typeof cellRenderer === "function" ? cellRenderer : cellRendererDefault
                                }
                                className={tableClasses.tableColumn}
                                dataKey={dataKey}
                                headerRenderer={
                                    typeof headerRender === "function" ? headerRender : headerRendererDefault
                                }
                                key={dataKey}
                                {...other}
                            />
                        );
                    })}
                </Table>
            )}
        </AutoSizer>
    );
}

VirtualizedTable.propTypes = {
    cellRenderer: PropTypes.func,
    classes: PropTypes.object,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            dataKey: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
        }),
    ).isRequired,
    headerHeight: PropTypes.number,
    headerRender: PropTypes.func,
    onRowClick: PropTypes.func,
    rowCount: PropTypes.number.isRequired,
    rowGetter: PropTypes.func.isRequired,
    rowHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.func
    ]).isRequired,
    rowStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ])
};

VirtualizedTable.defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
};

export default VirtualizedTable;