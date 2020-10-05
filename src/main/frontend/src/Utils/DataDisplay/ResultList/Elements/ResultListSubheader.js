import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../../../Feedback/CircleHelper";
import { MoreSettingsIconButton } from "../../../Inputs/StyledButton";
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
        flexWrap: "wrap",
        paddingLeft: 16,
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
 * The ListSubheader component from Material-UI library with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/list-subheader/" target="_blank">ListSubheader</a>
 *  The composition of ListSubheader in RuLeStudio is as follows. There is an array of simple label-value pairs.
 *  If set visible, there is a helper on the right side.
 *
 * @name Result List Subheader
 * @constructor
 * @category Utils
 * @subcategory Result List
 * @param props {Object} - Any other props will be forwarded to the ListSubheader component.
 * @param [props.children] {Object[]} - The content of the component. An array of simple label-value pairs.
 * @param props.children[].label {string} - The content of the label inside a pair.
 * @param props.children[].value {number|string} - The content of the value inside a pair.
 * @param props.disableHelper {boolean} - If <code>true</code> helper will be visible.
 * @param props.helper {React.ReactNode} - The content of the helper.
 * @param props.onSettingsClick {function} - Callback fired when settings button was clicked on.
 * @returns {React.ReactElement} The ListSubheader component from Material-UI library.
 */
function ResultListSubheader(props) {
    const { children, disableHelper, helper, onSettingsClick, ...other } = props;
    const classes = useStyles();

    return (
        <ListSubheader classes={{root: classes.root}} {...other}>
            <div
                aria-label={"result-list-subheader-left-gutter"}
                className={classes.gutter}
            >
                <MoreSettingsIconButton
                    color={"secondary"}
                    IconProps={{ style: { height: "1rem", width: "1rem" }}}
                    onClick={onSettingsClick}
                    TooltipProps={{ WrapperProps: { 'aria-label': "more-settings-icon-button-wrapper" }}}
                />
            </div>
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
                aria-label={"result-list-subheader-right-gutter"}
                className={classes.gutter}
                style={disableHelper ? {display: "none"} : undefined}
            >
                <CircleHelper
                    size={"smaller"}
                    title={!disableHelper ? helper : <div aria-hidden={true} />}
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
    inset: PropTypes.bool,
    onSettingsClick: PropTypes.func
};

ResultListSubheader.defaultProps = {
    component: "header",
    disableGutters: true,
    disableHelper: true
};

export default ResultListSubheader;
