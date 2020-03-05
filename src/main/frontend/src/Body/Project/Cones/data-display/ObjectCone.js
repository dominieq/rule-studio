import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

function ObjectListItemLabel(props) {
    const {title, numberOfItems} = props;

    return (
        <div className={"object-list-item-label"}>
            <Typography component={"span"}>
                {title}
            </Typography>
            <Typography color={"secondary"} variant={"subtitle2"} component={"div"}>
                ({numberOfItems})
            </Typography>
        </div>
    )
}

ObjectListItemLabel.propTypes = {
    title: PropTypes.any.isRequired,
    numberOfItems: PropTypes.any.isRequired,
};

function ObjectCone(props) {
    const {hidden, name, items} = props;
    const id = name.toLowerCase().replace(" ", "-");
    const label = <ObjectListItemLabel title={name} numberOfItems={items.length} />;

    return (
        <TreeItem
            hidden={hidden}
            label={label}
            nodeId={id + "-dominance-list"}
        >
            {items.map(item => (
                <TreeItem
                    key={item}
                    label={item + 1}
                    nodeId={id + "-dominance-item-" + item}
                    onClick={() => props.onItemChangeSelection({optional: item + 1, relation: id})}
                    onBlur={() => props.onItemChangeSelection(null)}
                />
            ))}
        </TreeItem>
    )
}

ObjectCone.propTypes = {
    hidden: PropTypes.bool,
    name: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onItemChangeSelection: PropTypes.func.isRequired,
};

ObjectCone.defaultProps = {
    hidden: false,
};

export default ObjectCone;