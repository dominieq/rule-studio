import React, { Component } from 'react'
import PutCrossValidation from './DemoCrossValidation/PutCrossValidation'
import GetCrossValidation from './DemoCrossValidation/GetCrossValidation'

class DemoCrossValidation extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>CrossValidationController</h2>
                <GetCrossValidation></GetCrossValidation>
                <PutCrossValidation></PutCrossValidation>
            </div>
        )
    }
}

export default DemoCrossValidation