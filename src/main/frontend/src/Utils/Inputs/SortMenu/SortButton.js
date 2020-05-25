import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../../DataDisplay/CustomTooltip";
import StyledButton from "../StyledButton";
import Badge from "@material-ui/core/Badge";
import Sort from "@material-ui/icons/Sort";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.text.special1
    }
}), {name: "SortDot"});

function DotBadge(props) {
    const classes = useStyles();

    return (
        <Badge
            aria-label={"sort-dot"}
            anchorOrigin={{horizontal: "right", vertical: "bottom"}}
            classes={{dot: classes.root}}
            component={"div"}
            overlap={"circle"}
            variant={"dot"}
            {...props}
        />
    );
}

function SortButton(props) {
    const { ButtonProps, icon, invisible, tooltip, TooltipProps } = props;

    return (
        <CustomTooltip title={tooltip} {...TooltipProps}>
            <DotBadge invisible={invisible}>
                <StyledButton
                    aria-label={"sort button"}
                    isIcon={true}
                    themeVariant={"secondary"}
                    {...ButtonProps}
                >
                    { Boolean(icon) ? icon : <Sort /> }
                </StyledButton>
            </DotBadge>
        </CustomTooltip>
    )
}

SortButton.propTypes = {
    ButtonProps: PropTypes.shape({
        'aria-label': PropTypes.any,
        'aria-controls': PropTypes.any,
        'aria-haspopup': PropTypes.bool,
        onClick: PropTypes.func,
    }),
    icon: PropTypes.node,
    invisible: PropTypes.bool,
    tooltip: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
};

export default SortButton;
