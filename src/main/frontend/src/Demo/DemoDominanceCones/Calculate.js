import React, { Component } from 'react'

class Calculate extends Component {
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

    calculate = (event) => {
        event.preventDefault();

        fetch(`http://localhost:8080/cones?id=${this.state.id_projektu}`, {
            method: 'PUT'
        }).then(response => {
            console.log(response)
            return response.json()
        }).then(result => {
            console.log("Wynik dzialania response.json():")
            console.log(result)

            console.log("Obiekty:")
            result.forEach(element => {
                console.log(element)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                <button onClick={this.calculate}>calculate</button>
            </div>
        )
    }
}

export default Calculate