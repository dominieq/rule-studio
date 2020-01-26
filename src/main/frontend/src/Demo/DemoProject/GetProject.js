import React, { Component } from 'react'

class GetProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            msg: '',
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f'
        }
    }

    getProject = (event) => {
        event.preventDefault()
        this.setState({
            error: '',
            msg: ''
        })

        fetch(`http://localhost:8080/project?id=${this.state.id_projektu}`, {
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
                <button onClick={this.getProject}>getProject</button>
            </div>
        )
    }
}

export default GetProject