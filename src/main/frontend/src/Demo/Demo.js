import React, { Component } from 'react'
import DemoProject from './DemoProject'
import DemoImport from './DemoImport'
import DemoProjects from './DemoPorjects'

class Demo extends Component {

    render() {
        return (
            <div>
                <DemoProjects></DemoProjects>
                <DemoProject></DemoProject>
                <DemoImport></DemoImport>
            </div>
        )
    }
}

export default Demo