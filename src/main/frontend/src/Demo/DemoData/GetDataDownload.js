import React, { Component } from 'react'

class GetDataDownload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
            format: 'json',
            separator: ',',
            header: false
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    handleFormatChange = (event) => {
        this.setState({
            format: event.target.value
        })
    }

    handleSeparatorChange = (event) => {
        this.setState({
            separator: event.target.value
        })
    }

    handleHeaderChange = (event) => {
        this.setState({
            header: event.target.checked
        })
    }

    getDataDownload = (event) => {
        event.preventDefault()
        let filename = "filename";

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/data/download`;
        if(this.state.format !== "") {
            link += `?format=${this.state.format}`;
        }
        if(this.state.separator !== "") {
            link += `&separator=${this.state.separator}`;
        }
        link += `&header=${this.state.header}`;

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
                format->
                <input type='text' value={this.state.format} onChange={this.handleFormatChange} />
                separator(only csv)->
                <input type='text' value={this.state.separator} onChange={this.handleSeparatorChange} />
                <input type="checkbox" id="headerGetDataDownload" onChange={this.handleHeaderChange} />
                <label for="headerGetDataDownload"> header </label>
                <button onClick={this.getDataDownload}>getDataDownload</button>
            </div>
        )
    }
}

export default GetDataDownload