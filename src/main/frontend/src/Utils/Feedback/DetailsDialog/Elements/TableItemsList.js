import React, {Fragment} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import { AutoSizer, List } from "react-virtualized";
import TextWithHoverTooltip from "../../../DataDisplay/TextWithHoverTooltip";

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
        '&:hover': {
            overflow: "visible",
            whiteSpace: "unset",
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
        ...theme.typography.subheader,
    },
    listWrapper: {
        flexGrow: 1,
        width: "100%",
    },
}), {name: "virtualized-list"});

function TableItemsList(props) {
    const { headerText, itemIndex, itemText, onItemInTableSelected, rowHeight, table } = props;
    const listClasses = listStyles();

    const rowRenderer = ({key, index, style}) => {
        let primary = itemText + " " + (table[index] + 1);

        if (typeof props.getName === "function") {
            primary = props.getName(table[index]);
        }

        return (
            <ListItem
                button={true}
                divider={true}
                key={key}
                selected={table[index] === itemIndex}
                onClick={() => onItemInTableSelected(table[index])}
                style={style}
            >
                <TextWithHoverTooltip
                    text={primary}
                    TooltipProps={{
                        id: key,
                        placement: "right"
                    }}
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

TableItemsList.propTypes = {
    getName: PropTypes.func,
    headerText: PropTypes.string,
    itemIndex: PropTypes.number,
    itemText: PropTypes.string,
    onItemInTableSelected: PropTypes.func,
    rowHeight: PropTypes.number,
    table: PropTypes.array.isRequired,
};

TableItemsList.defaultProps = {
    itemText: "Object",
    rowHeight: 53,
};

export default TableItemsList;