import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

class RuleItem extends Component {

    render() {
        const rule = this.props.rule;

        return (
            <ListItem
                button={true}
                onClick={() => this.props.onRuleClick(false, rule)}
                onBlur={() => this.props.onRuleBlur(true, rule)}
            >
                <ListItemText>
                    <Typography variant={"button"} color={"secondary"}>
                        {rule.name}
                    </Typography>
                    <Typography variant={"subtitle2"}>
                        {rule.description}
                    </Typography>
                </ListItemText>
            </ListItem>
        )
    }
}

RuleItem.propTypes = {
    rule: PropTypes.object,
    onRuleClick: PropTypes.func.isRequired,
    onRuleBlur: PropTypes.func.isRequired,
};

RuleItem.defaultProps = {
      rule: {name: "rule 0", description: "I am rule number 0"}
};

export default RuleItem;