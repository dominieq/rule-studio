import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../../../Feedback/CircleHelper";
import ListSubheader from "@material-ui/core/ListSubheader";

const useStyles = makeStyles(theme => ({
    root: {
        alignItems: "center",
        borderBottom: `2px solid ${theme.palette.list.text}`,
        display: "flex",
        fontSize: theme.typography.subheader.fontSize,
        lineHeight: "unset",
        padding: "8px 16px"
    },
    parameters: {
        display: "flex",
        flexGrow: 1,
        flexWrap: "wrap",
        paddingRight: 16
    },
    parameterCell: {
        alignItems: "center",
        display: "flex"
    },
    textCell: {
        height: "fit-content",
        width: "fit-content"
    },
    label: {
        color: theme.palette.button.primary,
        marginRight: 8,
        letterSpacing: theme.typography.subheader.letterSpacing,
        textTransform: theme.typography.subheader.textTransform
    },
    value: {
        color: theme.palette.button.secondary
    },
    divider: {
        alignSelf: "stretch",
        backgroundColor: theme.palette.list.text,
        borderColor: theme.palette.list.text,
        height: "auto",
        margin: "0 8px",
        width: 1
    },
    helper: {
        display: "flex",
        flexDirection: "column"
    }
}), {name: "ResultListSubheader"});

function ResultListSubheader(props) {
    const { children, disableHelper, helper, ...other } = props;
    const classes = useStyles();

    return (
        <ListSubheader classes={{root: classes.root}} {...other}>
            <div aria-label={"parameters"} className={classes.parameters}>
                {children.map((child, index) => (
                    <React.Fragment  key={index}>
                        <div aria-label={"parameter"} className={classes.parameterCell}>
                            <div aria-label={"label"} className={clsx(classes.textCell, classes.label)}>
                                { child.label }
                            </div>
                            <div aria-label={"value"} className={clsx(classes.textCell, classes.value)}>
                                { child.value }
                            </div>
                        </div>
                        {index !== children.length - 1 &&
                            <hr aria-label={"divider"} className={classes.divider} />
                        }
                    </React.Fragment>
                ))}
            </div>
            <div
                aria-label={"helper"}
                className={classes.helper}
                style={disableHelper ? {display: "none"} : undefined}
            >
                <CircleHelper
                    size={"smaller"}
                    title={
                        <p aria-label={"helper text"} style={{margin: 0, textAlign: "justify"}}>
                            {helper}
                        </p>
                    }
                    TooltipProps={{ placement: "left-end" }}
                />
            </div>
        </ListSubheader>
    );
}

ResultListSubheader.propTypes = {
    children: PropTypes.arrayOf(PropTypes.exact({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
    classes: PropTypes.object,
    color: PropTypes.oneOf(["default", "primary", "inherit"]),
    component: PropTypes.elementType,
    disableGutters: PropTypes.bool,
    disableSticky: PropTypes.bool,
    disableHelper: PropTypes.bool,
    helper: PropTypes.node,
    inset: PropTypes.bool
};

ResultListSubheader.defaultProps = {
    component: "header",
    disableGutters: true,
    disableHelper: true
};

export default ResultListSubheader;
