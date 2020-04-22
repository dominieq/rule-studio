import React, { Component } from 'react'

class GetMisclassificationMatrixDownload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
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

    getMisclassificationMatrixDownload = (event) => {
        event.preventDefault()
        let filename = "filename";

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/misclassificationMatrix/download`;
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
                filename =  response.headers.get('Content-Disposition').split('filename=')[1];
                response.blob().then(result => {
                    console.log("Result of response.blob():")
                    console.log(result)
                    let url = window.URL.createObjectURL(result);
                    let link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    link.click();
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
                <label for="typeOfMatrixGetMisclassificationMatrixDownload">typeOfMatrix-></label>
                <select id="typeOfMatrixGetMisclassificationMatrixDownload" onChange={this.handleTypeOfMatrixChange}>
                    <option value="classification">classification</option>
                    <option value="crossValidationSum">crossValidationSum</option>
                    <option value="crossValidationMean">crossValidationMean</option>
                    <option value="crossValidationFold">crossValidationFold</option>
                </select>
                numberOfFold->
                <input type='text' value={this.state.numberOfFold} onChange={this.handleNumberOfFoldChange} />
                <button onClick={this.getMisclassificationMatrixDownload}>getMisclassificationMatrixDownload</button>
            </div>
        )
    }
}

export default GetMisclassificationMatrixDownload