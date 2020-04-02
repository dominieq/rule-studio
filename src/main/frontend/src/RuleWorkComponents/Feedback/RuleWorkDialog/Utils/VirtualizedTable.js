import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { AutoSizer, Column, Table } from 'react-virtualized';

const styles = theme => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    table: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            background: theme.palette.list.background,
            color: theme.palette.list.text,
        },
        '& .ReactVirtualized__Table__headerRow': {
            backgroundColor: theme.palette.list.subheader.background,
            color: theme.palette.list.subheader.text
        },
        '& .ReactVirtualized__Table__headerColumn': {
            width: "100% !important",
            flex: "unset !important",
            fontWeight: "bolder",
            '& .MuiTableCell-head': {
                fontWeight: 900
            }
        },
        '& .ReactVirtualized__Table__rowColumn': {
            width: "100% !important",
            flex: "unset !important"
        },
    },
    tableRow: {
        cursor: 'pointer',

    },
    tableCell: {
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        flex: 1,
    },
    noClick: {
        cursor: 'initial',
    },
});

class MuiVirtualizedTable extends PureComponent {

    getRowClassName = () => {
        const { classes } = this.props;
        return clsx(classes.tableRow, classes.flexContainer);
    };

    cellRenderer = ({ cellData, columnIndex }) => {
        const { columns, classes, rowHeight, onRowClick } = this.props;
        return (
            <TableCell
                component={"div"}
                className={clsx(classes.tableCell, classes.flexContainer, {
                  [classes.noClick]: onRowClick == null,
                })}
                variant={"body"}
                style={{ height: rowHeight }}
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >
                {cellData}
            </TableCell>
        );
    };

    headerRenderer = ({ label, columnIndex }) => {
        const { headerHeight, columns, classes } = this.props;
        return (
            <TableCell
                component={"div"}
                className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
                variant={"head"}
                style={{ height: headerHeight }}
                align={columns[columnIndex].numeric || false ? 'right' : 'left'}
            >
                <span>{label}</span>
            </TableCell>
        );
    };

    render() {
        const { classes, columns, rowHeight, headerHeight, ...tableProps} = this.props;
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <Table
                        height={height}
                        width={width}
                        rowHeight={rowHeight}
                        gridStyle={{direction: 'inherit'}}
                        headerHeight={headerHeight}
                        className={classes.table}
                        rowClassName={this.getRowClassName}
                        {...tableProps}
                    >
                        {columns.map(({ dataKey, ...other }, index) => {
                            return (
                                <Column
                                    key={dataKey}
                                    headerRenderer={headerProps =>
                                        this.headerRenderer({
                                            ...headerProps,
                                            columnIndex: index,
                                        })
                                    }
                                    className={classes.flexContainer}
                                    cellRenderer={this.cellRenderer}
                                    dataKey={dataKey}
                                    {...other}
                                />
                            );
                        })}
                    </Table>
                )}
            </AutoSizer>
        );
    }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object,
  columns: PropTypes.arrayOf(
      PropTypes.shape({
          dataKey: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          numeric: PropTypes.bool,
          width: PropTypes.number.isRequired,
      }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};


MuiVirtualizedTable.defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
};

export default withStyles(styles, {name: "virtualized-table"})(MuiVirtualizedTable);