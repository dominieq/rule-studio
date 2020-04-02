import React, {Fragment} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import { AutoSizer, List } from "react-virtualized";

const listStyles = makeStyles(theme => ({
    root: {
        '& > .ReactVirtualized__Grid__innerScrollContainer': {
            backgroundColor: theme.palette.list.background,
            color: theme.palette.list.text,
        }
    },
    textItem: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        wordBreak: "normal",
        '&:hover': {
            overflow: "visible",
            whiteSpace: "unset",
            wordBreak: "break-word",
        }
    },
    header: {
        alignItems: "center",
        backgroundColor: theme.palette.list.subheader.background,
        color: theme.palette.list.subheader.text,
        display: "flex",
        height: 48,
        justifyContent: "center",
        lineHeight: "initial"
    },
    headerText: {
        fontSize: "inherit",
        fontWeight: 900,
        letterSpacing: "0.05rem"
    },
    listWrapper: {
        flexGrow: 1,
        width: "100%",
    },
}), {name: "virtualized-list"});

function VirtualizedTableItems(props) {
    const { headerText, index, itemText, onItemInTableSelected, rowHeight, table } = props;
    const listClasses = listStyles();

    const rowRenderer = ({key, index: i, style}) => {
        return (
            <ListItem
                button={true}
                divider={true}
                key={key}
                selected={table[i] === index}
                onClick={() => onItemInTableSelected(table[i])}
                style={style}
            >
                <ListItemText
                    primary={itemText + " " + (table[i] + 1)}
                    primaryTypographyProps={{className: listClasses.textItem}}
                />
            </ListItem>
        )
    };

    return (
        <Fragment>
            {headerText &&
                <ListSubheader disableSticky={true} className={listClasses.header} component={"div"}>
                    <Typography className={clsx(listClasses.textItem, listClasses.headerText)}>
                        {headerText}
                    </Typography>
                </ListSubheader>
            }
            <div className={listClasses.listWrapper}>
                <AutoSizer>
                    {({height, width}) => (
                        <List
                            className={listClasses.root}
                            height={height}
                            rowHeight={rowHeight}
                            rowCount={table.length}
                            rowRenderer={rowRenderer}
                            width={width}
                        />
                    )}
                </AutoSizer>
            </div>
        </Fragment>
    );
}

// Expected props:
// headerText (optional) <-- string displayed above virtualized list
// itemInTableIndex (optional) <-- index of currently displayed item from table
// onTableItemSelected (required) <-- function responsible for selecting item from table
// rowHeight (optional)
// table (required) <-- array of integers (object indices) from chosen data table

VirtualizedTableItems.propTypes = {
    headerText: PropTypes.string,
    index: PropTypes.number,
    itemText: PropTypes.string,
    onItemInTableSelected: PropTypes.func.isRequired,
    rowHeight: PropTypes.number,
    table: PropTypes.array.isRequired,
};

VirtualizedTableItems.defaultProps = {
    itemText: "Object",
    rowHeight: 53,
};

export default VirtualizedTableItems;