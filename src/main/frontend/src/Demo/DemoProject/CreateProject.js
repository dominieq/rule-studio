import React, { Component } from 'react'

class CreateProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            msg: '',
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70'
        }
    }

    createProject = (event) => {
        event.preventDefault()
        this.setState({
            error: '',
            msg: ''
        })

        let data = new FormData()
        data.append('name', 'newProject')

        fetch('http://localhost:8080/project', {
            method: 'POST',
            body: data
        }).then(response => {
            console.log(response)
            this.setState({
                error: '',
                msg: 'Sucessfully send post'
            })
            return response.json()
        }).then(result => {
            console.log("Wynik dzialania response.json():")
            console.log(result)

            console.log("Atrybuty:")
            result.attributes.forEach(element => {
                console.log(element)
            });

            console.log("Obiekty:")
            result.objects.forEach(element => {
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
                <button onClick={this.createProject}>createProject</button>
            </div>
        )
    }
}

export default CreateProject