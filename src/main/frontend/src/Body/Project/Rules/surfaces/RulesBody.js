import React from 'react';
import PropTypes from 'prop-types';

function RulesBody(props) {
    const children = props.children;

    return (
        <div>
            {children}
        </div>
    )
}

RulesBody.propTypes = {
    children: PropTypes.any.isRequired,
};

export default RulesBody