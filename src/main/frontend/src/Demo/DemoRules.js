import React, { Component } from 'react'
import PutRules from './DemoRules/PutRules'
import GetRules from './DemoRules/GetRules'
import PostRules from './DemoRules/PostRules'
import Download from './DemoRules/Download'
import ArePossibleRulesAllowed from './DemoRules/ArePossibleRulesAllowed'

class DemoRules extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>RulesController</h2>
                <GetRules></GetRules>
                <PutRules></PutRules>
                <PostRules></PostRules>
                <Download></Download>
                <ArePossibleRulesAllowed></ArePossibleRulesAllowed>
            </div>
        )
    }
}

export default DemoRules