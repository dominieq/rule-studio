import React, { Component } from 'react'
import GetClassification from './DemoClassification/GetClassification'
import PutClassification from './DemoClassification/PutClassification'
import PutClassificationNewData from './DemoClassification/PutClassificationNewData'

class DemoClassification extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>ClassificationController</h2>
                <GetClassification></GetClassification>
                <PutClassification></PutClassification>
                <PutClassificationNewData></PutClassificationNewData>
            </div>
        )
    }
}

export default DemoClassification