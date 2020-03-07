import React, { Component } from 'react'

class PutDataDownload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
            format: 'json',
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

    handleFormatChange = (event) => {
        this.setState({
            format: event.target.value
        })
    }

    putDataDownload = (event) => {
        event.preventDefault()
        let filename = "filename";

        var link = `http://localhost:8080/projects/${this.state.id_projektu}/data/download`;
        if(this.state.format !== "") {
            link += `?format=${this.state.format}`;
        }

        console.log(link)

        let formData = new FormData()
        formData.append('metadata', this.state.metadata)
        formData.append('data', this.state.data)

        fetch(link, {
            method: 'PUT',
            body: formData
        }).then(response => {
            console.log(response)
            filename =  response.headers.get('Content-Disposition').split('filename=')[1];
            return response.blob()
        }).then(result => {
            console.log("Wynik dzialania response.blob():")
            console.log(result)
            let url = window.URL.createObjectURL(result);
            let link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                format->
                <input type='text' value={this.state.format} onChange={this.handleFormatChange} />
                <button onClick={this.putDataDownload}>putDataDownload</button>
            </div>
        )
    }
}

export default PutDataDownload