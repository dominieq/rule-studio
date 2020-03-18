import React, { Component } from 'react'

class PutCrossValidation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '66f23be2-0595-40b9-aca1-fcc5f9b5ffc2',
            numberOfFolds: 10
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    handleNumberOfFolds = (event) => {
        this.setState({
            numberOfFolds: event.target.value
        })
    }

    putCrossValidation = (event) => {
        event.preventDefault();

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/crossValidation?numberOfFolds=${this.state.numberOfFolds}`;

        console.log(link)

        fetch(link, {
            method: 'PUT'
        }).then(response => {
            console.log(response)
            if(response.status === 200) {
                response.json().then(result => {
                    console.log("Received cross-validation:")
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
                numberOfFolds->
                <input type='text' value={this.state.numberOfFolds} onChange={this.handleNumberOfFolds} />
                <button onClick={this.putCrossValidation}>putCrossValidation</button>
            </div>
        )
    }
}

export default PutCrossValidation