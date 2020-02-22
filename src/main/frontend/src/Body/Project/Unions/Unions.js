import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import UnionsBar from "./UnionsBar";
import ConsistencySelector from "./ConsistencySelector";
import UnionListItem from "./UnionListItem";
import Union from "./api/Union";
import unions from "./resources/demo/example-unions";
import "./Unions.css";
import UnionListItemContent from "./UnionListItemContent";

class Unions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            consistency: 1.0,
            downwardUnions: [],
            upwardUnions: [],
        };
    }

    setConsistency = (consistency) => {
        this.setState({
            consistency: consistency,
        });
    };

    getUnions = () => {
        const downwardUnions = unions.downwardUnions;
        const upwardUnions = unions.upwardUnions;

        let downward = [];
        let upward = [];

        for (let i = 0; i < downwardUnions.length; i++) {
            let union = this.unionByIndex(
                "down-" + i,
                "At most",
                downwardUnions[i]
            );
            downward = [...downward, union];
        }

        for (let i = 0; i < upwardUnions.length; i++) {
            let union = this.unionByIndex(
                "up-" + i,
                "At least",
                upwardUnions[i]
            );
            upward = [...upward, union];
        }

        this.setState({
            downwardUnions: downward,
            upwardUnions: upward,
        });
    };

    unionByIndex = (index, name, union) => {
        return new Union(index, name, union);
    };

    countUnions = () => {
        this.getUnions();
    };

    render() {
        const {downwardUnions, upwardUnions} = this.state;

        return (
            <div className={"unions"}>
                <UnionsBar>
                    <Typography color={"primary"} variant={"h6"} component={"div"}>
                        Choose consistency:
                    </Typography>
                    <ConsistencySelector
                        setGlobalConsistency={(c) => this.setConsistency(c)}
                    />
                    <span>
                        <Typography variant={"subtitle2"}>
                            Current consistency: {this.state.consistency}
                        </Typography>
                    </span>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        disableElevation
                        onClick={this.countUnions}
                    >
                        Count unions
                    </Button>
                </UnionsBar>
                <div className={"unions-list"}>
                    {downwardUnions.map(union => (
                        <UnionListItem key={union.id} union={union}>
                            <UnionListItemContent union={union} />
                        </UnionListItem>
                    ))}
                    {upwardUnions.map(union => (
                        <UnionListItem key={union.id} union={union}>
                            <UnionListItemContent union={union} />
                        </UnionListItem>
                    ))}
                </div>
            </div>
        )
    }
}

export default Unions