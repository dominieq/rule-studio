import React, { Component } from 'react'

class PutClassificationNewData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70',
            typeOfClassifier: 'SimpleRuleClassifier',
            defaultClassificationResult: 'majorityDecisionClass',
            data: '',
            separator: ',',
            header: false
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

    handleSeparatorChange = (event) => {
        this.setState({
            separator: event.target.value
        })
    }

    handleHeaderChange = (event) => {
        this.setState({
            header: event.target.checked
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
        data.append('typeOfClassifier', this.state.typeOfClassifier)
        data.append('defaultClassificationResult', this.state.defaultClassificationResult)
        data.append('data', this.state.data)
        data.append('separator', this.state.separator)
        data.append('header', this.state.header)

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/classification`;

        console.log(link)

        fetch(link, {
            method: 'PUT',
            body: data
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
                <label for="typeOfClassifierPutClassificationNewData">typeOfClassifier-></label>
                <select id="typeOfClassifierPutClassificationNewData" onChange={this.handletypeOfClassifierChange}>
                    <option value="SimpleRuleClassifier">SimpleRuleClassifier</option>
                    <option value="SimpleOptimizingCountingRuleClassifier">SimpleOptimizingCountingRuleClassifier</option>
                    <option value="ScoringRuleClassifierScore">ScoringRuleClassifierScore</option>
                    <option value="ScoringRuleClassifierHybrid">ScoringRuleClassifierHybrid</option>
                </select>
                <label for="defaultClassificationResultPutClassificationNewData">defaultClassificationResult-></label>
                <select id="defaultClassificationResultPutClassificationNewData" onChange={this.handleDefaultClassificationResultChange}>
                    <option value="majorityDecisionClass">majorityDecisionClass</option>
                    <option value="medianDecisionClass">medianDecisionClass</option>
                </select>
                data->
                <input onChange={this.onDataChange} type="file"></input>
                separator(only csv)->
                <input type='text' value={this.state.separator} onChange={this.handleSeparatorChange} />
                <input type="checkbox" id="headerPutClassificationNewData" onChange={this.handleHeaderChange} />
                <label for="headerPutClassificationNewData"> header </label>
                <br />
                <button onClick={this.putClassificationNewData}>putClassificationNewData</button>
            </div>
        )
    }
}

export default PutClassificationNewData