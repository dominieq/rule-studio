import React, { Component } from 'react'
import DemoProject from './DemoProject'
import DemoImport from './DemoImport'
import DemoDominanceCones from './DemoDominanceCones'
import DemoUnions from './DemoUnions'

class Demo extends Component {

    render() {
        return (
            <div>
                <DemoProject></DemoProject>
                <DemoImport></DemoImport>
                <DemoDominanceCones></DemoDominanceCones>
                <DemoUnions></DemoUnions>
            </div>
        )
    }
}

export default Demo