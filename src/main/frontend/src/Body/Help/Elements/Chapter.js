import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import styles from "../styles/Chapter.module.css";

function Chapter(props) {
    const { content, titleId, title } = props;

    return (
        <section className={styles.Root}>
            <Typography
                align={"left"}
                id={titleId}
                component={"header"}
                paragraph={true}
                variant={"h4"}
            >
                {title}
            </Typography>
            {content}
        </section>
    );
}

Chapter.propTypes = {
    content: PropTypes.node,
    title: PropTypes.node,
    titleId: PropTypes.string
};

export default Chapter;
