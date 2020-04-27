import React, { Component } from 'react'

class SetProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70',
            metadata: '',
            data: '',
            rules: '',
            separator: ',',
            header: false
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
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

    setProject = (event) => {
        event.preventDefault();

        let data = new FormData()
        data.append('metadata', this.state.metadata)
        data.append('data', this.state.data)
        data.append('rules', this.state.rules)
        data.append('separator', this.state.separator)
        data.append('header', this.state.header)

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}`, {
            method: 'POST',
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
                <h3>Set project</h3>
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                metadata->
                <input onChange={this.onMetadataChange} type="file"></input>
                data->
                <input onChange={this.onDataChange} type="file"></input>
                rules->
                <input onChange={this.onRulesChange} type="file"></input>
                separator(only csv)->
                <input type='text' value={this.state.separator} onChange={this.handleSeparatorChange} />
                <input type="checkbox" id="headerSetProject" onChange={this.handleHeaderChange} />
                <label for="headerSetProject"> header </label>
                <br />
                <button onClick={this.setProject}>setProject</button>
            </div>
        )
    }
}

export default SetProject