import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import VariantDrawer from "./VariantDrawer";
import "./UpperPanel.css";

function getDominanceTypes() {
    return [
        "positive",
        "negative",
        "positive inverted",
        "negative inverted",
    ]
}

class UpperPanel extends Component {
    constructor(props) {
        super(props);

        this.label = React.createRef();

        this.state = {
            dominance: "",
            labelWidth: 0,
            openDrawer: false,
        };
    }

    componentDidMount() {
        this.setLabelWidth(this.label.current.offsetWidth);
    }

    componentWillUnmount() {
        this.setLabelWidth(this.label.current.offsetWidth);
    }

    setDominance = (event) => {
        this.setState({
            dominance: event.target.value,
        });
    };

    setLabelWidth = (value) => {
        this.setState({
            labelWidth: value,
        })
    };

    setOpenDrawer = (open) => {
        this.setState({
            openDrawer: open
        })
    };

    selectVariant = (index) => {
        this.props.setSelectedIndex(index);
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
                            value={this.state.dominance}
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
                <span/>
                <Button onClick={() => this.setOpenDrawer(true)}>
                    Choose variant
                </Button>
                <Drawer
                    anchor={"right"}
                    open={this.state.openDrawer}
                    onClose={() => this.setOpenDrawer(false)}
                >
                    <VariantDrawer
                        variants={this.props.variants}
                        close={(o) => this.setOpenDrawer(o)}
                        select={(i) => this.selectVariant(i)}
                    />
                </Drawer>
            </Paper>
        )
    }
}

export default UpperPanel;