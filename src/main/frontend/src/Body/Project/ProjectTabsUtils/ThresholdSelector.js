import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import RuleWorkHelper from "../../../RuleWorkComponents/Feedback/RuleWorkHelper";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledSlider from "../../../RuleWorkComponents/Inputs/StyledSlider";

class ThresholdSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            consistency: 0.0,
        };
    }

    onInputChange = (event) => {
        let input = event.target.value.toString();
        if (input.includes(",")) {
            input = input.replace(",", ".");
        }

        if (!isNaN(Number(input)) && input.length < 5) {
            const regEx = new RegExp(/^[01]\.\D*$/);
            const typingInProgress = input === "" || regEx.test(input);
            this.setState({
                consistency: typingInProgress ? input : Number(input),
            });
        }
    };

    onInputBlur = () => {
        this.setState(prevState => ({
            consistency: Number(prevState.consistency),
        }), () => {
            if (this.state.consistency > 1) {
                this.setState({
                    consistency: 1,
                }, () => {
                    this.props.onChange(this.state.consistency);
                });
            }
        });
    };

    onSliderChange = (event, newValue) => {
        this.setState({
            consistency: newValue,
        });
    };

    onSliderMouseUp = () => {
        this.props.onChange(this.state.consistency);
    };

    render() {
        const consistency = this.state.consistency;

        return (
            <Fragment>
                <RuleWorkHelper
                    style={{marginRight: 16}}
                >
                    {"Add more information to tooltip"}
                </RuleWorkHelper>
                <RuleWorkTextField
                    fullWidth={true}
                    onBlur={this.onInputBlur}
                    onChange={this.onInputChange}
                    style={{marginRight: 6, maxWidth: 72}}
                    value={consistency}
                >
                    Choose threshold
                </RuleWorkTextField>
                <StyledSlider
                    max={1.0}
                    min={0.0}
                    onChange={this.onSliderChange}
                    onMouseUp={this.onSliderMouseUp}
                    step={0.01}
                    style={{marginLeft: 6, marginRight: 24, maxWidth: 72}}
                    value={typeof consistency === "number" ? consistency : 0.0}
                />
            </Fragment>
        );
    }
}

ThresholdSelector.propTypes = {
    onChange: PropTypes.func,
};

export default ThresholdSelector
