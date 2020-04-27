import React, { Component } from 'react'
import GetClassification from './DemoClassification/GetClassification'
import PutClassification from './DemoClassification/PutClassification'
import PutClassificationNewData from './DemoClassification/PutClassificationNewData'
import PostClassification from './DemoClassification/PostClassification'

class DemoClassification extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>ClassificationController</h2>
                <GetClassification></GetClassification>
                <PutClassification></PutClassification>
                <PutClassificationNewData></PutClassificationNewData>
                <PostClassification></PostClassification>
            </div>
        )
    }
}

export default DemoClassification