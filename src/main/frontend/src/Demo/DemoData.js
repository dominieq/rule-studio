import React, { Component } from 'react'
import GetData from './DemoData/GetData'
import PutData from './DemoData/PutData'
import GetDataDownload from './DemoData/GetDataDownload'
import PutDataDownload from './DemoData/PutDataDownload'
import PostData from './DemoData/PostData'

class DemoData extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>DataController</h2>
                <GetData></GetData>
                <PutData></PutData>
                <PostData></PostData>
                <GetDataDownload></GetDataDownload>
                <PutDataDownload></PutDataDownload>
            </div>
        )
    }
}

export default DemoData