import React, { Component } from 'react'
import Calculate from './DemoDominanceCones/Calculate'
import GetDominanceCones from './DemoDominanceCones/GetDominanceCones'

class DemoDominanceCones extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h3>DominanceConesController</h3>
                <GetDominanceCones></GetDominanceCones>
                <Calculate></Calculate>
            </div>
        )
    }
}

export default DemoDominanceCones