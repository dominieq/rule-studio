import React from "react";
import PropTypes from "prop-types";

/**
 * <h3>Overview</h3>
 * Delays children of this component before they show up.
 *
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props
 * @param {React.ReactElement} props.children - The content of the component that needs to be delayed.
 * @returns {React.PureComponent}
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
    children: PropTypes.element.isRequired
};

export default LoadingDelay;
