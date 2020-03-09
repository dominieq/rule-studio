import React, { Component } from 'react'
import GetMetadata from './DemoMetadata/GetMetadata'
import PutMetadata from './DemoMetadata/PutMetadata'
import GetMetadataDownload from './DemoMetadata/GetMetadataDownload'
import PutMetadataDownload from './DemoMetadata/PutMetadataDownload'

class DemoMetadata extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>MetadataController</h2>
                <GetMetadata></GetMetadata>
                <PutMetadata></PutMetadata>
                <GetMetadataDownload></GetMetadataDownload>
                <PutMetadataDownload></PutMetadataDownload>
            </div>
        )
    }
}

export default DemoMetadata