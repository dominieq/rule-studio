import React, { Component } from 'react'

class GetRules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
            orderBy: 'none',
            desc: true
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    handleOrderByChange = (event) => {
        this.setState({
            orderBy: event.target.value
        })
    }

    handleDescChange = (event) => {
        this.setState({
            desc: event.target.checked
        })
    }

    getRules = (event) => {
        event.preventDefault()

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/rules`;
        link += `?orderBy=${this.state.orderBy}`;
        link += `&desc=${this.state.desc}`;

        console.log(link)

        fetch(link, {
            method: 'GET'
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
                <label for="orderByGetRules">orderBy-></label>
                <select id="orderByGetRules" onChange={this.handleOrderByChange}>
                    <option value="none">none</option>
                    <option value="support">support</option>
                    <option value="strength">strength</option>
                    <option value="confidence">confidence</option>
                    <option value="coverageFactor">coverageFactor</option>
                    <option value="coverage">coverage</option>
                    <option value="negativeCoverage">negativeCoverage</option>
                    <option value="epsilon">epsilon</option>
                    <option value="epsilonPrime">epsilonPrime</option>
                    <option value="fConfirmation">fConfirmation</option>
                    <option value="AConfirmation">AConfirmation</option>
                    <option value="ZConfirmation">ZConfirmation</option>
                    <option value="lConfirmation">lConfirmation</option>
                    <option value="c1Confirmation">c1Confirmation</option>
                    <option value="sConfirmation">sConfirmation</option>
                </select>
                <input type="checkbox" id="descGetRules" onChange={this.handleDescChange} />
                <label for="descGetRules"> desc </label>
                <button onClick={this.getRules}>getRules</button>
            </div>
        )
    }
}

export default GetRules