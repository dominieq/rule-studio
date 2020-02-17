import React, { Component } from 'react'
import GetMetadata from './DemoMetadata/GetMetadata'

class DemoMetadata extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>MetadataController</h2>
                <GetMetadata></GetMetadata>
            </div>
        )
    }
}

export default DemoMetadata