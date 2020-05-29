import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/Slides.module.css";

const getHorizontalTransition = (sliding, direction, duration) => {
    return {
        transition: sliding ? `transform ${duration}ms ease` : "none",
        transform: !sliding ? "translateX(0%)" :
            direction === "forward" ? "translateX(-100%)" : "translateX(100%)"
    };
};

const getVerticalTransition = (sliding, direction, duration) => {
    return {
        transition: sliding ? `transform ${duration}ms ease` : "none",
        transform: !sliding ? "translateY(0%)" :
            direction === "forward" ? "translateY(-100%)" : "translateY(100%)"
    };
};

const getOrder = (index, value, count, reverse) => {
    let base = index - value < 0 ? count - Math.abs(index - value) : index - value
    return reverse && base ? count - base : base;
};

function Slides(props) {
    const {
        children,
        direction,
        duration,
        getSlotStyle,
        mountNeighboursOnly,
        orientation,
        sliding,
        value
    } = props;

    const horizontalTransition = getHorizontalTransition(sliding, direction, duration);
    const verticalTransition = getVerticalTransition(sliding, direction, duration);
    const transition = orientation === "horizontal" ? horizontalTransition : verticalTransition;

    let flexDirection = orientation === "horizontal" ? "row" : "column"
    flexDirection = direction === "backward" ? flexDirection + "-reverse" : flexDirection;

    const count = React.Children.count(children);

    return (
        <div
            aria-label={"slide-container"}
            className={styles.Root}
            role={"presentation"}
        >
            <div
                aria-label={"slide-view"}
                className={styles.Slidable}
                style={{ flexDirection: flexDirection, ...transition }}
                role={"list"}
            >
                {React.Children.toArray(children).map((child, index) => (
                    <div
                        aria-label={`slide-slot-${index}`}
                        aria-labelledby={"slide-view"}
                        className={styles.Element}
                        key={index}
                        role={"listitem"}
                        style={{
                            order: getOrder(index, value, count, direction === "backward"),
                            ...typeof getSlotStyle === "function" ? getSlotStyle(index) : {}
                        }}
                    >
                        {mountNeighboursOnly ?
                            index <= value + 1 && index >= value - 1 ? child : null
                            : child
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

Slides.propTypes = {
    children: PropTypes.node,
    direction: PropTypes.oneOf(["backward", "forward"]).isRequired,
    duration: PropTypes.number,
    getSlotStyle: PropTypes.func,
    mountNeighboursOnly: PropTypes.bool,
    orientation: PropTypes.oneOf(["horizontal", "vertical"]),
    sliding: PropTypes.bool.isRequired,
    value: PropTypes.number
};

Slides.defaultProps = {
    mountNeighboursOnly: true,
    orientation: "horizontal",
    duration: 1000
};

export default Slides;
