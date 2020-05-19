import React, {useEffect} from 'react';
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import styles from "./styles/Help.module.css"

const textStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.paper.background,
        color: theme.palette.paper.text,
        '&::-webkit-scrollbar': {
            width: 17
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.button.contained.background,
            '&:hover': {
                backgroundColor: theme.palette.button.contained.backgroundAction
            }
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)"
        }
    }
}), {name: "Text"});

const drawerStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.background.default,
        borderLeft: `2px solid ${theme.palette.text.default}`,
        color: theme.palette.text.default
    }
}), {name: "Help"});

function Help(props) {
    const [marginRight, setMarginRight] = React.useState(0);

    const { upperMargin } = props;
    const textClasses = textStyles();
    const drawerClasses = drawerStyles();

    const drawerRef = React.useRef(null);

    useEffect(() => {
        if (drawerRef.current !== null) {
            setMarginRight(drawerRef.current.offsetWidth);
        }
    });

    return (
        <div className={styles.Root} id={"help"}>
            <div
                aria-label={"container"}
                className={clsx(styles.Text, textClasses.root)}
                style={{marginRight: marginRight}}
            >
                <div aria-label={"scrollable"} className={styles.Scrollable}>
                    {/* Main text goes here */}
                </div>
            </div>
            <Drawer
                anchor={"right"}
                classes={{paper: drawerClasses.paper}}
                PaperProps={{
                    className: styles.Drawer,
                    id: "help-drawer",
                    ref: drawerRef,
                    style: { marginTop: upperMargin }
                }}
                variant={"permanent"}
            >
                <List disablePadding={true}>
                    <ListItem>
                        {/* Navigation goes here */}
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}

Help.propTypes = {
    upperMargin:  PropTypes.number
};

export default Help;