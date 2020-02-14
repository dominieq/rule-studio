import React, { Component } from 'react'

class RenameProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70',
            name: 'renamedProject'
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    renameProject = (event) => {
        event.preventDefault()

        let data = new FormData()
        data.append('name', this.state.name)

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}`, {
            method: 'PATCH',
            body: data
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
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                name->
                <input type='text' value={this.state.name} onChange={this.handleNameChange} />
                <button onClick={this.renameProject}>renameProject</button>
            </div>
        )
    }
}

export default RenameProject