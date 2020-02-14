import React, { Component } from 'react'
import Calculate from './DemoUnionsWithSingleLimitingDecision/Calculate'
import GetUnionsWithSingleLimitingDecision from './DemoUnionsWithSingleLimitingDecision/GetUnionsWithSingleLimitingDecision'

class DemoUnionsWithSingleLimitingDecision extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h3>UnionsController</h3>
                <GetUnionsWithSingleLimitingDecision></GetUnionsWithSingleLimitingDecision>
                <Calculate></Calculate>
            </div>
        )
    }
}

export default DemoUnionsWithSingleLimitingDecision