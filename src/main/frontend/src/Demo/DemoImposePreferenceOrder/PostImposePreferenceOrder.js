import React, { Component } from 'react'

class PostImposePreferenceOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
            binarizeNominalAttributesWith3PlusValues: false,
            metadata: JSON.stringify(
              [
                {
                  "name": "ID",
                  "active": true,
                  "identifierType": "uuid"
                },
                {
                  "name": "SourceAssetCriticality",
                  "active": true,
                  "type": "condition",
                  "valueType": "enumeration",
                  "domain": ["NA", "low", "med", "high", "critical"],
                  "preferenceType": "none"
                },
                {
                  "name": "TargetAssetCriticality",
                  "active": true,
                  "type": "condition",
                  "valueType": "enumeration",
                  "domain": ["NA", "low", "med", "high", "critical"],
                  "preferenceType": "gain"
                },
                {
                  "name": "TimeToDueDate",
                  "active": true,
                  "type": "condition",
                  "valueType": "real",
                  "preferenceType": "cost"
                },
                {
                  "name": "TimeFromDetectTime",
                  "active": true,
                  "type": "condition",
                  "valueType": "real",
                  "preferenceType": "cost"
                },
                {
                  "name": "SeverityForAttackCategory",
                  "active": true,
                  "type": "condition",
                  "valueType": "enumeration",
                  "domain": ["NA", "low", "med", "high", "critical"],
                  "preferenceType": "gain"
                },
                {
                  "name": "MAQuality",
                  "active": true,
                  "type": "condition",
                  "valueType": "real",
                  "preferenceType": "gain"
                },
                {
                  "name": "AttackSourceReputationScore",
                  "active": true,
                  "type": "condition",
                  "valueType": "real",
                  "preferenceType": "none"
                },
                {
                  "name": "MaxCVE",
                  "active": true,
                  "type": "condition",
                  "valueType": "real",
                  "preferenceType": "gain"
                },
                {
                  "name": "Rank",
                  "active": false,
                  "type": "description",
                  "valueType": "integer",
                  "preferenceType": "cost"
                },
                {
                  "name": "Priority",
                  "active": true,
                  "type": "decision",
                  "valueType": "enumeration",
                  "domain": ["1", "2", "3", "4", "5"],
                  "preferenceType": "cost"
                }
              ]
            ),
            data: JSON.stringify(
              [
                {
                  "ID": "43187598-6984-4904-95a6-fcd9fa18a78b",
                  "SourceAssetCriticality": "NA",
                  "TargetAssetCriticality": "NA",
                  "TimeToDueDate": "-2687.60045",
                  "TimeFromDetectTime": "4187.600466666667",
                  "SeverityForAttackCategory": "med",
                  "MAQuality": "0.5",
                  "AttackSourceReputationScore": "0.5",
                  "MaxCVE": "0.0",
                  "Priority": 4
                },
                {
                  "ID": "55fa5b53-e412-4f3b-b41c-c82ca8099079",
                  "SourceAssetCriticality": "NA",
                  "TargetAssetCriticality": "NA",
                  "TimeToDueDate": "474.89951666666667",
                  "TimeFromDetectTime": "1025.1004833333334",
                  "SeverityForAttackCategory": "critical",
                  "MAQuality": "0.5",
                  "AttackSourceReputationScore": "0.5",
                  "MaxCVE": "0.0",
                  "Priority": 1
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

    handleBinarizeNominalAttributesWith3PlusValuesChange = (event) => {
        this.setState({
            binarizeNominalAttributesWith3PlusValues: event.target.checked
        })
    }

    postImposePreferenceOrder = (event) => {
        event.preventDefault()

        let formData = new FormData()
        formData.append('binarizeNominalAttributesWith3PlusValues', this.state.binarizeNominalAttributesWith3PlusValues)
        formData.append('metadata', this.state.metadata)
        formData.append('data', this.state.data)

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}/imposePreferenceOrder`, {
            method: 'POST',
            body: formData
        }).then(response => {
            console.log(response)
            if(response.status === 200) {
                response.json().then(result => {
                    console.log("Received information table:")
                    console.log(result)
                }).catch(err => {
                    console.log(err)
                })
            } else if(response.status === 404) {
                response.json().then(result => {
                    console.log("Error 404.")
                    console.log(result.message)
                }).catch(err => {
                    console.log(err)
                })
            } else {
                response.json().then(result => {
                    console.log("Result of response.json():")
                    console.log(result)
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                <input type="checkbox" id="binarizeNominalAttributesWith3PlusValuesPostImposePreferenceOrder" onChange={this.handleBinarizeNominalAttributesWith3PlusValuesChange} />
                <label for="binarizeNominalAttributesWith3PlusValuesPostImposePreferenceOrder"> binarizeNominalAttributesWith3PlusValues </label>
                <button onClick={this.postImposePreferenceOrder}>postImposePreferenceOrder</button>
            </div>
        )
    }
}

export default PostImposePreferenceOrder