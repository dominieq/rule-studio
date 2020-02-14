import React, { Component } from 'react'

class GetProjects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            msg: '',
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70'
        }
    }

    getProjects = (event) => {
        event.preventDefault()
        this.setState({
            error: '',
            msg: ''
        })

        fetch('http://localhost:8080/projects', {
            method: 'GET',
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

            console.log("Kolejne projekty:")
            result.forEach(element => {
                console.log(element)
            });
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
                <button onClick={this.getProjects}>getProjects</button>
            </div>
        )
    }
}

export default GetProjects