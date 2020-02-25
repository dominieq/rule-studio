import React, { Component } from 'react'
import GetMetadata from './DemoMetadata/GetMetadata'
import PutMetadata from './DemoMetadata/PutMetadata'

class DemoMetadata extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>MetadataController</h2>
                <GetMetadata></GetMetadata>
                <PutMetadata></PutMetadata>
            </div>
        )
    }
}

export default DemoMetadata