import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import UnionsBar from "./UnionsBar";
import ConsistencySelector from "./ConsistencySelector";

class Unions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            consistency: 1.0,
            unions: [],
        };
    }

    setConsistency = (consistency) => {
        this.setState({
            consistency: consistency,
        });
    };

    countUnions = () => {
        // TODO count unions
    };

    render() {
        return (
            <div>
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
            </div>
        )
    }
}

export default Unions