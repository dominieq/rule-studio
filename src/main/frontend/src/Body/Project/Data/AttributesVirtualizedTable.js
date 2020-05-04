import React, {Fragment} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import { AutoSizer, List } from "react-virtualized";
import TextWithHoverTooltip from "../../../Utils/DataDisplay/TextWithHoverTooltip";

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
            wordBreak: "break-all"
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

function AttributesVirtualizedTable(props) {
    const { headerText, onItemInTableSelected, rowHeight, table, clicked } = props;
    const listClasses = listStyles();


    const rowRenderer = ({key, index, style}) => {
        let primary = table[index].name;

        return (
            <ListItem
                button={true}
                divider={true}
                key={key}
                selected={primary === clicked}
                onClick={() => onItemInTableSelected(table[index])}
                style={style}
            >
                <TextWithHoverTooltip
                    text={primary}
                    className={ listClasses.textItem}
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
                            className={clsx(listClasses.root)}
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
// onTableItemSelected (required) <-- function responsible for selecting item from table
// rowHeight (optional)
// table (required) <-- array of integers (object indices) from chosen data table

AttributesVirtualizedTable.propTypes = {
    headerText: PropTypes.string,
    onItemInTableSelected: PropTypes.func,
    rowHeight: PropTypes.number,
    table: PropTypes.array.isRequired,
};

AttributesVirtualizedTable.defaultProps = {
    rowHeight: 40
};

export default AttributesVirtualizedTable;