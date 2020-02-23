import React, {Children, Component , PureComponent} from 'react';
import PropTypes from 'prop-types';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import DominanceComparison from "./api/DominanceComparison";

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


export class ObjectListItemArray extends PureComponent {

    createComparison = (mainObject, optionalObject) => {
        const comparison = new DominanceComparison(mainObject, optionalObject, this.props.name);
        this.props.onItemClick(comparison);
    };

    render() {
        const {name, items} = this.props;
        const id = name.toLowerCase().replace(" ", "-");
        const label = <ObjectListItemLabel title={name} numberOfItems={items.length} />;

        return (
            <TreeItem
                label={label}
                nodeId={id + "-dominance-list"}
            >
                {items.map(item => (
                    <TreeItem
                        key={item}
                        label={item}
                        nodeId={id + "-dominance-item-" + item}
                        onClick={() => this.createComparison(item, id)}
                        onBlur={() => this.props.onItemBlur()}
                    />
                ))}
            </TreeItem>
        )
    }
}

ObjectListItemArray.propTypes = {
    name: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onItemBlur: PropTypes.func.isRequired,
};


export class ObjectListItemContent extends Component {

    render() {
        const {children, dominance} = this.props;
        let child = {};

        Children.forEach(children, element => {
            if (React.isValidElement(element)) {
                if (element.props.name === dominance) child = element;
            }
        });

        return (
            <TreeView
                defaultExpandIcon={<ChevronRightIcon />}
                defaultCollapseIcon={<ExpandMoreIcon />}
            >
                {dominance !== "All" ? child : children}
            </TreeView>
        );
    }
}

ObjectListItemContent.propTypes = {
    children: PropTypes.array.isRequired,
    dominance: PropTypes.string.isRequired,
};