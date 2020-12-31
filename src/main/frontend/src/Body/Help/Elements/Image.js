import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import styles from "../styles/Image.module.css";

/**
 * <h3>Overview</h3>
 * Displays images from manual as
 * a composition of three HTML tags: <code>figure</code>, <code>img</code> and <code>figcaption</code>.
 *
 * @constructor
 * @category Help
 * @subcategory Elements
 * @param {Object} props
 * @param {string} props.aria-label - The aria-label attribute of the figcaption element.
 * @param {React.ReactNode} props.caption - The content of the figcaption element.
 * @param {number|string} props.height - The height of the figure element.
 * @param {string} props.src - The src attribute of the img element.
 * @param {number|string} props.width - The width of the figure element.
 * @returns {React.ReactElement}
 */
function Image(props) {
    const { "aria-label": ariaLabel, caption, height, src, width } = props;

    return (
        <figure className={styles.Root} style={{height, width}}>
            <img
                alt={caption}
                aria-labelledby={ariaLabel}
                className={styles.Image}
                src={src}
                title={caption}
            />
            <Typography
                align={"center"}
                aria-label={ariaLabel}
                component={"figcaption"}
                variant={"caption"}
            >
                {caption}
            </Typography>
        </figure>

    );
}

Image.propTypes = {
    "aria-label": PropTypes.string,
    caption: PropTypes.node,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    src: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Image;
