import React, { Component } from 'react'

class CreateProjectWithData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metadata: '',
            data: '',
        }
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

    createProjectWithData = (event) => {
        event.preventDefault();

        let data = new FormData()
        data.append('name', "Tymczasowa nazwa projektu")
        data.append('metadata', this.state.metadata)
        data.append('data', this.state.data)

        fetch('http://localhost:8080/import/data/createProjectWithData', {
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
                <h3>Create project with data</h3>
                <p>metadata</p>
                <input onChange={this.onMetadataChange} type="file"></input>
                <p>data</p>
                <input onChange={this.onDataChange} type="file"></input>
                <br />
                <button onClick={this.createProjectWithData}>createProjectWithData</button>
            </div>
        )
    }
}

export default CreateProjectWithData