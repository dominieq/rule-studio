import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles/Footer.module.css";
import CustomTooltip from "../../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../../Utils/Inputs/StyledButton";
import Typography from "@material-ui/core/Typography";
import GitHub from "@material-ui/icons/GitHub";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1
    }
}), {name: "Footer"});

function Footer() {
    const classes = useStyles();
    return (
        <footer className={clsx(styles.Root, classes.root)} id={"home-footer"}>
            <Typography variant={"caption"}>
                {"Copyright \u00A9 2020 Tomasz Dzięcioł, Dominik Szmyt, Michał Zimny"}
            </Typography>
            <CustomTooltip
                arrow={true}
                enterDelay={500}
                enterNextDelay={500}
                placement={"top"}
                title={"Open GitHub repository"}
            >
                <StyledIconButton component={"a"} href={"https://github.com/dominieq/rule-studio"}>
                    <GitHub />
                </StyledIconButton>
            </CustomTooltip>
        </footer>
    );
}

export default Footer;
