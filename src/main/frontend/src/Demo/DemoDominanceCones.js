import React, { Component } from 'react'
import GetDominanceCones from './DemoDominanceCones/GetDominanceCones'
import PutDominanceCones from './DemoDominanceCones/PutDominanceCones'
import PostDominanceCones from './DemoDominanceCones/PostDominanceCones'

class DemoDominanceCones extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h3>DominanceConesController</h3>
                <GetDominanceCones></GetDominanceCones>
                <PutDominanceCones></PutDominanceCones>
                <PostDominanceCones></PostDominanceCones>
            </div>
        )
    }
}

export default DemoDominanceCones