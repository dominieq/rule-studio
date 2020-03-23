import React, { Component } from 'react'

class PutCrossValidation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '66f23be2-0595-40b9-aca1-fcc5f9b5ffc2',
            typeOfUnions: 'monotonic',
            consistencyThreshold: 0,
            typeOfClassifier: 'SimpleRuleClassifier',
            defaultClassificationResult: 'majorityDecisionClass',
            numberOfFolds: 10
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

    putCrossValidation = (event) => {
        event.preventDefault();

        let formData = new FormData()
        formData.append('typeOfUnions', this.state.typeOfUnions)
        formData.append('consistencyThreshold', this.state.consistencyThreshold)
        formData.append('typeOfClassifier', this.state.typeOfClassifier)
        formData.append('defaultClassificationResult', this.state.defaultClassificationResult)
        formData.append('numberOfFolds', this.state.numberOfFolds)

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/crossValidation`;

        console.log(link)

        fetch(link, {
            method: 'PUT',
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
                <label for="typeOfUnionsPutCrossValidation">typeOfUnions-></label>
                <select id="typeOfUnionsPutCrossValidation" onChange={this.handleTypeOfUnionsChange}>
                    <option value="monotonic">monotonic</option>
                    <option value="standard">standard</option>
                </select>
                consistencyThreshold->
                <input type='text' value={this.state.consistencyThreshold} onChange={this.handleConsistencyThresholdChange} />
                <label for="typeOfClassifierPutCrossValidation">typeOfClassifier-></label>
                <select id="typeOfClassifierPutCrossValidation" onChange={this.handletypeOfClassifierChange}>
                    <option value="SimpleRuleClassifier">SimpleRuleClassifier</option>
                    <option value="SimpleOptimizingCountingRuleClassifier">SimpleOptimizingCountingRuleClassifier</option>
                    <option value="ScoringRuleClassifierScore">ScoringRuleClassifierScore</option>
                    <option value="ScoringRuleClassifierHybrid">ScoringRuleClassifierHybrid</option>
                </select>
                <label for="defaultClassificationResultCrossValidation">defaultClassificationResult-></label>
                <select id="defaultClassificationResultCrossValidation" onChange={this.handleDefaultClassificationResultChange}>
                    <option value="majorityDecisionClass">majorityDecisionClass</option>
                    <option value="medianDecisionClass">medianDecisionClass</option>
                </select>
                numberOfFolds->
                <input type='text' value={this.state.numberOfFolds} onChange={this.handleNumberOfFolds} />
                <button onClick={this.putCrossValidation}>putCrossValidation</button>
            </div>
        )
    }
}

export default PutCrossValidation