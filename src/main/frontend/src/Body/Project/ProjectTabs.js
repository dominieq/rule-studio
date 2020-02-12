import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

function TabPanel(props) {
    const { children, value, index, ...other} = props;

    return (
        <Box
            component={"div"}
            role={"tabpanel"}
            hidden={value !== index}
            id={`project-tabpanel-${index}`}
            aria-labelledby={`project-tab-${index}`}
            {...other}>
            {value === index && children}

        </Box>
    )
}

TabPanel.propTypes = {
    children: PropTypes.any,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

class ProjectTabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.setTabProps = this.setTabProps.bind(this);
    }

    handleChange(event, newValue) {
        this.setState({
            value: newValue
        })
    }

    setTabProps(index) {
        return ({
            id: `project-tab-${index}`,
            'aria-controls': `project-tabpanel-${index}`,
        })
    }

    render() {
        return (
            <Box component={"div"}>
                <Paper elevation={0}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor={"primary"}
                        textColor={"primary"}
                        aria-label={"project tabs"}>

                        <Tab label={"Data"} {...this.setTabProps(0)} />
                        <Tab label={"Dominance cones"} {...this.setTabProps(1)} />
                        <Tab label={"Class unions"} {...this.setTabProps(2)} />
                        <Tab label={"Rules"} {...this.setTabProps(3)} />
                        <Tab label={"Classification"} {...this.setTabProps(4)} />
                        <Tab label={"Cross-validation"} {...this.setTabProps(5)} />
                    </Tabs>
                    <TabPanel value={this.state.value} index={0}>
                        Data
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        Dominance cones
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                        Class unions
                    </TabPanel>
                    <TabPanel value={this.state.value} index={3}>
                        Rules
                    </TabPanel>
                    <TabPanel value={this.state.value} index={4}>
                        Classification
                    </TabPanel>
                    <TabPanel value={this.state.value} index={5}>
                        Cross-validation
                    </TabPanel>
                </Paper>
            </Box>
        );
    }
}

export default ProjectTabs;