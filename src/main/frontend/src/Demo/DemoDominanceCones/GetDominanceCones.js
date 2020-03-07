import React, { Component } from 'react'

class GetDominanceCones extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '66f23be2-0595-40b9-aca1-fcc5f9b5ffc2'
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    getDominanceCones = (event) => {
        event.preventDefault();

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}/cones`, {
            method: 'GET'
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
                <button onClick={this.getDominanceCones}>getDominanceCones</button>
            </div>
        )
    }
}

export default GetDominanceCones