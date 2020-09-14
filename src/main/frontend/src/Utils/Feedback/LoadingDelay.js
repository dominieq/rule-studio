import React from "react";
import PropTypes from "prop-types";

/**
 * Delays children of this component before they show up.
 *
 * @name Loading Delay
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param props {Object}
 * @param props.children {React.ReactElement} - The content of the component that needs to be delayed.
 * @param [props.timeout=250] {number} - The time that needs to elapse before the children will be visible.
 * @returns {React.ReactElement} - The children of the component after timeout.
 */
class LoadingDelay extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            displayLoading: false
        };

        this.timer = setTimeout(this.displayLoading, 250);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    displayLoading = () => {
        this.setState(prevState => ({
            displayLoading: !prevState.displayLoading
        }));
    };

    render() {
        const {displayLoading} = this.state;
        if (!displayLoading) {
            return null;
        } else {
            return this.props.children;
        }
    }
}

LoadingDelay.propTypes = {
    children: PropTypes.element.isRequired,
    timeout: PropTypes.number,
};

LoadingDelay.defaultProps = {
    timeout: 250
};

export default LoadingDelay;