import React, { Component } from 'react'

class CreateProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: 'newProject',
            metadata: '',
            data: '',
            rules: ''
        }
    }

    handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        })
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

    onRulesChange = (event) => {
        this.setState({
            rules: event.target.files[0]
        })
    }

    createProject = (event) => {
        event.preventDefault();

        let data = new FormData()
        data.append('name', this.state.name)
        data.append('metadata', this.state.metadata)
        data.append('data', this.state.data)
        data.append('rules', this.state.rules)

        fetch('http://localhost:8080/projects', {
            method: 'POST',
            body: data,
        }).then(response => {
            console.log(response)
            return response.json()
        }).then(result => {
            console.log("Wynik dzialania response.json():")
            console.log(result)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                <h3>Create project</h3>
                name->
                <input type='text' value={this.state.name} onChange={this.handleNameChange} />
                <p>metadata</p>
                <input onChange={this.onMetadataChange} type="file"></input>
                <p>data</p>
                <input onChange={this.onDataChange} type="file"></input>
                <p>rules</p>
                <input onChange={this.onRulesChange} type="file"></input>
                <br />
                <button onClick={this.createProject}>createProject</button>
            </div>
        )
    }
}

export default CreateProject