import React from "react";
import PropTypes from "prop-types";

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