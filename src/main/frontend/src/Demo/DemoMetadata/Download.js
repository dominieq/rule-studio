import React, { Component } from 'react'

class Download extends Component {
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

    download = (event) => {
        event.preventDefault()
        let filename = "filename";

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}/metadata/download`, {
            method: 'GET'
        }).then(response => {
            console.log(response)
            filename =  response.headers.get('Content-Disposition').split('filename=')[1];
            return response.blob()
        }).then(result => {
            console.log("Wynik dzialania response.blob():")
            console.log(result)
            let url = window.URL.createObjectURL(result);
            let link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                <button onClick={this.download}>download</button>
            </div>
        )
    }
}

export default Download