import React, { Component } from 'react'

class RenameProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            msg: '',
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70'
        }
    }

    renameProject = (event) => {
        event.preventDefault()
        this.setState({
            error: '',
            msg: ''
        })

        let data = new FormData()
        data.append('id', this.state.id_projektu)
        data.append('name', 'newProject')

        fetch('http://localhost:8080/project', {
            method: 'PATCH',
            body: data
        }).then(response => {
            console.log(response)
            this.setState({
                error: '',
                msg: 'Sucessfully send patch'
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
                <button onClick={this.renameProject}>renameProject</button>
            </div>
        )
    }
}

export default RenameProject