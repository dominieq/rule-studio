import React, {Fragment} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { StyledIconButton } from "../Inputs/StyledButton";
import StyledDivider from "../DataDisplay/StyledDivider";
import Drawer from "@material-ui/core/Drawer";
import WindowClose from "mdi-material-ui/WindowClose";
import styles from "./styles/CustomDrawer.module.css";

const drawerStyles = makeStyles(theme => ({
    docked: {
        position: "absolute",
        maxWidth: "50%",
        minWidth: "25%"
    },
    paper: {
        borderTop: `1px solid ${theme.palette.background.default}`,
        boxShadow: "3px 3px 1.5px 1.5px rgba(0,0,0,0.2), " +
            "6px 6px 3px 3px rgba(0,0,0,0.14), " +
            "1px 1px 0.5px 0.5px rgba(0,0,0,0.12)",
        marginTop: props => props.marginTop,
        position: "relative",
        zIndex: theme.zIndex.appBar + 100
    }
}), {name: "CustomDrawer"});

const paperStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1,
        padding: "12px 16px 8px",
    }
}), {name: "CustomDrawerPaper"});

/**
 * A styled Drawer component from Material-UI library.
 * A footer and dividers as well as a placeholder were added in RuLeStudio.
 * For full documentation <a href="https://material-ui.com/api/drawer/">check out Material-UI docs</a>.
 *
 * @constructor
 * @param props Any other props are going to be forwarded to the Drawer component.
 * @param props.closeFooter {boolean} If {@code true} a footer with closing button is going to be added at the bottom.
 * @param props.dividers {boolean} If {@code true} horizontal dividers are going to be added between content.
 * @param props.id {string} The id of an element. Should be unique within a page.
 * @param props.placeholder {number} A top margin that is going to be applied to Paper component.
 * @returns {React.Component} The Drawer component from Material-UI library.
 */
function CustomDrawer(props) {
    const { children, classes,  onClose, PaperProps,
            closeFooter, dividers, placeholder, ...other } = props;

    const childrenArray = React.Children.toArray(children);

    const drawerClasses = drawerStyles({marginTop: placeholder});
    const paperClasses = paperStyles();

    return (
        <Drawer
            classes={{
                ...classes,
                docked: drawerClasses.docked,
                paper: drawerClasses.paper,
            }}
            onClose={!closeFooter ? onClose : undefined}
            PaperProps={{
                ...PaperProps,
                classes: {root: paperClasses.root}
            }}
            {...other}
        >
            {childrenArray.map((child, index) => (
                <Fragment key={index}>
                    {child}
                    {index !== childrenArray.length - 1 && dividers &&
                        <StyledDivider
                            color={"secondary"}
                            flexItem={false}
                            margin={12}
                            orientation={"horizontal"}
                        />
                    }
                </Fragment>
            ))}
            {closeFooter &&
                <div
                    aria-label={"drawer footer"}
                    className={styles.Footer}
                    style={props.anchor === "right" ? {flexDirection: "unset"} : undefined}
                >
                    <StyledIconButton
                        aria-label={"drawer close button"}
                        aria-labelledby={"drawer footer"}
                        color={"secondary"}
                        onClick={onClose}
                    >
                        <WindowClose />
                    </StyledIconButton>
                </div>
            }
        </Drawer>
    )
}

CustomDrawer.propTypes = {
    /**
     * @ignore
     */
    anchor: PropTypes.oneOf(["bottom", "left", "right", "top"]),
    /**
     * @ignore
     */
    children: PropTypes.node,
    /**
     * @ignore
     */
    classes: PropTypes.object,
    /**
     * If {@code true} a footer with closing button is going to be added at the bottom.
     */
    closeFooter: PropTypes.bool,
    /**
     * If {@code true} horizontal dividers are going to be added between content.
     */
    dividers: PropTypes.bool,
    /**
     * @ignore
     */
    elevation: PropTypes.number,
    /**
     * The id of an element. Should be unique within a page.
     */
    id: PropTypes.string,
    /**
     * @ignore
     */
    ModalProps: PropTypes.object,
    /**
     * @ignore
     */
    onClose: PropTypes.func,
    /**
     * @ignore
     */
    open: PropTypes.bool,
    /**
     * @ignore
     */
    PaperProps: PropTypes.object,
    /**
     * A top margin that is going to be applied to Paper component.
     */
    placeholder: PropTypes.number,
    /**
     * @ignore
     */
    SlideProps: PropTypes.object,
    /**
     * @ignore
     */
    transitionDuration: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
            appear: PropTypes.number,
            enter: PropTypes.number,
            exit: PropTypes.number
        })
    ]),
    /**
     * @ignore
     */
    variant: PropTypes.oneOf(["permanent", "persistent", "temporary"])
};

CustomDrawer.defaultProps = {
    closeFooter: true,
    dividers: true,
    variant: "persistent"
};

export default CustomDrawer;