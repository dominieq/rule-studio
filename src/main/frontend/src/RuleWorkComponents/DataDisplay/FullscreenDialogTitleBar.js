import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import RuleWorkTooltip from "./RuleWorkTooltip";
import StyledButton from "../Inputs/StyledButton";
import StyledPaper from "../Surfaces/StyledPaper";
import Typography from "@material-ui/core/Typography";
import WindowClose from "mdi-material-ui/WindowClose";

const paperStyles = makeStyles({
    root: {
        flex: "0 0 auto",
        justifyContent: "space-between",
        padding: "16px 24px",
    },
    title: {
        fontSize: 20,
        fontWeight: 700,
        marginRight: "auto"
    },
    flexTitle: {
        alignItems: "center",
        display: "flex",
        minWidth: "fit-content",
        '& > div ~ div': {
            marginLeft: 8,
        },
    },
    close: {
        display: "flex",
        alignItems: "center"
    },
    optional: {
        minWidth: "fit-content",
        marginRight: 16
    }
}, {name: "title-bar"});

function FullscreenDialogTitleBar(props) {
    const { children, onClose, title } = props;
    const paperClasses = paperStyles();

    return (
        <StyledPaper className={paperClasses.root} elevation={6}>
            <div className={clsx(paperClasses.title, {[paperClasses.flexTitle]: React.isValidElement(title)})}>
                {title}
            </div>
            <div className={paperClasses.close}>
                {children &&
                    <Typography className={paperClasses.optional} component={"div"} variant={"button"}>
                        {children}
                    </Typography>
                }
                <RuleWorkTooltip title={"Close details"}>
                    <StyledButton
                        isIcon={true}
                        onClick={onClose}
                        themeVariant={"secondary"}
                    >
                        <WindowClose />
                    </StyledButton>
                </RuleWorkTooltip>
            </div>
        </StyledPaper>
    )
}

FullscreenDialogTitleBar.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
    title: PropTypes.node,
};

export default FullscreenDialogTitleBar;