import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/Slides.module.css";

/**
 * Creates a horizontal sliding animation.
 *
 * @memberOf Slides
 * @param sliding {boolean} - If <code>true</code> the component will slide in given direction.
 * @param direction {('backward'|'forward')} - The direction of current slide.
 * @param duration {number} - The duration of a slide in milliseconds.
 * @returns {Object} - The style object with horizontal transformation.
 */
const getHorizontalTransition = (sliding, direction, duration) => {
    return {
        transition: sliding ? `transform ${duration}ms ease` : "none",
        transform: !sliding ? "translateX(0%)" :
            direction === "forward" ? "translateX(-100%)" : "translateX(100%)"
    };
};

/**
 * Creates a vertical sliding animation.
 *
 * @memberOf Slides
 * @param sliding {boolean} - If <code>true</code> the component will slide in given direction.
 * @param direction {('backward'|'forward')} - The direction of current slide.
 * @param duration {number} - The duration of a slide in milliseconds.
 * @returns {Object} - The style object with vertical transformation.
 */
const getVerticalTransition = (sliding, direction, duration) => {
    return {
        transition: sliding ? `transform ${duration}ms ease` : "none",
        transform: !sliding ? "translateY(0%)" :
            direction === "forward" ? "translateY(-100%)" : "translateY(100%)"
    };
};

/**
 * Counts the flex order of currently processed slot.
 *
 * @memberOf Slides
 * @param index {number} - The id of currently processed slot.
 * @param value {number} - The id of currently selected slot.
 * @param count {number} - Number of slots.
 * @param reverse {boolean} - If <code>true</code> it means the component is sliding backwards.
 * @returns {number} - The flex order of currently processed slot.
 */
const getOrder = (index, value, count, reverse) => {
    let base = index - value < 0 ? count - Math.abs(index - value) : index - value
    return reverse && base ? count - base : base;
};

/**
 * A component that takes an array of containers and enables user to move between. The component provides a slide
 * animation when a change of view is requested. A programmer should provide the direction of a slide as well as an orientation.
 * It is possible to have different orientations between two distinct slots.
 *
 * @constructor
 * @param props {Object}
 * @param [props.children] {React.ReactNode} - The content of the component.
 * @param props.direction {('backward'|'forward')} - The direction of current slide.
 * @param [props.duration=1000] {number} - The duration of a slide in milliseconds.
 * @param [props.getSlotStyle] {function} - Callback fired when component requests style for current slot.
 * @param [props.mountNeighboursOnly=true] {boolean} - If <code>true</code> only neighbouring slots will be rendered.
 * @param [props.orientation='horizontal'] {('horizontal'|'vertical')} - The orientation of current slide.
 * @param props.sliding {boolean} - If <code>true</code> the component will slide in given direction.
 * @param [props.value] {number} - The id of current slot.
 * @returns {React.ReactElement}
 */
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
