import React, { Component } from 'react'

class DemoImport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metadata: '',
            data: '',
            error: '',
            msg: ''
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

    uploadFile = (event) => {
        event.preventDefault();
        this.setState({
            error: '',
            msg: ''
        })

        let data = new FormData()
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
            var [attributes, objects] = result

            console.log("Atrybuty:")
            attributes.forEach(element => {
                console.log(element)
            });

            console.log("Obiekty:")
            objects.forEach(element => {
                console.log(element)
            })
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
                <button onClick={this.uploadFile}>Upload</button>
            </div>
        )
    }
}

export default DemoImport