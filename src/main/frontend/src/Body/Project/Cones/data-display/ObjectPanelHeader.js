import React from 'react';
import PropTypes from 'prop-types';
import {getDominanceTypes} from "../api/DominanceTypes";
import RuleWorkSelect from "../../../../RuleWorkComponents/Inputs/RuleWorkSelect";

function ObjectPanelHeader(props) {
    const {dominance, label, onDominanceChange} = props;

    return (
        <RuleWorkSelect
            isPropagationStopped={true}
            label={label}
            labelVariant={"button"}
            onChange={onDominanceChange}
            value={dominance}
        >
            {["All", ...getDominanceTypes()]}
        </RuleWorkSelect>
    );
}

ObjectPanelHeader.propTypes = {
    dominance: PropTypes.string.isRequired,
    label: PropTypes.any.isRequired,
    onDominanceChange: PropTypes.func.isRequired,
};

export default ObjectPanelHeader;