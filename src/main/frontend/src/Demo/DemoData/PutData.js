import React, { Component } from 'react'

class PutData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
            body: JSON.stringify(
                [
                    {
                       "ID":"43187598-6984-4904-95a6-fcd9fa18a78b",
                       "SourceAssetCriticality":"NA",
                       "TargetAssetCriticality":"NA",
                       "TimeToDueDate":"-2687.60045",
                       "TimeFromDetectTime":"4187.600466666667",
                       "SeverityForAttackCategory":"med",
                       "MAQuality":"0.5",
                       "AttackSourceReputationScore":"0.5",
                       "MaxCVE":"0.0",
                       "Priority":4
                    },
                    {
                       "ID":"55fa5b53-e412-4f3b-b41c-c82ca8099079",
                       "SourceAssetCriticality":"NA",
                       "TargetAssetCriticality":"NA",
                       "TimeToDueDate":"474.89951666666667",
                       "TimeFromDetectTime":"1025.1004833333334",
                       "SeverityForAttackCategory":"critical",
                       "MAQuality":"0.5",
                       "AttackSourceReputationScore":"0.5",
                       "MaxCVE":"0.0",
                       "Priority":1
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

    putData = (event) => {
        event.preventDefault()

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}/data`, {
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
                <button onClick={this.putData}>putData</button>
            </div>
        )
    }
}

export default PutData