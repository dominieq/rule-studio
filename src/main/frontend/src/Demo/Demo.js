import React, { Component } from 'react'
import DemoProject from './DemoProject'
import DemoProjects from './DemoPorjects'
import DemoDominanceCones from './DemoDominanceCones'
import DemoUnionsWithSingleLimitingDecision from './DemoUnionsWithSingleLimitingDecision'

class Demo extends Component {

    render() {
        return (
            <div>
                <DemoProjects></DemoProjects>
                <DemoProject></DemoProject>
                <DemoDominanceCones></DemoDominanceCones>
                <DemoUnionsWithSingleLimitingDecision></DemoUnionsWithSingleLimitingDecision>
            </div>
        )
    }
}

export default Demo