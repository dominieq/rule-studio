import React, { Component } from 'react'

class CreateProjectWithMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metadata: '',
        }
    }

    onMetadataChange = (event) => {
        this.setState({
            metadata: event.target.files[0]
        })
    }

    createProjectWithMetadata = (event) => {
        event.preventDefault();

        let data = new FormData()
        data.append('name', "Tymczasowa nazwa projektu")
        data.append('metadata', this.state.metadata)

        fetch('http://localhost:8080/import/data/createProjectWithMetadata', {
            method: 'POST',
            body: data,
        }).then(response => {
            console.log(response)
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
        })
    }

    render() {
        return (
            <div>
                <h3>Create project with metadata</h3>
                <p>metadata</p>
                <input onChange={this.onMetadataChange} type="file"></input>
                <br />
                <button onClick={this.createProjectWithMetadata}>createProjectWithMetadata</button>
            </div>
        )
    }
}

export default CreateProjectWithMetadata