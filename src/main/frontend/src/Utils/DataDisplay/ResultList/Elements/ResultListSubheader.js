import React, { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";

const subheaderStyles = makeStyles(theme => ({
    root: {
        alignItems: "center",
        borderBottom: `1px solid ${theme.palette.list.text}`,
        display: "flex",
        flexWrap: "wrap",
        fontSize: theme.typography.subheader.fontSize,
        lineHeight: "unset",
        padding: "8px 16px",
        '& > div ~ div': {
            marginLeft: 8,
        },
        '& > div ~ hr': {
            marginLeft: 8
        }
    }
}), {name: "result-list-subheader"});

const textStyles = makeStyles(theme => ({
    parameterCell: {
        alignItems: "center",
        display: "flex",
    },
    textCell: {
        height: "fit-content",
        width: "fit-content",
    },
    label: {
        color: theme.palette.button.primary,
        marginRight: 8,
        letterSpacing: theme.typography.subheader.letterSpacing,
        textTransform: theme.typography.subheader.textTransform,
    },
    value: {
        color: theme.palette.button.secondary,
    },
    divider: {
        alignSelf: "stretch",
        backgroundColor: theme.palette.list.text,
        borderColor: theme.palette.list.text,
        height: "auto",
        margin: 0,
        width: 1
    }
}), {name: "subheader-text"});

function ResultListSubheader(props) {
    const { children, ...other } = props;
    const subheaderClasses = subheaderStyles();
    const textClasses = textStyles();

    return (
        <ListSubheader classes={{root: subheaderClasses.root}} {...other}>
            {children.map((child, index) => (
                <Fragment key={index}>
                    <div className={textClasses.parameterCell}>
                        <div className={clsx(textClasses.textCell, textClasses.label)}>
                            { child.label }
                        </div>
                        <div className={clsx(textClasses.textCell, textClasses.value)}>
                            { child.value }
                        </div>
                    </div>
                    {index !== children.length - 1 &&
                        <hr className={textClasses.divider} />
                    }
                </Fragment>

            ))}
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
    inset: PropTypes.bool,
};

ResultListSubheader.defaultProps = {
    component: 'div',
    disableGutters: true,
};

export default ResultListSubheader;