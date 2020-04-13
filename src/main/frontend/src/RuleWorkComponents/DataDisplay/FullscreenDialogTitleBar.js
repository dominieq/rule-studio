import React, {useEffect} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import RuleWorkTooltip from "./RuleWorkTooltip";
import StyledButton from "../Inputs/StyledButton";
import StyledPaper from "../Surfaces/StyledPaper";
import Typography from "@material-ui/core/Typography";
import WindowClose from "mdi-material-ui/WindowClose";

const paperStyles = makeStyles(theme => ({
    root: {
        flex: "0 0 auto",
        padding: "16px 0 16px 24px",
    },
    rootOverflow: {
        overflow: "hidden",
        '&:hover': {
            overflow: "auto",
        },
        '&::-webkit-scrollbar': {
            height: 8,
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.button.contained.background,
            borderRadius: 4,
            '&:hover': {
                backgroundColor: theme.palette.button.contained.backgroundAction,
            }
        },
        '&::-webkit-scrollbar-track': {
            "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.3)",
            borderRadius: 4
        }
    },
    title: {
        fontSize: 20,
        fontWeight: 700,
        marginRight: "auto",
        paddingRight: 8,
    },
    flexTitle: {
        alignItems: "center",
        display: "flex",
        minWidth: "fit-content",
        whiteSpace: "nowrap",
        '& > div ~ div': {
            marginLeft: 8,
        },
    },
    close: {
        alignItems: "center",
        display: "flex",
        padding: "0 24px 0 16px",
    },
    closeSticky: {
        backgroundColor: theme.palette.paper.background,
        boxShadow: `-8px 0 6px -6px ${theme.palette.paper.background}`,
        position: "sticky",
        right: 0,
    },
    optional: {
        minWidth: "fit-content",
        marginRight: 16
    }
}), {name: "title-bar"});

function FullscreenDialogTitleBar(props) {
    const { onClose, optional, title } = props;

    const paperClasses = paperStyles();
    const titleIsArray = React.isValidElement(title);

    const onMouseEnter = () => {
        document.getElementById("title-bar").style.overflow = "hidden";
    }

    const onMouseLeave = () => {
        document.getElementById("title-bar").style.overflow = "";
    }

    const onWheel = (event) => {
        let bar = document.getElementById("title-bar");
        let barScrollPosition = document.getElementById("title-bar").scrollLeft;

        bar.scrollTo({
            behavior: "auto",
            left: barScrollPosition + event.deltaY,
            top: 0,
        });
    };

    useEffect(() => {
        document.addEventListener("mousewheel", onWheel, {passive: false});

        return () => {
            document.removeEventListener("mousewheel", onWheel);
        }
    });

    return (
        <StyledPaper
            className={clsx(paperClasses.root, paperClasses.rootOverflow)}
            elevation={6}
            id={"title-bar"}
            onWheel={onWheel}
        >
            <div className={clsx(paperClasses.title, {[paperClasses.flexTitle]: titleIsArray})}>
                {title}
            </div>
            <div className={clsx(paperClasses.close, paperClasses.closeSticky)}>
                {optional &&
                    <Typography className={paperClasses.optional} component={"div"} variant={"button"}>
                        {optional}
                    </Typography>
                }
                <RuleWorkTooltip title={"Close details"}>
                    <StyledButton
                        aria-label={"close-button"}
                        isIcon={true}
                        onClick={onClose}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
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
    onClose: PropTypes.func,
    optional: PropTypes.node,
    title: PropTypes.node,
};

export default FullscreenDialogTitleBar;