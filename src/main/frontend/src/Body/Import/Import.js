import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import TabBody from "./TabBody";
import "./Import.css";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            component={"div"}
            className={"tab-body-wrapper"}
            role={"tabpanel"}
            hidden={value !== index}
            id={`import-tabpanel-${index}`}
            aria-labelledby={`import-tab-${index}`}
            {...other}
            >
            {value === index && children}
        </Box>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

class Import extends Component{
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.setTabProps = this.setTabProps.bind(this);
    }

    handleChange(event, newValue) {
        this.setState({
            value: newValue,
        });
    };

    setTabProps(index) {
        return ({
            id: `import-tab-${index}`,
            'aria-controls': `import-tabpanel-${index}`,
        });
    }

    render() {
        return (
            <Box component={"div"} className={"import-root"}>
                <Paper square={true} className={"tabs-wrapper"}>
                    <Paper elevation={3}>
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor={"primary"}
                            textColor={"primary"}
                            aria-label={"import tabs"}
                            centered={true}>

                            <Tab label={"Import data"} {...this.setTabProps(0)} />
                            <Tab label={"Import rules"} {...this.setTabProps(1)} />
                        </Tabs>
                    </Paper>
                    <TabPanel value={this.state.value} index={0} >
                        <TabBody textValue={"Select data file"}>
                            Data
                        </TabBody>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1} >
                        <TabBody textValue={"Select rules file"}>
                            Rules
                        </TabBody>
                    </TabPanel>
                </Paper>
            </Box>
        );
    }
}

export default Import;