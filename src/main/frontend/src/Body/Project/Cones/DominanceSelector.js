import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {getDominanceTypes} from "./api/DominanceTypes";


class DominanceSelector extends Component {
    constructor(props) {
        super(props);

        this.label = React.createRef();

        this.state = {
            labelWidth: 0,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const dominanceChanged = this.props.dominance !== nextProps.dominance;
        const labelWidthChanged = this.state.labelWidth !== nextState.labelWidth;
        return dominanceChanged || labelWidthChanged;
    }

    componentDidMount() {
        this.setState({
            labelWidth: this.label.current.offsetWidth,
        });
    }

    componentWillUnmount() {
        this.setState({
            labelWidth: this.label.current.offsetWidth,
        });
    }

    render() {
        const dominanceTypes = getDominanceTypes();

        return (
            <div className={"dominance-selector-wrapper"}>
                <FormControl variant={"outlined"} fullWidth={true}>

                    <InputLabel ref={this.label} id={"dominance-selector-label"}>
                        Dominance
                    </InputLabel>
                    <Select
                        id={"dominance-selector"}
                        labelId={"dominance-selector-label"}
                        labelWidth={this.state.labelWidth}
                        value={this.props.dominance}
                        onChange={event => this.props.setDominance(event)}
                    >
                        <MenuItem value={"All"}>
                            <em>All</em>
                        </MenuItem>
                        {dominanceTypes.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        );
    }
}

DominanceSelector.propTypes = {
    dominance: PropTypes.string.isRequired,
    setDominance: PropTypes.func.isRequired
};

export default DominanceSelector;