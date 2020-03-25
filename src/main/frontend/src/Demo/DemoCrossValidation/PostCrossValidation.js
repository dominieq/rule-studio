import React, { Component } from 'react'

class PostCrossValidation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '66f23be2-0595-40b9-aca1-fcc5f9b5ffc2',
            typeOfUnions: 'monotonic',
            consistencyThreshold: 0,
            typeOfClassifier: 'SimpleRuleClassifier',
            defaultClassificationResult: 'majorityDecisionClass',
            numberOfFolds: 2,
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
                  "preferenceType": "gain"
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
                  "preferenceType": "gain"
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

    handleTypeOfUnionsChange = (event) => {
        this.setState({
            typeOfUnions: event.target.value
        })
    }

    handleConsistencyThresholdChange = (event) => {
        this.setState({
            consistencyThreshold: event.target.value
        })
    }

    handletypeOfClassifierChange = (event) => {
        this.setState({
            typeOfClassifier: event.target.value
        })
    }

    handleDefaultClassificationResultChange = (event) => {
        this.setState({
            defaultClassificationResult: event.target.value
        })
    }

    handleNumberOfFolds = (event) => {
        this.setState({
            numberOfFolds: event.target.value
        })
    }

    postCrossValidation = (event) => {
        event.preventDefault();

        let formData = new FormData()
        formData.append('typeOfUnions', this.state.typeOfUnions)
        formData.append('consistencyThreshold', this.state.consistencyThreshold)
        formData.append('typeOfClassifier', this.state.typeOfClassifier)
        formData.append('defaultClassificationResult', this.state.defaultClassificationResult)
        formData.append('numberOfFolds', this.state.numberOfFolds)
        formData.append('metadata', this.state.metadata)
        formData.append('data', this.state.data)

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/crossValidation`;

        console.log(link)

        fetch(link, {
            method: 'POST',
            body: formData
        }).then(response => {
            console.log(response)
            if(response.status === 200) {
                response.json().then(result => {
                    console.log("Received cross-validation:")
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
            } else if(response.status === 422) {
                response.json().then(result => {
                    console.log("Error 422.")
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
                <label for="typeOfUnionsPostCrossValidation">typeOfUnions-></label>
                <select id="typeOfUnionsPostCrossValidation" onChange={this.handleTypeOfUnionsChange}>
                    <option value="monotonic">monotonic</option>
                    <option value="standard">standard</option>
                </select>
                consistencyThreshold->
                <input type='text' value={this.state.consistencyThreshold} onChange={this.handleConsistencyThresholdChange} />
                <label for="typeOfClassifierPostCrossValidation">typeOfClassifier-></label>
                <select id="typeOfClassifierPostCrossValidation" onChange={this.handletypeOfClassifierChange}>
                    <option value="SimpleRuleClassifier">SimpleRuleClassifier</option>
                    <option value="SimpleOptimizingCountingRuleClassifier">SimpleOptimizingCountingRuleClassifier</option>
                    <option value="ScoringRuleClassifierScore">ScoringRuleClassifierScore</option>
                    <option value="ScoringRuleClassifierHybrid">ScoringRuleClassifierHybrid</option>
                </select>
                <label for="defaultClassificationResultPostCrossValidation">defaultClassificationResult-></label>
                <select id="defaultClassificationResultPostCrossValidation" onChange={this.handleDefaultClassificationResultChange}>
                    <option value="majorityDecisionClass">majorityDecisionClass</option>
                    <option value="medianDecisionClass">medianDecisionClass</option>
                </select>
                numberOfFolds->
                <input type='text' value={this.state.numberOfFolds} onChange={this.handleNumberOfFolds} />
                <button onClick={this.postCrossValidation}>postCrossValidation</button>
            </div>
        )
    }
}

export default PostCrossValidation