import React, { Component } from 'react'
import DemoProject from './DemoProject'
import DemoProjects from './DemoPorjects'
import DemoDominanceCones from './DemoDominanceCones'
import DemoUnionsWithSingleLimitingDecision from './DemoUnionsWithSingleLimitingDecision'
import DemoData from './DemoData'
import DemoMetadata from './DemoMetadata'
import DemoImposePreferenceOrder from './DemoImposePreferenceOrder'
import DemoRules from './DemoRules'
import DemoClassification from './DemoClassification'
import DemoCrossValidation from './DemoCrossValidation'
import DemoMisclassificationMatrix from './DemoMisclassificationMatrix'

class Demo extends Component {

    render() {
        return (
            <div>
                <DemoProjects></DemoProjects>
                <DemoProject></DemoProject>
                <DemoData></DemoData>
                <DemoMetadata></DemoMetadata>
                <DemoImposePreferenceOrder></DemoImposePreferenceOrder>
                <DemoDominanceCones></DemoDominanceCones>
                <DemoUnionsWithSingleLimitingDecision></DemoUnionsWithSingleLimitingDecision>
                <DemoRules></DemoRules>
                <DemoClassification></DemoClassification>
                <DemoCrossValidation></DemoCrossValidation>
                <DemoMisclassificationMatrix></DemoMisclassificationMatrix>
            </div>
        )
    }
}

export default Demo