import React, { Component } from 'react'
import GetData from './DemoData/GetData'

class DemoData extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>DataController</h2>
                <GetData></GetData>
            </div>
        )
    }
}

export default DemoData