import React, { Component } from 'react'
import GetImposePreferenceOrder from './DemoImposePreferenceOrder/GetImposePreferenceOrder'
import PostImposePreferenceOrder from './DemoImposePreferenceOrder/PostImposePreferenceOrder'

class DemoImposePreferenceOrder extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h2>ImposePreferenceOrderController</h2>
                <GetImposePreferenceOrder></GetImposePreferenceOrder>
                <PostImposePreferenceOrder></PostImposePreferenceOrder>
            </div>
        )
    }
}

export default DemoImposePreferenceOrder