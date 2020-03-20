import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";

const StyledListItem = withStyles({

})(props => <ListItem button={true} {...props} />);

function RuleWorkListItem(props) {
    const {object, ...other} = props;

    return (
        <StyledListItem {...other}>
            {object.name}
        </StyledListItem>
    )
}

RuleWorkListItem.propTypes = {
    object: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        traits: PropTypes.object,
        actions: PropTypes.object,
        tables: PropTypes.object,
    }),
};

export default RuleWorkListItem