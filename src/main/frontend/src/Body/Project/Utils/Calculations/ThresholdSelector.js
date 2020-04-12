import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledSlider from "../../../../RuleWorkComponents/Inputs/StyledSlider";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";

class ThresholdSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            threshold: 0,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState.threshold !== this.state.threshold || nextProps.value !== this.props.value;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value) {
            this.setState({
                threshold: this.props.value,
            });
        }
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
                threshold: typingInProgress ? input : Number(input),
            });
        }
    };

    onInputBlur = () => {
        this.setState(prevState => ({
            threshold: Number(prevState.threshold),
        }), () => {
            if (this.state.threshold > 1) {
                this.setState({
                    threshold: 1,
                }, () => {
                    this.props.onChange(this.state.threshold);
                });
            } else {
                this.props.onChange(this.state.threshold);
            }
        });
    };

    onSliderChange = (event, newValue) => {
        this.setState({
            threshold: newValue,
        }, () => { 
            this.props.onChange(this.state.threshold)
        });
    };

    render() {
        const { threshold } = this.state;
        const { CircleHelperProps, id, SliderProps, TextFieldProps } = this.props;
        return (
            <div id={id} style={{display: "flex", alignItems: "center", margin: "4px 0"}}>
                <CircleHelper
                    title={"Add more information to tooltip"}
                    WrapperProps={{
                        style: {marginRight: 16}
                    }}
                    {...CircleHelperProps}
                />
                <RuleWorkSmallBox style={{flexGrow: 1, margin: 0}}>
                    <RuleWorkTextField
                        onBlur={this.onInputBlur}
                        onChange={this.onInputChange}
                        outsideLabel={"Choose consistency threshold"}
                        style={{marginRight: 6, maxWidth: 72, minWidth: 60}}
                        value={threshold}
                        {...TextFieldProps}
                    />
                </RuleWorkSmallBox>
                <StyledSlider
                    max={1.0}
                    min={0.0}
                    onChange={this.onSliderChange}
                    step={0.01}
                    style={{marginLeft: 6, marginRight: 24, maxWidth: 72, minWidth: 60}}
                    value={typeof threshold === "number" ? threshold : 0.0}
                    {...SliderProps}
                />
            </div>
        );
    }
}

ThresholdSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    id: PropTypes.string,
    onChange: PropTypes.func,
    SliderProps: PropTypes.object,
    TextFieldProps: PropTypes.object,
    value: PropTypes.any,

};

export default ThresholdSelector
