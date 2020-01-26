import React, { Component } from 'react'
import DemoProject from './DemoProject'
import DemoImport from './DemoImport'

class Demo extends Component {

    render() {
        return (
            <div>
                <DemoProject></DemoProject>
                <DemoImport></DemoImport>
            </div>
        )
    }
}

export default Demo