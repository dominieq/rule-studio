import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import TextWithHoverTooltip from "./TextWithHoverTooltip";
import { makeStyles } from '@material-ui/core/styles';
import { AutoSizer, Column, Table } from 'react-virtualized';

const tableStyles = makeStyles(theme => ({
    table: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            background: theme.palette.list.background,
            color: theme.palette.list.text,
        },
        '& .ReactVirtualized__Table__headerRow': {
            backgroundColor: theme.palette.list.subheader.background,
            color: theme.palette.list.subheader.text
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

function VirtualizedTable(props) {
    const { cellRenderer, classes, columns, rowHeight, headerRender, headerHeight, ...tableProps } = props;
    const tableClasses = {...tableStyles(), ...classes};

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