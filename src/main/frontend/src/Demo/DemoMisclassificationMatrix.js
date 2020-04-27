import React, { Component } from 'react'
import GetMisclassificationMatrix from './DemoMisclassificationMatrix/GetMisclassificationMatrix'
import GetMisclassificationMatrixDownload from './DemoMisclassificationMatrix/GetMisclassificationMatrixDownload'

class DemoMisclassificationMatrix extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>MisclassificationController</h2>
                <GetMisclassificationMatrix></GetMisclassificationMatrix>
                <GetMisclassificationMatrixDownload></GetMisclassificationMatrixDownload>
            </div>
        )
    }
}

export default DemoMisclassificationMatrix