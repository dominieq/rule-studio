import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Slider from "@material-ui/core/Slider";
import "./ConsistencySelector.css"

class ConsistencySelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            consistency: 1.0,
        };
    }

    onInputChange = (event) => {
        let value = event.target.value.toString();
        if (value.includes(",")) {
            value = value.replace(",", ".");
        }
        if (!isNaN(Number(value))) {
            const regEx = new RegExp(/[01]\.0*?$/);
            const typingInProgress = value === "" || regEx.test(value);
            this.setState({
                consistency: typingInProgress ? value : Number(value),
            });
        }
    };

    onInputBlur = () => {
        const value = this.state.consistency;

        if (value === "") {
            this.setState({
                consistency: 0.0,
            }, () => {
                this.onInputBlurGlobal();
            });
        } else if (value > 1.0) {
            this.setState({
                consistency: 1.0,
            }, () => {
                this.onInputBlurGlobal();
            });
        } else if (value.toString().length > 3) {
            this.setState({
                consistency: Number(value.toString().slice(0, 4)),
            }, () => {
                this.onInputBlurGlobal();
            });
        }
    };

    onInputBlurGlobal = () => {
        this.props.setGlobalConsistency(this.state.consistency);
    };

    onSliderChange = (event, newValue) => {
        this.setState({
            consistency: newValue,
        });
    };

    onSliderMouseUp = () => {
        this.props.setGlobalConsistency(this.state.consistency);
    };

    render() {
        const consistency = this.state.consistency;

        return (
            <div className={"consistency-selector"}>
                <FormControl
                    id={"consistency-form"}
                    component={"div"}
                    variant={"outlined"}
                    margin={"dense"}
                >
                    <OutlinedInput
                        id={"consistency-input"}
                        value={consistency}
                        onChange={this.onInputChange}
                        onBlur={this.onInputBlur}
                    />
                </FormControl>
                <Slider
                    id={"consistency-slider"}
                    aria-labelledby={"consistency-form"}
                    value={typeof consistency === "number" ? consistency : 0.0}
                    step={0.01}
                    min={0.0}
                    max={1.0}
                    onChange={this.onSliderChange}
                    onMouseUp={this.onSliderMouseUp}
                />
            </div>
        );
    }
}

ConsistencySelector.propTypes = {
    setGlobalConsistency: PropTypes.func.isRequired,
};

export default ConsistencySelector
