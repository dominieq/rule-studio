import React, { Component } from 'react'

class PutRules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
            typeOfUnions: 'monotonic',
            consistencyThreshold: 0
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    handleTypeOfUnionsChange = (event) => {
        this.setState({
            typeOfUnions: event.target.value
        })
    }

    handleConsistencyThresholdChange = (event) => {
        this.setState({
            consistencyThreshold: event.target.value
        })
    }

    putRules = (event) => {
        event.preventDefault()

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}/rules?typeOfUnions=${this.state.typeOfUnions}&consistencyThreshold=${this.state.consistencyThreshold}`, {
            method: 'PUT'
        }).then(response => {
            console.log(response)
            if(response.status === 200) {
                response.json().then(result => {
                    console.log("Received rules:")
                    console.log(result)
                }).catch(err => {
                    console.log(err)
                })
            } else if(response.status === 404) {
                response.json().then(result => {
                    console.log("Error 404.")
                    console.log(result.message)
                }).catch(err => {
                    console.log(err)
                })
            } else if(response.status === 422) {
                response.json().then(result => {
                    console.log("Error 422.")
                    console.log(result.message)
                }).catch(err => {
                    console.log(err)
                })
            } else {
                response.json().then(result => {
                    console.log("Result of response.json():")
                    console.log(result)
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                <label for="typeOfUnionsPutRules">typeOfUnions-></label>
                <select id="typeOfUnionsPutRules" onChange={this.handleTypeOfUnionsChange}>
                    <option value="monotonic">monotonic</option>
                    <option value="standard">standard</option>
                </select>
                consistencyThreshold->
                <input type='text' value={this.state.consistencyThreshold} onChange={this.handleConsistencyThresholdChange} />
                <button onClick={this.putRules}>putRules</button>
            </div>
        )
    }
}

export default PutRules