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
import OutdatedDataAlert from "./Utils/Alerts/OutdatedDataAlert";
import OutdatedRulesAlert from "./Utils/Alerts/OutdatedRulesAlert";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const StyledTabs = withStyles(theme => ({
    indicator: {
        backgroundColor: theme.palette.tab.background,
    },
}), {name: "MuiTabs"})(props => <Tabs {...props} />);

const StyledTab = withStyles(theme => ({
    root: {
        color: theme.palette.tab.textIdle,
        '&:hover': {
            backgroundColor: theme.palette.tab.backgroundAction,
            color: theme.palette.tab.textAction,
        },
        '&:focus': {
            backgroundColor: theme.palette.tab.backgroundAction,
            color: theme.palette.tab.textAction,
        }
    },
    textColorInherit: {
        '&.Mui-selected': {
            backgroundColor: theme.palette.tab.background,
            color: theme.palette.tab.text,
            opacity: 1,
        },
    },
    wrapper: {
        flexDirection: "row",
        '&>.MuiSvgIcon-root': {
            marginRight: 8,
        }
    }

}), {name: "MuiTab"})(props => <Tab {...props} disableRipple={true} /> );

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
        const { project: { externalRules, tabsUpToDate } } = this.props;
        const externalRulesAlert = externalRules && [2, 3].includes(index);

        if (tabsUpToDate[index] === null || tabsUpToDate[index]) {
            return (
                <Fragment>
                    {externalRulesAlert && <ExternalRulesAlert />}
                    {name}
                </Fragment>
            );
        } else if (externalRules && [2, 3].includes(index)) {
            return (
                <OutdatedRulesAlert>
                    {externalRulesAlert && <ExternalRulesAlert />}
                    {name}
                </OutdatedRulesAlert>
            );
        } else {
            return (
                <OutdatedDataAlert>
                    {externalRulesAlert && <ExternalRulesAlert />}
                    {name}
                </OutdatedDataAlert>
            )
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