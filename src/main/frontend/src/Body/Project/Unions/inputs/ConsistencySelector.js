import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import RuleWorkHelper from "../../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import StyledSlider from "./StyledSlider";
import "./ConsistencySelector.css"


class ConsistencySelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            consistency: 0.0,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !(this.state.consistency === nextState.consistency);
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
        } else {
            this.onInputBlurGlobal();
        }
    };

    onInputBlurGlobal = () => {
        this.props.onConsistencyChange(this.state.consistency);
    };

    onSliderChange = (event, newValue) => {
        this.setState({
            consistency: newValue,
        });
    };

    onSliderMouseUp = () => {
        this.props.onConsistencyChange(this.state.consistency);
    };

    render() {
        const consistency = this.state.consistency;

        return (
            <div id={"consistency-selector"}>
                <RuleWorkHelper>
                    {"Consistency helper"}
                </RuleWorkHelper>
                <RuleWorkTextField
                    label={"Choose consistency"}
                    value={consistency}
                    onChange={this.onInputChange}
                    onBlur={this.onInputBlurGlobal}
                />
                <StyledSlider
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
    onConsistencyChange: PropTypes.func.isRequired,
};

export default ConsistencySelector
