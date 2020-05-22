import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import styles from "../styles/Image.module.css";

function Image(props) {
    const { caption, src } = props;

    return (
        <figure className={styles.Root}>
            <img alt={caption} className={styles.Image} src={src}/>
            <Typography
                align={"center"}
                component={"figcaption"}
                variant={"caption"}
            >
                {caption}
            </Typography>
        </figure>

    );
}

Image.propTypes = {
    caption: PropTypes.node,
    src: PropTypes.string
};

export default Image;
