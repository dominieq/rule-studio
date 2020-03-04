import React, { Component } from 'react'
import GetMetadata from './DemoMetadata/GetMetadata'
import PutMetadata from './DemoMetadata/PutMetadata'
import Download from './DemoMetadata/Download'

class DemoMetadata extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>MetadataController</h2>
                <GetMetadata></GetMetadata>
                <PutMetadata></PutMetadata>
                <Download></Download>
            </div>
        )
    }
}

export default DemoMetadata