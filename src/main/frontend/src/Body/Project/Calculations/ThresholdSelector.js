import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CircleHelper from "../../../Utils/Feedback/CircleHelper";
import CustomTextField from "../../../Utils/Inputs/CustomTextField";
import StyledSlider from "../../../Utils/Inputs/StyledSlider";
import styles from "./styles/Calculations.module.css";

const tooltip = {
    mainSimple: " is used when calculating lower approximations of unions of ordered decision classes " +
        "according to the Variable Consistency Dominance-based Rough Set Approach (VC-DRSA). " +
        "In VC-DRSA, an object y, belonging to a union of ordered decision classes X, " +
        "is considered to belong to the lower approximation of X if selected consistency measure, " +
        "calculated with respect to y and X, satisfies considered consistency threshold t. " +
        "Note that for a gain-type consistency measure, like rough membership, one checks if measure’s value is \u2265 t. " +
        "However, for a cost-type consistency measure, like epsilon, one checks if measure’s value is \u2264 t.",
    mainExtended: " is used when calculating lower approximations of unions of ordered decision classes " +
        "according to the Variable Consistency Dominance-based Rough Set Approach (VC-DRSA), " +
        "and then, when inducing decision rules. " +
        "In VC-DRSA, an object y, belonging to a union of ordered decision classes X, " +
        "is considered to belong to the lower approximation of X if selected consistency measure, " +
        "calculated with respect to y and X, satisfies considered consistency threshold t. " +
        "Note that for a gain-type consistency measure, like rough membership, one checks if measure’s value is \u2265 t. " +
        "However, for a cost-type consistency measure, like epsilon, one checks if measure’s value is \u2264 t.",
};

/**
 * <h3>Overview</h3>
 * Presents threshold and allows user to choose on the slider or type new value.
 *
 * @name Threshold
 * @constructor
 * @category Project
 * @subcategory Calculations
 * @param {Object} props
 * @param {Object} props.CircleHelperProps - Props applied to the {@link CircleHelper} element.
 * @param {boolean} [props.keepChanges=true] - If <code>false</code> changes aren't stored in the state.
 * @param {function} props.onChange - Callback fired when value changed.
 * @param {Object} props.SliderProps - Props applied to the {@link StyledSlider} element.
 * @param {Object} props.TextFieldProps - Props applied to the {@link CustomTextField} element.
 * @param {*} props.value - The current threshold value.
 * @param {"simple"|"extended"} [props.variant="simple"] - Determines what text should be displayed in the tooltip.
 * @returns {React.ReactElement}
 */
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
        if (!this.props.keepChanges) return;

        let input = event.target.value.toString();
        if (input.includes(",")) {
            input = input.replace(",", ".");
        }

        if (!isNaN(Number(input)) && input.length < 5) {
            const regEx = new RegExp(/^[01]\.[0-9]*$/);
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
        if (!this.props.keepChanges) return;

        this.setState({
            threshold: newValue,
        });
    };

    onSliderChangeCommitted = () => {
        this.props.onChange(this.state.threshold);
    };

    render() {
        const { threshold } = this.state;
        const { CircleHelperProps, SliderProps, TextFieldProps, variant } = this.props;

        return (
            <div aria-label={"outer wrapper"} className={styles.OuterWrapper} style={this.props.style}>
                <CircleHelper
                    title={
                        <p aria-label={"main"} style={{margin: 0, textAlign: "justify"}}>
                            <b>Consistency threshold</b>
                            {tooltip["main" + variant[0].toUpperCase() + variant.slice(1)]}
                        </p>
                    }
                    WrapperProps={{
                        style: { marginRight: 16 }
                    }}
                    {...CircleHelperProps}
                />
                <div aria-label={"inner wrapper"} className={styles.InnerWrapper} style={{marginRight: 16}}>
                    <CustomTextField
                        onBlur={this.onInputBlur}
                        onChange={this.onInputChange}
                        outsideLabel={"Choose consistency threshold"}
                        style={{ maxWidth: 72, minWidth: 60 }}
                        value={threshold}
                        {...TextFieldProps}
                    />
                </div>
                <StyledSlider
                    max={1.0}
                    min={0.0}
                    onChange={this.onSliderChange}
                    onChangeCommitted={this.onSliderChangeCommitted}
                    step={0.01}
                    style={{ marginRight: 24, maxWidth: 72, minWidth: 60}}
                    value={typeof threshold === "number" ? threshold : 0.0}
                    {...SliderProps}
                />
            </div>
        );
    }
}

ThresholdSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    keepChanges: PropTypes.bool,
    onChange: PropTypes.func,
    SliderProps: PropTypes.object,
    TextFieldProps: PropTypes.object,
    value: PropTypes.any,
    variant: PropTypes.oneOf(["simple", "extended"])
};

ThresholdSelector.defaultProps = {
    keepChanges: true,
    variant: "simple"
};

export default ThresholdSelector
