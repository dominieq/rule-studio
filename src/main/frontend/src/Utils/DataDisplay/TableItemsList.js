import React, {Fragment} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import { AutoSizer, List } from "react-virtualized";
import TextWithHoverTooltip from "./TextWithHoverTooltip";
import { MoreSettingsIconButton } from "../Buttons";

const listStyles = makeStyles(theme => ({
    root: {
        '& > .ReactVirtualized__Grid__innerScrollContainer': {
            backgroundColor: theme.palette.background.main1,
            color: theme.palette.text.main1
        }
    },
    textItem: {
        '&:hover': {
            overflow: "visible",
            whiteSpace: "unset",
        }
    },
    header: {
        alignItems: "center",
        backgroundColor: theme.palette.background.subLight,
        color: theme.palette.text.special2,
        display: "flex",
        height: 48,
        justifyContent: "center"
    },
    headerText: {
        ...theme.typography.subheader,
        flexGrow: 1,
        textAlign: "center"
    },
    listWrapper: {
        flexGrow: 1,
        width: "100%",
    },
    customisable: {
        paddingLeft: "1em"
    }
}), {name: "TableItemsList"});

/**
 * <h3>Overview</h3>
 * An AutoSizer and List components from react-virtualized library with custom styling.
 * Used to display items from an array from an item's tables property.
 * <br>
 * For full documentation check out react-virtualized docs on
 * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md" target="_blank">AutoSizer</a>
 * and
 * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md" target="_blank">List</a>.
 *
 * @constructor
 * @category Utils
 * @subcategory Data Display
 * @param {Object} props
 * @param {boolean} [props.customisable = true] - If <code>true</code> settings button will be visible.
 * @param {function} [props.getItemStyle] - Should return a style object for an item with specified index.
 * @param {function} [props.getName] - Should return a name for an item with specified index.
 * @param {string} [props.headerText] - The header of the {@link TableItemsList}.
 * @param {number} props.itemIndex - The index of currently selected item.
 * @param {string} [props.itemText = "Object"] - The prefix used to name items from table.
 * @param {function} props.onItemInTableSelected - Callback fired when an item in table is selected.
 * @param {function} [props.onSettingsClick]  - Callback fired when settings button was clicked on.
 * @param {number} [props.rowHeight = 53] - The height of a row in a list.
 * @param {Object[]} props.table - The one of arrays from item's tables property.
 * @returns {React.ReactElement}
 */
function TableItemsList(props) {
    const {
        customisable,
        headerText,
        itemIndex,
        itemText,
        onItemInTableSelected,
        onSettingsClick,
        rowHeight,
        table
    } = props;

    const listClasses = listStyles();

    const rowRenderer = ({key, index, style}) => {
        let primary = itemText + " " + (table[index] + 1);
        if (typeof props.getName === "function") {
            primary = props.getName(table[index]);
        }

        let border = undefined;
        if (typeof props.getItemsStyle === "function") {
            border = props.getItemsStyle(table[index]);
        }

        return (
            <ListItem
                button={true}
                divider={true}
                key={key}
                selected={table[index] === itemIndex}
                onClick={() => onItemInTableSelected(table[index])}
                style={{ ...style, ...border }}
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
                <ListSubheader
                    disableSticky={true}
                    className={listClasses.header}
                    component={"header"}
                >
                    {customisable &&
                        <MoreSettingsIconButton
                            edge={"start"}
                            onClick={onSettingsClick}
                            TooltipProps={{
                                WrapperProps: {
                                    'aria-label': "more-settings-icon-button-wrapper",
                                    style: { display: "flex" }
                                }
                            }}
                        />
                    }
                    <Typography
                        className={clsx(
                            listClasses.headerText,
                            listClasses.textItem,
                            {[listClasses.customisable]: customisable}
                        )}
                        noWrap={true}
                    >
                        {headerText}
                    </Typography>
                </ListSubheader>
            }
            <div aria-label={"list wrapper"} className={listClasses.listWrapper}>
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

TableItemsList.propTypes = {
    customisable: PropTypes.bool,
    getItemsStyle: PropTypes.func,
    getName: PropTypes.func,
    headerText: PropTypes.string,
    itemIndex: PropTypes.number,
    itemText: PropTypes.string,
    onItemInTableSelected: PropTypes.func,
    onSettingsClick: PropTypes.func,
    rowHeight: PropTypes.number,
    table: PropTypes.array.isRequired,
};

TableItemsList.defaultProps = {
    customisable: true,
    itemText: "Object",
    rowHeight: 53,
};

export default TableItemsList;
