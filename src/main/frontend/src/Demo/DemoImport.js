import React, { Component } from 'react'

class DemoImport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metadata: '',
            data: '',
            error: '',
            msg: '',
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70'
        }
    }

    onMetadataChange = (event) => {
        this.setState({
            metadata: event.target.files[0]
        })
    }

    onDataChange = (event) => {
        this.setState({
            data: event.target.files[0]
        })
    }

    createProject = (event) => {
        event.preventDefault();
        this.setState({
            error: '',
            msg: ''
        })

        let data = new FormData()
        data.append('name', "Tymczasowa nazwa projektu")
        data.append('metadata', this.state.metadata)
        data.append('data', this.state.data)

        fetch('http://localhost:8080/import', {
            method: 'POST',
            body: data,
        }).then(response => {
            console.log(response)
            this.setState({
                error: '',
                msg: 'Sucessfully uploaded file'
            })
            return response.json()
        }).then(result => {
            console.log("Wynik dzialania response.json():")
            console.log(result)

            console.log("Atrybuty:")
            result.attributes.forEach(element => {
                console.log(element)
            });

            console.log("Obiekty:")
            result.objects.forEach(element => {
                console.log(element)
            })
        }).catch(err => {
            console.log(err)
            this.setState({
                error: err
            })
        })
    }

    getData = (event) => {
        event.preventDefault()
        this.setState({
            error: '',
            msg: ''
        })

        let data = new FormData()
        data.append('id', this.state.id_projektu)

        fetch(`http://localhost:8080/import?id=${this.state.id_projektu}`, {
            method: 'GET'
        }).then(response => {
            console.log(response)
            this.setState({
                error: '',
                msg: 'Sucessfully send get'
            })
            return response.json()
        }).then(result => {
            console.log("Wynik dzialania response.json():")
            console.log(result)
        }).catch(err => {
            console.log(err)
            this.setState({
                error: err
            })
        })
    }

    render() {
        return (
            <div>
                <h3>Upload a file</h3>
                <h4 style={{color: 'red'}}>{this.state.error}</h4>
                <h4 style={{color: 'green'}}>{this.state.msg}</h4>
                <p>metadata</p>
                <input onChange={this.onMetadataChange} type="file"></input>
                <p>data</p>
                <input onChange={this.onDataChange} type="file"></input>
                <br />
                <button onClick={this.createProject}>Upload</button>
                <button onClick={this.getData}>import GET</button>
            </div>
        )
    }
}

export default DemoImport