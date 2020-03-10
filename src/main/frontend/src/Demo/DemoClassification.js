import React, { Component } from 'react'
import GetClassification from './DemoClassification/GetClassification'
import PutClassification from './DemoClassification/PutClassification'

class DemoClassification extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>ClassificationController</h2>
                <GetClassification></GetClassification>
                <PutClassification></PutClassification>
            </div>
        )
    }
}

export default DemoClassification