import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DisplayData from "./Data/DisplayData";
import Cones from "./Cones/Cones";
import Rules from "./Rules/Rules";
import Unions from "./Unions/Unions";
import Classification from "./Classification/Classification";

const StyledTabs = withStyles({
    indicator: {
        backgroundColor: "#545F66",
    },
}, {name: "MuiTabs"})(props => <Tabs {...props} />);

const StyledTab = withStyles({
    root: {
        color: "rgb(171,250,169, 0.4)",
        '&:hover': {
            backgroundColor: "rgb(84,95,102, 0.8)",
            color: "rgb(102,255,102, 0.8)",
        },
        '&:focus': {
            backgroundColor: "rgb(84,95,102, 0.8)",
            color: "rgb(102,255,102, 0.8)",
        }
    },
    textColorInherit: {
        '&.Mui-selected': {
            backgroundColor: "#545F66",
            color: "#66FF66",
            opacity: 1,
        },
    }
}, {name: "MuiTab"})(props => <Tab {...props} disableRipple={true} /> );

class ProjectTabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
        };
    }

    onTabChange = (event, newValue) => {
        this.setState({
            value: newValue
        })
    };

    setTabProps = (index) => {
        return ({
            id: `project-tab-${index}`,
            'aria-controls': `project-tabpanel-${index}`,
        })
    };

    render() {
        const value = this.state.value;

        return (
            <Fragment>
                <StyledTabs
                    aria-label={"project tabs"}
                    centered={true}
                    onChange={this.onTabChange}
                    value={value}
                >
                    <StyledTab label={"Data"} {...this.setTabProps(0)} />
                    <StyledTab label={"Dominance cones"} {...this.setTabProps(1)} />
                    <StyledTab label={"Class unions"} {...this.setTabProps(2)} />
                    <StyledTab label={"Rules"} {...this.setTabProps(3)} />
                    <StyledTab label={"Classification"} {...this.setTabProps(4)} />
                    <StyledTab label={"Cross-validation"} {...this.setTabProps(5)} />
                </StyledTabs>
                {
                    {
                        0: <DisplayData {...this.props} value={0} />,
                        1: <Cones {...this.props} value={1} />,
                        2: <Unions {...this.props} value={2} />,
                        3: <Rules {...this.props} value={3} />,
                        4: <Classification {...this.props} value={4} />,
                        5: "Cross-validation",
                    }[value]
                }
            </Fragment>
        );
    }
}

ProjectTabs.propTypes = {
    changed: PropTypes.array,
    project: PropTypes.object,
    updateProject: PropTypes.func,
};

export default ProjectTabs;