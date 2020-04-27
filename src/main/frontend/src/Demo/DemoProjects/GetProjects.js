import React, { Component } from 'react'

class GetProjects extends Component {

    getProjects = (event) => {
        event.preventDefault()

        fetch('http://localhost:8080/projects', {
            method: 'GET',
        }).then(response => {
            console.log(response)
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