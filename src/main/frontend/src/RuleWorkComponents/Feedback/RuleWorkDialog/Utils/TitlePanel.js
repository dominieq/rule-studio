import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import RuleWorkTooltip from "../../../DataDisplay/RuleWorkTooltip";
import StyledButton from "../../../Inputs/StyledButton";
import StyledPaper from "../../../Surfaces/StyledPaper";
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
    close: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center"
    },
    optional: {
        minWidth: "fit-content",
        marginRight: 16
    }
}, {name: "title-panel"});

function TitlePanel(props) {
    const {children, onClose, title} = props;
    const paperClasses = paperStyles();

    return (
        <StyledPaper className={paperClasses.root} elevation={6}>
            <div className={paperClasses.title}>
                {title}
            </div>
            <div className={paperClasses.close}>
                {children &&
                    <Typography className={paperClasses.optional} component={"div"} variant={"button"}>
                        {children}
                    </Typography>
                }
                <RuleWorkTooltip title={"Close item's details"}>
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

TitlePanel.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
    title: PropTypes.node.isRequired,
};

export default TitlePanel;