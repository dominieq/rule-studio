import React, { Component } from 'react'

class PutMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
            body: JSON.stringify(
                [
                    {
                      "name": "lot_size",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "real",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "nbed",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "enumeration",
                      "domain": [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "nbath",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "enumeration",
                      "domain": [
                        "1",
                        "2",
                        "3",
                        "4"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "nstoreys",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "enumeration",
                      "domain": [
                        "1",
                        "2",
                        "3",
                        "4"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "drive",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "enumeration",
                      "domain": [
                        "0",
                        "1"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "rec_room",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "enumeration",
                      "domain": [
                        "0",
                        "1"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "basement",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "enumeration",
                      "domain": [
                        "0",
                        "1"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "air_cond",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "enumeration",
                      "domain": [
                        "0",
                        "1"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "ngarage",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "enumeration",
                      "domain": [
                        "0",
                        "1",
                        "2",
                        "3"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "desire_loc",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "condition",
                      "valueType": "enumeration",
                      "domain": [
                        "0",
                        "1"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    },
                    {
                      "name": "sale_price",
                      "active": true,
                      "preferenceType": "gain",
                      "type": "decision",
                      "valueType": "enumeration",
                      "domain": [
                        "0",
                        "1",
                        "2",
                        "3"
                      ],
                      "algorithm": "SHA-256",
                      "missingValueType": "mv2"
                    }
                ]
            )
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    putMetadata = (event) => {
        event.preventDefault()

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}/metadata`, {
            method: 'PUT',
            body: this.state.body
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
                <button onClick={this.putMetadata}>putMetadata</button>
            </div>
        )
    }
}

export default PutMetadata