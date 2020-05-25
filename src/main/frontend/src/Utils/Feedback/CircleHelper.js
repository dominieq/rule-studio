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
        backgroundColor: theme.palette.text.main2,
        color: theme.palette.text.default,
        cursor: "help"
    },
    button: {
        '&:hover': {
            color: theme.palette.text.special1
        },
    },
    multiRow: {
        display: "flex",
        flexDirection: "column",
        '& > *:not(:first-child)': {
            marginTop: "1em"
        }
    },
    smaller: {
        fontSize: 16,
        height: 16,
        width: 16
    },
    small: {
        fontSize: 24,
        height: 24,
        width: 24
    },
    medium: {
        fontSize: 36,
        height: 36,
        width: 36
    },
    big: {
        fontSize: 48,
        height: 48,
        width: 48
    },
    smallerIcon: {
        height: "1rem",
        width: "1rem"
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

    const { AvatarProps, multiRow, size, title, TooltipProps, WrapperProps } = props;
    const { classes: tooltipClasses , ...other } = TooltipProps;

    let classes =  useStyles();
    if (tooltipClasses && tooltipClasses.hasOwnProperty("multiRow")) {
        classes = mergeClasses(classes, { multiRow: tooltipClasses.multiRow });
    }

    let newTooltipClasses = undefined;
    if (tooltipClasses && tooltipClasses.hasOwnProperty("tooltip")) {
        newTooltipClasses = { tooltip: tooltipClasses.tooltip };
    }

    const onTooltipOpen = () => {
        setOpen(true);
    };

    const onTooltipClose = () => {
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={onTooltipClose}>
            <div id={"click-away-wrapper"} {...WrapperProps}>
                <CustomTooltip
                    arrow={true}
                    classes={multiRow ? {tooltip: classes.multiRow} : newTooltipClasses}
                    disableFocusListener={true}
                    disableHoverListener={true}
                    disableTouchListener={true}
                    onClose={onTooltipClose}
                    open={open}
                    title={title}
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
    multiRow: PropTypes.bool,
    size: PropTypes.oneOf(["smaller", "small", "medium", "big"]),
    title: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
    WrapperProps: PropTypes.object,
};

CircleHelper.defaultProps = {
    multiRow: false,
    size: "small",
    TooltipProps: {
        placement: "right-start"
    }
};

export default CircleHelper;
