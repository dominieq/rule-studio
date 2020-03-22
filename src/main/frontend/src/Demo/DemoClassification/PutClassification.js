import React, { Component } from 'react'

class PutClassification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70',
            typeOfClassifier: 'SimpleRuleClassifier',
            defaultClassificationResult: 'majorityDecisionClass'
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
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

    putClassification = (event) => {
        event.preventDefault()

        let formData = new FormData()
        formData.append('typeOfClassifier', this.state.typeOfClassifier)
        formData.append('defaultClassificationResult', this.state.defaultClassificationResult)

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/classification`;

        console.log(link)

        fetch(link, {
            method: 'PUT',
            body: formData
        }).then(response => {
            console.log(response)
            if(response.status === 200) {
                response.json().then(result => {
                    console.log("Received classification:")
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
                <label for="typeOfClassifierPutClassification">typeOfClassifier-></label>
                <select id="typeOfClassifierPutClassification" onChange={this.handletypeOfClassifierChange}>
                    <option value="SimpleRuleClassifier">SimpleRuleClassifier</option>
                    <option value="SimpleOptimizingCountingRuleClassifier">SimpleOptimizingCountingRuleClassifier</option>
                    <option value="ScoringRuleClassifierScore">ScoringRuleClassifierScore</option>
                    <option value="ScoringRuleClassifierHybrid">ScoringRuleClassifierHybrid</option>
                </select>
                <label for="defaultClassificationResultPutClassification">defaultClassificationResult-></label>
                <select id="defaultClassificationResultPutClassification" onChange={this.handleDefaultClassificationResultChange}>
                    <option value="majorityDecisionClass">majorityDecisionClass</option>
                    <option value="medianDecisionClass">medianDecisionClass</option>
                </select>
                <button onClick={this.putClassification}>putClassification</button>
            </div>
        )
    }
}

export default PutClassification