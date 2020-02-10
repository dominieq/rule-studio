import React, { Component } from 'react'
import DemoProject from './DemoProject'
import DemoImport from './DemoImport'
import DemoDominanceCones from './DemoDominanceCones'

class Demo extends Component {

    render() {
        return (
            <div>
                <DemoProject></DemoProject>
                <DemoImport></DemoImport>
                <DemoDominanceCones></DemoDominanceCones>
            </div>
        )
    }
}

export default Demo