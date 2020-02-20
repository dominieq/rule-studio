import React, {Component} from 'react';
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import {getDominanceTypes} from "./api/DominanceTypes";
import "./ConesBar.css";

class ConesBar extends Component {
    constructor(props) {
        super(props);

        this.label = React.createRef();

        this.state = {
            labelWidth: 0,
        };
    }

    componentDidMount() {
        this.setLabelWidth(this.label.current.offsetWidth);
    }

    componentWillUnmount() {
        this.setLabelWidth(this.label.current.offsetWidth);
    }

    setLabelWidth = (value) => {
        this.setState({
            labelWidth: value,
        })
    };

    setDominance = (event) => {
        this.props.setDominance(event.target.value);
    };

    filterText = (event) => {
        this.props.filterText(event.target.value);
    };

    render() {
        const dominanceTypes = getDominanceTypes();

        return (
            <Paper component={"div"} className={"upper-panel"} square elevation={3}>

                <Typography>
                    Choose dominance cones:
                </Typography>
                <div className={"dominance-type-wrapper"}>
                    <FormControl variant={"outlined"} fullWidth={true}>

                        <InputLabel ref={this.label} id={"dominance-type-selector-label"}>
                            Dominance
                        </InputLabel>
                        <Select
                            id={"dominance-type-selector"}
                            labelId={"dominance-type-selector-label"}
                            labelWidth={this.state.labelWidth}
                            value={this.props.dominance}
                            onChange={this.setDominance}
                        >
                            <MenuItem value={""}>
                                <em>All</em>
                            </MenuItem>
                            {dominanceTypes.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <span />
                <TextField
                    id={"variant-search"}
                    label={"Search variant"}
                    type={"search"}
                    variant={"outlined"}
                    onChange={this.filterText}
                />
            </Paper>
        )
    }
}

ConesBar.propTypes = {
    dominance: PropTypes.any.isRequired,
    filterText: PropTypes.func.isRequired,
    setDominance: PropTypes.func.isRequired,
};

export default ConesBar;