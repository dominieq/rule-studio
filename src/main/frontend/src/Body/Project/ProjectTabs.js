import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles";
import Classification from "./Classification/Classification";
import CrossValidation from "./CrossValidation/CrossValidation";
import Cones from "./Cones/Cones";
import Data from "./Data/DisplayData";
import Rules from "./Rules/Rules";
import Unions from "./Unions/Unions";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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
            selected: 0,
        }
    }

    onTabChange = (event, newValue) => {
        this.setState({
            selected: newValue,
        });
    };

    getTabProps = (index) => {
        return ({
            id: `project-tab-${index}`,
            'aria-controls': `project-tabpanel-${index}`,
        })
    };

    getTabBodyProps = (index) => {
        return ({
            dataUpToDate: this.props.dataUpToDate,
            project: this.props.project,
            onTabChange: this.props.onTabChange,
            upToDate: this.props.tabsUpToDate[index],
            value: index,
        })
    };

    render() {
        const selected = this.state.selected;

        return (
            <Fragment>
                <StyledTabs aria-label={"project tabs"} centered={true} onChange={this.onTabChange} value={selected}>
                    <StyledTab label={"Data"} {...this.getTabProps(0)} />
                    <StyledTab label={"Dominance cones"} {...this.getTabProps(1)} />
                    <StyledTab label={"Class unions"} {...this.getTabProps(2)} />
                    <StyledTab label={"Rules"} {...this.getTabProps(3)} />
                    <StyledTab label={"Classification"} {...this.getTabProps(4)} />
                    <StyledTab label={"Cross-validation"} {...this.getTabProps(5)} />
                </StyledTabs>
                {
                    {
                        0: <Data project={this.props.project} updateProject={this.props.onDataChange} />,
                        1: <Cones {...this.getTabBodyProps(0)} />,
                        2: <Unions {...this.getTabBodyProps(1)} />,
                        3: <Rules {...this.getTabBodyProps(2)} />,
                        4: <Classification {...this.getTabBodyProps(3)} />,
                        5: <CrossValidation {...this.getTabBodyProps(4)} />,
                    }[selected]
                }
            </Fragment>
        );
    }
}

ProjectTabs.propTypes = {
    dataUpToDate: PropTypes.bool,
    project: PropTypes.object,
    onDataChange: PropTypes.func,
    onTabChange: PropTypes.func,
    tabsUpToDate: PropTypes.arrayOf(PropTypes.bool),
};

export default ProjectTabs;