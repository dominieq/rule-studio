import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../../../Feedback/CircleHelper";
import { MoreSettingsIconButton } from "../../../Buttons";
import ListSubheader from "@material-ui/core/ListSubheader";

const useStyles = makeStyles(theme => ({
    root: {
        alignItems: "center",
        borderBottom: `2px solid ${theme.palette.text.main1}`,
        display: "flex",
        fontSize: theme.typography.subheader.fontSize,
        lineHeight: 1,
        padding: "8px 16px"
    },
    parameters: {
        display: "flex",
        flexGrow: 1,
        flexWrap: "wrap"
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
        color: theme.palette.text.main1,
        marginRight: 8,
        letterSpacing: theme.typography.subheader.letterSpacing,
        textTransform: theme.typography.subheader.textTransform
    },
    value: {
        color: theme.palette.text.special1
    },
    divider: {
        alignSelf: "stretch",
        backgroundColor: theme.palette.text.main1,
        borderColor: theme.palette.text.main1,
        height: "auto",
        margin: "0 8px",
        width: 1
    },
    gutter: {
        display: "flex",
        flexDirection: "column"
    }
}), {name: "ResultListSubheader"});

/**
 * <h3>Overview</h3>
 * The ListSubheader component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/list-subheader/" target="_blank">ListSubheader</a>.
 *
 * <h3>Goal</h3>
 * The goal of this component is to display simple label-value pairs that contain secondary information.
 *
 * <h3>Usage</h3>
 * In order to disable settings button or helper
 * set <code>disableLeftGutter</code> or <code>disableRightGutter</code> to <code>true</code>
 *
 * @constructor
 * @category Utils
 * @subcategory Result List
 * @param {Object} props - Any other props will be forwarded to the ListSubheader component.
 * @param {Object[]} [props.children] - The content of the component. An array of simple label-value pairs.
 * @param {string} props.children[].label - The content of the label inside a pair.
 * @param {number|string} props.children[].value - The content of the value inside a pair.
 * @param {boolean} props.disableLeftGutter - If <code>true</code> the content of left gutter will be visible.
 * @param {boolean} props.disableRightGutter - If <code>true</code> the content of right gutter will be visible.
 * @param {React.ReactNode} props.helper - The content of the helper.
 * @param {function} props.onSettingsClick - Callback fired when settings button was clicked on.
 * @returns {React.ReactElement}
 */
function ResultListSubheader(props) {
    const { children, disableLeftGutter, disableRightGutter, helper, onSettingsClick, ...other } = props;
    const classes = useStyles();

    return (
        <ListSubheader classes={{root: classes.root}} {...other}>
            {!disableLeftGutter &&
                <div aria-label={"result-list-subheader-left-gutter"} className={classes.gutter}>
                    <MoreSettingsIconButton
                        color={"secondary"}
                        IconProps={{ style: { height: "1rem", width: "1rem" }}}
                        onClick={onSettingsClick}
                        TooltipProps={{ WrapperProps: { 'aria-label': "more-settings-icon-button-wrapper" }}}
                    />
                </div>
            }
            <div
                aria-label={"parameters"}
                className={classes.parameters}
                style={{
                    paddingLeft: disableLeftGutter ? 0 : 16,
                    paddingRight: disableRightGutter ? 0 : 16
                }}
            >
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
            {!disableRightGutter &&
                <div aria-label={"result-list-subheader-right-gutter"} className={classes.gutter}>
                    <CircleHelper
                        size={"smaller"}
                        title={!disableRightGutter ? helper : <div aria-hidden={true} />}
                        TooltipProps={{ placement: "left-end" }}
                    />
                </div>
            }
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
    disableLeftGutter: PropTypes.bool,
    disableGutters: PropTypes.bool,
    disableRightGutter: PropTypes.bool,
    disableSticky: PropTypes.bool,
    helper: PropTypes.node,
    inset: PropTypes.bool,
    onSettingsClick: PropTypes.func
};

ResultListSubheader.defaultProps = {
    component: "header",
    disableLeftGutter: false,
    disableRightGutter: true,
    disableGutters: true
};

export default ResultListSubheader;
