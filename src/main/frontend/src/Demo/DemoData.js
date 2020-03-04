import React, { Component } from 'react'
import GetData from './DemoData/GetData'
import PutData from './DemoData/PutData'
import Download from './DemoData/Download'

class DemoData extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>DataController</h2>
                <GetData></GetData>
                <PutData></PutData>
                <Download></Download>
            </div>
        )
    }
}

export default DemoData