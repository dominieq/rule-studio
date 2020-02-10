import React, { Component } from 'react'
import GetProject from './DemoProject/GetProject'
import CreateProject from './DemoProject/CreateProject'
import GetProjects from './DemoProject/GetProjects'
import RenameProject from './DemoProject/RenameProject'
import DeleteProject from './DemoProject/DeleteProject'

class DemoProject extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h3>ProjectController</h3>
                <GetProject></GetProject>
                <GetProjects></GetProjects>
                <CreateProject></CreateProject>
                <RenameProject></RenameProject>
                <DeleteProject></DeleteProject>
            </div>
        )
    }
}

export default DemoProject