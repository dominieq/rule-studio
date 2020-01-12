import React, { Component } from 'react'

class DemoImport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file1: '',
            file2: '',
            error: 'abcd',
            msg: ''
        }
    }

    onFile1Change = (event) => {
        this.setState({
            file1: event.target.files[0]
        })
    }

    onFile2Change = (event) => {
        this.setState({
            file2: event.target.files[0]
        })
    }

    uploadFile = (event) => {
        event.preventDefault();
        this.setState({
            error: '',
            msg: ''
        })

        let data = new FormData()
        data.append('file', this.state.file1)
        data.append('name', this.state.file1.name)

        fetch('http://localhost:8080/import?content=metadata', {
            method: 'POST',
            body: data,
        }).then(response => {
            console.log(response)
            response.text().then(result => {
                console.log(result)
            })
            this.setState({
                error: '',
                msg: 'Sucessfully uploaded file'
            })

            data = new FormData()
            data.append('file', this.state.file2)
            data.append('name', this.state.file2.name)

            fetch('http://localhost:8080/import?content=data&format=csv', {
                method: 'POST',
                body: data,
            }).then(response => {
                console.log(response)
                response.text().then(result => {
                    console.log(result)
                })
                this.setState({
                    error: '',
                    msg: 'Sucessfully uploaded file'
                })
            }).catch(err => {
                console.log(err)
                this.setState({
                    error: err
                })
            })

        }).catch(err => {
            console.log(err)
            this.setState({
                error: err
            })
        })
    }

    clickHandler = () => {
        console.log('Button clicked')
        fetch('http://localhost:8080/import', {
            method: 'GET'
        }).then(response => {
            console.log(response)
            console.log(response.text().then( odp => console.log(odp)))
        }).catch(error =>{
            console.log(error)
        })
    }


    render() {
        return (
            <div>
                <h3>Upload a file</h3>
                <h4 style={{color: 'red'}}>{this.state.error}</h4>
                <h4 style={{color: 'green'}}>{this.state.msg}</h4>
                <p>metadata</p>
                <input onChange={this.onFile1Change} type="file"></input>
                <p>data</p>
                <input onChange={this.onFile2Change} type="file"></input>
                <button onClick={this.uploadFile}>Upload files</button>
                <br />
                <button onClick={this.clickHandler}>Create information table</button>
            </div>
        )
    }
}

export default DemoImport