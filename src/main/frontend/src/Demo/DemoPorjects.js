import React, { Component } from 'react'
import GetProjects from './DemoProjects/GetProjects'
import CreateProject from './DemoProjects/CreateProject'

class DemoProjects extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>DemoProjects</h2>
                <GetProjects></GetProjects>
                <CreateProject></CreateProject>
            </div>
        )
    }
}

export default DemoProjects