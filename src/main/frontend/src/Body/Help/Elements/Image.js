import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import styles from "../styles/Image.module.css";

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
