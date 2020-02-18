import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import "./ConesBar.css";

function getDominanceTypes() {
    return [
        "positive",
        "negative",
        "positive inverted",
        "negative inverted",
    ]
}

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

    searchText = (event) => {
        const searchText = event.target.value;

        if (searchText === "") {
            this.props.setVariants(this.props.variants)
        }

        let variants = [];

        for (let i = 0; i < this.props.variants.length; i++) {
            const variant = this.props.variants[i];

            if (variant.id.includes(searchText)) {
                variants = [...variants, variant];
            }
        }

        this.props.setVariants(variants);
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

                        <InputLabel ref={this.label}>
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
                                <em>None</em>
                            </MenuItem>
                            {dominanceTypes.map((option, index) => (
                                <MenuItem key={dominanceTypes[index]} value={index}>
                                    {dominanceTypes[index]}
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
                    onChange={this.searchText}
                />
            </Paper>
        )
    }
}

export default ConesBar;