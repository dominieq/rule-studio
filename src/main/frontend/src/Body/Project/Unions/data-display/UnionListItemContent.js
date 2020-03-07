import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import Union from "../api/Union";
import "./UnionListItemContent.css";

class UnionListItemLabel extends Component {

    render() {
        const {title, numberOfObjects} = this.props;

        return (
            <div className={"union-list-item-label"}>
                <Typography>
                    {title}
                </Typography>
                <Typography variant={"subtitle2"} color={"secondary"}>
                    ({numberOfObjects})
                </Typography>
            </div>
        )
    }
}

UnionListItemLabel.propTypes = {
    title: PropTypes.string.isRequired,
    numberOfObjects: PropTypes.number.isRequired,
};

class UnionListItemArray extends Component {

    render() {
        const {name, items} = this.props;
        const id = name.toLowerCase().replace(" ", "-");
        const label = <UnionListItemLabel title={name} numberOfObjects={items.length} />;

        return (
            <TreeItem
                label={label}
                nodeId={id + "-list"}
                TransitionProps={{unmountOnExit: true}}
            >
                {items.map(item => (
                    <TreeItem
                        key={item}
                        label={item}
                        nodeId={id + "-item-" + item}
                    />
                ))}
            </TreeItem>
        )
    }

}

UnionListItemArray.propTypes = {
    name: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
};


class UnionListItemContent extends Component {

    render() {
        const union = this.props.union;

        return (
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                <UnionListItemArray name={"Objects"} items={union.objects} />
                <UnionListItemArray name={"Lower approximation"} items={union.lowerApproximation} />
                <UnionListItemArray name={"Upper approximation"} items={union.upperApproximation} />
                <UnionListItemArray name={"Boundary"} items={union.boundary} />
                <UnionListItemArray name={"Positive region"} items={union.positiveRegion} />
                <UnionListItemArray name={"Negative region"} items={union.negativeRegion} />
                <UnionListItemArray name={"Boundary region"} items={union.boundaryRegion} />
            </TreeView>
        )
    }
}

UnionListItemContent.propTypes = {
    union: PropTypes.instanceOf(Union).isRequired,
};

export default UnionListItemContent;