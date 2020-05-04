import React, {useState} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import CustomTooltip from "../DataDisplay/CustomTooltip";
import Avatar from "@material-ui/core/Avatar";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import HelpCircle from "mdi-material-ui/HelpCircle";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.default,
        cursor: "help",
    },
    button: {
        '&:hover': {
            color: theme.palette.button.secondary,
        },
    },
    multiRow: {
        display: "flex",
        flexDirection: "column",
        '& > *:not(:first-child)': {
            marginTop: "1em"
        }
    },
    small: {
        height: 24,
        width: 24,
    },
    medium: {
        height: 36,
        width: 36,
    },
    big: {
        height: 48,
        width: 48,
    },
    smallIcon: {
        height: "1em",
        width: "1em",
    },
    mediumIcon: {
        height: "1.5em",
        width: "1.5em",
    },
    bigIcon: {
        height: "2.14em",
        width: "2.14em",
    }
}), {name: "CircleHelper"});

function CircleHelper(props) {
    const [open, setOpen] = useState(false);

    const { AvatarProps, children, multiRow, size, title, TooltipProps, WrapperProps } = props;
    const { classes: tooltipClasses , ...other } = TooltipProps;

    let classes =  useStyles();
    if (tooltipClasses) classes = mergeClasses(classes, tooltipClasses);

    const onTooltipOpen = () => {
        setOpen(true)
    }

    const onTooltipClose = () => {
        setOpen(false);
    }

    return (
        <ClickAwayListener onClickAway={onTooltipClose}>
            <div id={"click-away-wrapper"} {...WrapperProps}>
                <CustomTooltip
                    classes={multiRow ? {tooltip: classes.multiRow} : undefined}
                    disableFocusListener={true}
                    disableHoverListener={true}
                    disableTouchListener={true}
                    onClose={onTooltipClose}
                    open={open}
                    PopperProps={{
                        disablePortal: true,
                    }}
                    title={!children ? title : children}
                    {...other}
                >
                    <Avatar
                        className={clsx(classes.root, classes.button, classes[size])}
                        onClick={onTooltipOpen}
                        {...AvatarProps}
                    >
                        <HelpCircle className={classes[size + "Icon"]} />
                    </Avatar>
                </CustomTooltip>
            </div>
        </ClickAwayListener>

    )
}

CircleHelper.propTypes = {
    AvatarProps: PropTypes.object,
    children: PropTypes.string,
    multiRow: PropTypes.bool,
    size: PropTypes.oneOf(["small", "medium", "big"]),
    title: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
    WrapperProps: PropTypes.object,
};

CircleHelper.defaultProps = {
    multiRow: false,
    size: "small",
    TooltipProps: {
        placement: "right"
    }
};

export default CircleHelper;
