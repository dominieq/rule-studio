import React, { Component } from 'react'

class GetMisclassificationMatrix extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70',
            typeOfMatrix: 'classification',
            numberOfFold: 0
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    handleTypeOfMatrixChange = (event) => {
        this.setState({
            typeOfMatrix: event.target.value
        })
    }

    handleNumberOfFoldChange = (event) => {
        this.setState({
            numberOfFold: event.target.value
        })
    }

    getMisclassificationMatrix = (event) => {
        event.preventDefault()

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/misclassificationMatrix`;
        if(this.state.typeOfMatrix !== "") {
            link += `?typeOfMatrix=${this.state.typeOfMatrix}`;
        }
        if(this.state.numberOfFold !== "") {
            link += `&numberOfFold=${this.state.numberOfFold}`;
        }

        console.log(link)

        fetch(link, {
            method: 'GET'
        }).then(response => {
            console.log(response)
            if(response.status === 200) {
                response.json().then(result => {
                    console.log("Received misclassification matrix:")
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
                <label for="typeOfMatrixGetMisclassificationMatrix">typeOfMatrix-></label>
                <select id="typeOfMatrixGetMisclassificationMatrix" onChange={this.handleTypeOfMatrixChange}>
                    <option value="classification">classification</option>
                    <option value="crossValidationSum">crossValidationSum</option>
                    <option value="crossValidationMean">crossValidationMean</option>
                    <option value="crossValidationFold">crossValidationFold</option>
                </select>
                numberOfFold->
                <input type='text' value={this.state.numberOfFold} onChange={this.handleNumberOfFoldChange} />
                <button onClick={this.getMisclassificationMatrix}>getMisclassificationMatrix</button>
            </div>
        )
    }
}

export default GetMisclassificationMatrix