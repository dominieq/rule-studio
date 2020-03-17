import React, { Component } from 'react'

class GetImposePreferenceOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '66f23be2-0595-40b9-aca1-fcc5f9b5ffc2',
            binarizeNominalAttributesWith3PlusValues: false
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    handleBinarizeNominalAttributesWith3PlusValuesChange = (event) => {
        this.setState({
            binarizeNominalAttributesWith3PlusValues: event.target.checked
        })
    }

    getImposePreferenceOrder = (event) => {
        event.preventDefault();

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/imposePreferenceOrder?binarizeNominalAttributesWith3PlusValues=${this.state.binarizeNominalAttributesWith3PlusValues}`;

        console.log(link)

        fetch(link, {
            method: 'GET'
        }).then(response => {
            console.log(response)
            if(response.status === 200) {
                response.json().then(result => {
                    console.log("Received information table:")
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
                <input type="checkbox" id="binarizeNominalAttributesWith3PlusValuesGetImposePreferenceOrder" onChange={this.handleHeaderChange} />
                <label for="binarizeNominalAttributesWith3PlusValuesGetImposePreferenceOrder"> binarizeNominalAttributesWith3PlusValues </label>
                <button onClick={this.getImposePreferenceOrder}>getImposePreferenceOrder</button>
            </div>
        )
    }
}

export default GetImposePreferenceOrder