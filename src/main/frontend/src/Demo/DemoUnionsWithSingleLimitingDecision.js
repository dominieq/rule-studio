import React, { Component } from 'react'
import GetUnionsWithSingleLimitingDecision from './DemoUnionsWithSingleLimitingDecision/GetUnionsWithSingleLimitingDecision'
import PutUnionsWithSingleLimitingDecision from './DemoUnionsWithSingleLimitingDecision/PutUnionsWithSingleLimitingDecision'
import PostUnionsWithSingleLimitingDecision from './DemoUnionsWithSingleLimitingDecision/PostUnionsWithSingleLimitingDecision'

class DemoUnionsWithSingleLimitingDecision extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>UnionsController</h2>
                <GetUnionsWithSingleLimitingDecision></GetUnionsWithSingleLimitingDecision>
                <PutUnionsWithSingleLimitingDecision></PutUnionsWithSingleLimitingDecision>
                <PostUnionsWithSingleLimitingDecision></PostUnionsWithSingleLimitingDecision>
            </div>
        )
    }
}

export default DemoUnionsWithSingleLimitingDecision