import React, { Component } from 'react'
import DemoProject from './DemoProject'
import DemoImport from './DemoImport'
import DemoProjects from './DemoPorjects'
import DemoDominanceCones from './DemoDominanceCones'

class Demo extends Component {

    render() {
        return (
            <div>
                <DemoProjects></DemoProjects>
                <DemoProject></DemoProject>
                <DemoImport></DemoImport>
                <DemoDominanceCones></DemoDominanceCones>
            </div>
        )
    }
}

export default Demo