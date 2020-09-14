import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import styles from "../styles/Chapter.module.css";

/**
 * Presents chapters from RuLeStudio's manual.
 *
 * @constructor
 * @category Help
 * @subcategory Elements
 * @param {Object} props
 * @param {React.ReactNode} props.content - The content of the element.
 * @param {React.ReactNode} props.title - The title of the element.
 * @param {string} props.titleId - The id of the element.
 * @returns {React.ReactElement}
 */
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
