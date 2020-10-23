import PropTypes from "prop-types";

const MuiMenuPropTypes = {
    anchorEl: PropTypes.any,
    autoFocus: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.object,
    disableAutoFocusItem: PropTypes.bool,
    MenuListProps: PropTypes.object,
    onClose: PropTypes.func,
    onEnter: PropTypes.func,
    onEntered: PropTypes.func,
    onEntering: PropTypes.func,
    onExit: PropTypes.func,
    onExited: PropTypes.func,
    onExiting: PropTypes.func,
    open: PropTypes.bool,
    PopoverClasses: PropTypes.object,
    transitionDuration: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
            appear: PropTypes.number,
            enter: PropTypes.number,
            exit: PropTypes.number
        })
    ]),
    variant: PropTypes.oneOf(['menu', 'selected-menu'])
}

export default MuiMenuPropTypes;
