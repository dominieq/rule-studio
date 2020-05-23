import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";

const listStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1
    },
    multiline: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    textItem: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        '&:hover': {
            overflow: "visible",
            whiteSpace: "unset",
            wordBreak: "break-word"
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
        ...theme.typography.subheader
    },
    textItemNumber: {
        color: theme.palette.text.special1,
    }
}), {name: "tables-list"});

function TablesList(props) {
    const { headerText, onTableSelected, tableIndex, tables } = props;
    const listClasses = listStyles();

    let displayedTables = [];
    const keys = Object.keys(tables);

    for(let i = 0; i < keys.length; i++) {
        displayedTables.push({
            id: i,
            name: keys[i],
            count: " (" + tables[keys[i]].length + ")"
        });
    }

    return (
        <List
            classes={{root: listClasses.root}}
            component={"nav"}
            disablePadding={true}
            subheader={Boolean(headerText) &&
                <ListSubheader disableSticky={true} className={listClasses.header} component={"div"}>
                    <Typography className={clsx(listClasses.headerText ,listClasses.textItem)}>
                        {headerText}
                    </Typography>
                </ListSubheader>
            }
        >
            {displayedTables.map((item, index) => (
                <ListItem
                    button={true}
                    disableRipple={true}
                    divider={true}
                    key={index}
                    onClick={() => onTableSelected(item.id)}
                    selected={tableIndex === item.id}
                >
                    <ListItemText
                        className={listClasses.multiline}
                        primary={item.name}
                        primaryTypographyProps={{className: listClasses.textItem}}
                        secondary={item.count}
                        secondaryTypographyProps={{className: listClasses.textItemNumber}}
                    />
                </ListItem>
            ))}
        </List>
    );
}

// Expected props:
// tables (required) <-- this is the object of arrays of integers (object indexes)
// setChosenTable (required) <-- method responsible for setting chosen table (selected from the tables).

//Example of props:
/*
    tables = { objects: [0,1,3,4,8], lowerApproximation:[1,2,5,6,9,11], upperApproximation:[1,4,5,6,7,8]}
    setChosenTable = {this.setChosenTable};
*/
TablesList.propTypes = {
    headerText: PropTypes.string,
    onTableSelected: PropTypes.func.isRequired,
    tableIndex: PropTypes.number,
    tables: PropTypes.object.isRequired,
};

export default TablesList;