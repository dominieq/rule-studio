import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import styles from "../styles/Image.module.css";

function Image(props) {
    const { ["aria-label"]: ariaLabel, caption, height, src, width } = props;

    return (
        <figure className={styles.Root}>
            <img
                alt={caption}
                aria-labelledby={ariaLabel}
                className={styles.Image}
                height={height}
                src={src}
                title={caption}
                width={width}
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
    height: PropTypes.number,
    src: PropTypes.string,
    width: PropTypes.number
};

export default Image;
