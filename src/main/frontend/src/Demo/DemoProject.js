import React, { Component } from 'react'
import GetProject from './DemoProject/GetProject'
import GetProjectWithImposePreferenceOrder from './DemoProject/GetProjectWithImposePreferenceOrder'
import RenameProject from './DemoProject/RenameProject'
import DeleteProject from './DemoProject/DeleteProject'
import SetProject from './DemoProject/SetProject'

class DemoProject extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>DemoProject</h2>
                <GetProject></GetProject>
                <GetProjectWithImposePreferenceOrder></GetProjectWithImposePreferenceOrder>
                <SetProject></SetProject>
                <RenameProject></RenameProject>
                <DeleteProject></DeleteProject>
            </div>
        )
    }
}

export default DemoProject