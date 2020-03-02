import React, { Component } from 'react'

class GetProjectWithImposePreferenceOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f'
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    getProjectWithImposePreferenceOrder = (event) => {
        event.preventDefault()

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}?imposePreferenceOrder=true`, {
            method: 'GET'
        }).then(response => {
            console.log(response)
            return response.json()
        }).then(result => {
            console.log("Wynik dzialania response.json():")
            console.log(result)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                <button onClick={this.getProjectWithImposePreferenceOrder}>getProjectWithImposePreferenceOrder</button>
            </div>
        )
    }
}

export default GetProjectWithImposePreferenceOrder