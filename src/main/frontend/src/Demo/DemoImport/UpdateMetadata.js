import React, { Component } from 'react'

class UpdateMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metadata: '',
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70'
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    onMetadataChange = (event) => {
        this.setState({
            metadata: event.target.files[0]
        })
    }

    updateMetadata = (event) => {
        event.preventDefault();

        let data = new FormData()
        data.append('id', this.state.id_projektu)
        data.append('metadata', this.state.metadata)

        fetch('http://localhost:8080/import/data/updateMetadata', {
            method: 'PATCH',
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
                <h3>Update metadata</h3>
                <p>metadata</p>
                <input onChange={this.onMetadataChange} type="file"></input>
                <br />
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                <button onClick={this.updateMetadata}>updateMetadata</button>
            </div>
        )
    }
}

export default UpdateMetadata