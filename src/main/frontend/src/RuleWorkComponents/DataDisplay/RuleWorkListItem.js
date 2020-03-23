import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import RuleWorkSmallBox from "../Containers/RuleWorkSmallBox";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

const StyledListItem = withStyles({
    root: {
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%"
    }
}, {name: "rule-work-list-item"})(props => <ListItem {...props} />);

const useStyles = makeStyles(theme => ({
    row: {
        justifyContent: "flex-start"
    },
    headerWrapper: {
        margin: 0,
        width: "100%",
    },
    header: {
        color: theme.palette.button.secondary
    },
    subheader: {
        color: theme.palette.button.primary
    },
    content: {
        color: theme.palette.button.primary
    },
    multiContentTitle: {
        marginRight: 8
    },
    multiContentSubtitle: {
        color: theme.palette.button.secondary,
    }
}), {name: "rule-work-list-item"});

function RuleWorkListItem(props) {
    const {classes: propsClasses, object, ...other} = props;
    const classes = {...useStyles(), ...propsClasses};

    return (
        <StyledListItem {...other}>
            {(object.header || object.subheader) &&
                <RuleWorkSmallBox className={classes.headerWrapper}>
                    {object.header &&
                        <Typography className={classes.header} component={"p"} variant={"button"}>
                            {object.header}
                        </Typography>
                    }
                    {object.subheader &&
                        <Typography className={classes.subheader} component={"p"} variant={"overline"}>
                            {object.subheader}
                        </Typography>
                    }
                </RuleWorkSmallBox>
            }
            {(object.content || object.multiContent) &&
                <RuleWorkSmallBox styleVariant={"multi-row"}>
                    {object.content &&
                        <Typography className={classes.content} component={"p"} variant={"subtitle2"}>
                            {object.content}
                        </Typography>
                    }
                    {object.multiContent &&
                        <Fragment>
                            {object.multiContent.map((item, index) => (
                                <RuleWorkSmallBox  key={index} className={classes.row}>
                                    {item.title &&
                                        <Typography className={classes.multiContentTitle} component={"p"}>
                                            {item.title}
                                        </Typography>
                                    }
                                    {item.subtitle &&
                                        <Typography className={classes.multiContentSubtitle} component={"p"}>
                                            {item.subtitle}
                                        </Typography>
                                    }
                                </RuleWorkSmallBox>
                            ))}
                        </Fragment>
                    }
                </RuleWorkSmallBox>
            }
        </StyledListItem>
    )
}

RuleWorkListItem.propTypes = {
    alignItems: PropTypes.oneOf(["flex-start", "center"]),
    autoFocus: PropTypes.bool,
    button: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.object,
    component: PropTypes.elementType,
    ContainerComponent: PropTypes.elementType,
    ContainerProps: PropTypes.object,
    dense: PropTypes.bool,
    disabled: PropTypes.bool,
    disableGutters: PropTypes.bool,
    divider: PropTypes.bool,
    object: PropTypes.shape({
        id: PropTypes.number,
        header: PropTypes.string,
        subheader: PropTypes.string,
        content: PropTypes.string,
        multiContent: PropTypes.arrayOf(PropTypes.object)
    }),
    selected: PropTypes.bool,
};

RuleWorkListItem.defaultProps = {
    button: true,
    disableRipple: true,
    divider: true,
};

export default RuleWorkListItem