import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core";


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabsWrapper: {
        margin: 50
    },
    tabBodyWrapper: {
        margin: 20,
        width: '100%'
    },
    inputWrapper: {

    },
    fileInput: {
        width: '0.1px',
        height: '0.1px',
        opacity: 0,
        overflow: 'hidden',
        position: 'absolute',
        zIndex: -1
    }
}));

function TabBody(props) {
    const { children, textValue, ...other } = props;
    const classes = useStyles();

    return (
        <Grid container spacing={2} direction={"row"} {...other}>
            <Grid item xs container spacing={2} direction={"column"}>
                <Grid item>
                    <div className={classes.inputWrapper}>
                        <input type={"file"} name={"file"} id={"file"} className={classes.fileInput}/>
                        <label for={"file"}>{textValue}</label>
                    </div>
                </Grid>
                <Grid item>
                    <div className={classes.inputWrapper}>
                        <input type={"file"} name={"file"} id={"file"} className={classes.fileInput}/>
                        <label for={"file"}>Select metadata</label>
                    </div>
                </Grid>
            </Grid>
            <Grid item xs>
                {children}
            </Grid>
        </Grid>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    const classes = useStyles();

    return (
        <Box
            component={"div"}
            className={classes.tabBodyWrapper}
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

function tabProps(index) {
    return ({
        id: `import-tab-${index}`,
        'aria-controls': `import-tabpanel-${index}`,
    });
}

function Import(props) {
    const [value, setValue] = useState(0);
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box component={"div"} className={classes.root}>
            <Paper square={true} className={classes.tabsWrapper}>
                <Paper elevation={3}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor={"primary"}
                        textColor={"primary"}
                        aria-label={"import tabs"}
                        centered={true}>

                        <Tab label={"Import data"} {...tabProps(0)} />
                        <Tab label={"Import rules"} {...tabProps(1)} />
                    </Tabs>
                </Paper>
                <TabPanel value={value} index={0} >
                    <TabBody textValue={"Select data file"}>
                        Data
                    </TabBody>
                </TabPanel>
                <TabPanel value={value} index={1} >
                    <TabBody textValue={"Select rules file"}>
                        Rules
                    </TabBody>
                </TabPanel>
            </Paper>
        </Box>
    );
}

export default Import;