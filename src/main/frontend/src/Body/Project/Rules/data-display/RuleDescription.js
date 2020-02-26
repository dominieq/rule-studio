import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "./RuleDescription.css";

class RuleDescription extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true,
            rule: {
                name: "rule 0",
                description: "I am rule number 0"
            },
        };
    }

    onRuleAction = (hidden, rule) => {
        this.setState({
            hidden: hidden,
            rule: rule,
        });
    };

    render() {
        const {hidden, rule} = this.state;

        return (
            <Paper
                className={"rule-description"}
                hidden={hidden}
                square={true}
                elevation={2}
            >
                <Grid container spacing={2} justify={"center"} alignItems={"center"}>
                    <Grid item>
                        {rule.name}
                    </Grid>
                    <Grid item>
                        {rule.description}
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default RuleDescription;