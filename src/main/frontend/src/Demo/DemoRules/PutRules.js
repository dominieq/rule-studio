import React, { Component } from 'react'

class PutRules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
            typeOfUnions: 'monotonic',
            consistencyThreshold: 0,
            typeOfRules: 'certain'
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

    handleTypeOfRulesChange = (event) => {
        this.setState({
            typeOfRules: event.target.value
        })
    }

    putRules = (event) => {
        event.preventDefault()

        let formData = new FormData()
        formData.append('typeOfUnions', this.state.typeOfUnions)
        formData.append('consistencyThreshold', this.state.consistencyThreshold)
        formData.append('typeOfRules', this.state.typeOfRules)

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/rules`;

        console.log(link)

        fetch(link, {
            method: 'PUT',
            body: formData
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
                <label for="typeOfRulesPutRules">typeOfRules-></label>
                <select id="typeOfRulesPutRules" onChange={this.handleTypeOfRulesChange}>
                    <option value="certain">certain</option>
                    <option value="possible">possible</option>
                    <option value="both">both</option>
                </select>
                <button onClick={this.putRules}>putRules</button>
            </div>
        )
    }
}

export default PutRules