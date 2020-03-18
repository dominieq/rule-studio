import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles";
import Classification from "./Classification/Classification";
import CrossValidation from "./CrossValidation/CrossValidation";
import Cones from "./Cones/Cones";
import Data from "./Data/DisplayData";
import Rules from "./Rules/Rules";
import Unions from "./Unions/Unions";
import ExternalRulesAlert from "./Utils/Alerts/ExternalRulesAlert";
import UpdateAlert from "./Utils/Alerts/UpdateAlert";
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
            project: this.props.project,
            onTabChange: this.props.onTabChange,
            value: index,
        })
    };

    renderTabLabel = (name, index) => {
        const project = this.props.project;
        let addExternalRulesAlert = project.externalRules && index > 1;

        if (project && project.tabsUpToDate[index]) {
            return (
                <Fragment>
                    {addExternalRulesAlert ? <ExternalRulesAlert /> : null}
                    {name}
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    {addExternalRulesAlert ? <ExternalRulesAlert /> : null}
                    <UpdateAlert>
                        {name}
                    </UpdateAlert>
                </Fragment>
            );
        }
    };

    render() {
        const selected = this.state.selected;

        return (
            <Fragment>
                <StyledTabs aria-label={"project tabs"} centered={true} onChange={this.onTabChange} value={selected}>
                    <StyledTab label={"Data"} {...this.getTabProps(0)} />
                    <StyledTab
                        label={this.renderTabLabel("Dominance cones", 0)}
                        {...this.getTabProps(1)}
                    />
                    <StyledTab
                        label={this.renderTabLabel("Class unions" , 1)}
                        {...this.getTabProps(2)}
                    />
                    <StyledTab
                        label={this.renderTabLabel("Rules", 2)}
                        {...this.getTabProps(3)}
                    />
                    <StyledTab
                        label={this.renderTabLabel("Classification", 3)}
                        {...this.getTabProps(4)}
                    />
                    <StyledTab
                        label={this.renderTabLabel("Cross-validation", 4)}
                        {...this.getTabProps(5)}
                    />
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
    onDataChange: PropTypes.func,
    onTabChange: PropTypes.func,
    project: PropTypes.object,
};

export default ProjectTabs;