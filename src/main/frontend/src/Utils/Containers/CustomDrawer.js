import React, {Fragment} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import StyledButton from "../Inputs/StyledButton";
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
        backgroundColor: theme.palette.paper.background,
        color: theme.palette.paper.text,
        padding: "12px 16px 8px",
    }
}), {name: "CustomDrawerPaper"});

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
                    <StyledButton
                        aria-label={"drawer close button"}
                        aria-labelledby={"drawer footer"}
                        isIcon={true}
                        onClick={onClose}
                        themeVariant={"secondary"}
                    >
                        <WindowClose />
                    </StyledButton>
                </div>
            }
        </Drawer>
    )
}

CustomDrawer.propTypes = {
    anchor: PropTypes.oneOf(["bottom", "left", "right", "top"]),
    children: PropTypes.node,
    classes: PropTypes.object,
    closeFooter: PropTypes.bool,
    dividers: PropTypes.bool,
    elevation: PropTypes.number,
    id: PropTypes.string,
    ModalProps: PropTypes.object,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    PaperProps: PropTypes.object,
    placeholder: PropTypes.number,
    SlideProps: PropTypes.object,
    transitionDuration: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
            appear: PropTypes.number,
            enter: PropTypes.number,
            exit: PropTypes.number
        })
    ]),
    variant: PropTypes.oneOf(["permanent", "persistent", "temporary"])
};

CustomDrawer.defaultProps = {
    closeFooter: true,
    dividers: true,
    variant: "persistent"
};

export default CustomDrawer;