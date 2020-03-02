import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DisplayData from "./Data/DisplayData";
import Cones from "./Cones/Cones";
import Rules from "./Rules/Rules";
import Unions from "./Unions/Unions";

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
        const project = this.props.project;

        return (
            <Fragment>
                <Tabs
                    aria-label={"project tabs"}
                    centered={true}
                    indicatorColor={"primary"}
                    onChange={this.onTabChange}
                    textColor={"primary"}
                    value={value}
                >
                    <Tab label={"Data"} {...this.setTabProps(0)} />
                    <Tab label={"Dominance cones"} {...this.setTabProps(1)} />
                    <Tab label={"Class unions"} {...this.setTabProps(2)} />
                    <Tab label={"Rules"} {...this.setTabProps(3)} />
                    <Tab label={"Classification"} {...this.setTabProps(4)} />
                    <Tab label={"Cross-validation"} {...this.setTabProps(5)} />
                </Tabs>
                {
                    {
                        0: <DisplayData project={project} />,
                        1: <Cones project={project} />,
                        2: <Unions project={project} />,
                        3: <Rules project={project} />,
                        4: "Classification",
                        5: "Cross-validation",
                    }[value]
                }
            </Fragment>
        );
    }
}

ProjectTabs.propTypes = {
    project: PropTypes.object,
};

export default ProjectTabs;