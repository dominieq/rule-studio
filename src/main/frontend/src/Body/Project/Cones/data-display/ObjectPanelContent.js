import React from 'react';
import PropTypes from 'prop-types';
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ObjectCone from "./ObjectCone";
import {getDominanceTypes} from "../api/DominanceTypes";

function ObjectPanelContent(props) {
    const {dominance, dominanceCones} = props;
    const dominanceTypes = getDominanceTypes();

    return (
        <TreeView
            defaultExpandIcon={<ChevronRightIcon />}
            defaultCollapseIcon={<ExpandMoreIcon />}
        >
            {dominanceCones.map((cone, index) => (
                <ObjectCone
                    key={index}
                    hidden={dominance !== "All" && dominanceTypes[index] !== dominance}
                    name={dominanceTypes[index]}
                    items={cone}
                    onItemChangeSelection={props.onItemChangeSelection}
                />
            ))}
        </TreeView>
    );
}

ObjectPanelContent.propTypes = {
    dominance: PropTypes.string.isRequired,
    dominanceCones: PropTypes.array.isRequired,
    onItemChangeSelection: PropTypes.func.isRequired,
};

ObjectPanelContent.defaultProps = {
    dominance: "All",
};

export default ObjectPanelContent;