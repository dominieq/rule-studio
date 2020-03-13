import React, { Component } from 'react'
import GetDominanceCones from './DemoDominanceCones/GetDominanceCones'
import PutDominanceCones from './DemoDominanceCones/PutDominanceCones'

class DemoDominanceCones extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h3>DominanceConesController</h3>
                <GetDominanceCones></GetDominanceCones>
                <PutDominanceCones></PutDominanceCones>
            </div>
        )
    }
}

export default DemoDominanceCones