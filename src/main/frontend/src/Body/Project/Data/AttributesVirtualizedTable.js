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
            backgroundColor: theme.palette.background.main1,
            color: theme.palette.text.main1,
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
        backgroundColor: theme.palette.background.subLight,
        color: theme.palette.text.special2,
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

/**
 * Displays list of attributes (enable to select) in the Edit attributes dialog.
 *
 * @class
 * @category Utils
 * @subcategory Data Display
 * @param {Object} props
 * @param {string} [props.headerText] - This is the text displayed above the table.
 * @param {function} props.onItemInTableSelected - Method runs when the table item is selected.
 * @param {Number} [props.rowHeight] - This is the size of the row. Usually set to default.
 * @param {Array} props.table - List of columns (attributes) enabled for modification.
 * @param {string} props.clicked - The name of the selected item (attribute).
 * @returns {React.ReactElement}
 */
function AttributesVirtualizedTable(props) {
    const { headerText, onItemInTableSelected, rowHeight, table, clicked } = props;
    const listClasses = listStyles();


    const rowRenderer = ({key, index, style}) => {
        let primary = (index+1) + ". " + table[index].name;

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