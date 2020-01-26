import React, { Component } from 'react'

class DeleteProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            msg: '',
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70'
        }
    }

    deleteProject = (event) => {
        event.preventDefault()
        this.setState({
            error: '',
            msg: ''
        })

        let data = new FormData()
        data.append('id', this.state.id_projektu)

        fetch('http://localhost:8080/project', {
            method: 'DELETE',
            body: data
        }).then(response => {
            console.log(response)
            this.setState({
                error: '',
                msg: 'Sucessfully send delete'
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
                <button onClick={this.deleteProject}>deleteProject</button>
            </div>
        )
    }
}

export default DeleteProject