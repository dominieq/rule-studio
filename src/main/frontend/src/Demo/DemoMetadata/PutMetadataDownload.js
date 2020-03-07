import React, { Component } from 'react'

class PutMetadataDownload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '532bda52-5cab-4725-8023-ccea7b2d612f',
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
            )
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    putMetadataDownload = (event) => {
        event.preventDefault()
        let filename = "filename";

        let formData = new FormData()
        formData.append('metadata', this.state.metadata)

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}/metadata/download`, {
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
                <button onClick={this.putMetadataDownload}>putMetadataDownload</button>
            </div>
        )
    }
}

export default PutMetadataDownload