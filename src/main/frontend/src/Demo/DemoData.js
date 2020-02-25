import React, { Component } from 'react'
import GetData from './DemoData/GetData'
import PutData from './DemoData/PutData'

class DemoData extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>DataController</h2>
                <GetData></GetData>
                <PutData></PutData>
            </div>
        )
    }
}

export default DemoData