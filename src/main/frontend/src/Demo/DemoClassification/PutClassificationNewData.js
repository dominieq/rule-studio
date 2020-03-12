import React, { Component } from 'react'

class PutClassificationNewData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70',
            data: '',
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    onDataChange = (event) => {
        this.setState({
            data: event.target.files[0]
        })
    }

    putClassificationNewData = (event) => {
        event.preventDefault()

        let data = new FormData()
        data.append('data', this.state.data)

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}/classification`, {
            method: 'PUT',
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
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                data->
                <input onChange={this.onDataChange} type="file"></input>
                <button onClick={this.putClassificationNewData}>putClassificationNewData</button>
            </div>
        )
    }
}

export default PutClassificationNewData