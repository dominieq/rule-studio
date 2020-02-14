import React, { Component } from 'react'
import CreateProjectWithData from './DemoImport/CreateProjectWithData';
import UpdateDataAndMetadata from './DemoImport/UpdateDataAndMetadata';
import CreateProjectWithMetadata from './DemoImport/CreateProjectWithMetadata';
import UpdateMetadata from './DemoImport/UpdateMetadata';
import GetData from './DemoImport/GetData';
import GetMetadata from './DemoImport/GetMetadata';
import GetDataAndMetadata from './DemoImport/GetDataAndMetadata';
import UpdateData from './DemoImport/UpdateData';

class DemoImport extends Component {

    render() {
        return (
            <div>
                <hr></hr>
                <h3>ImportController</h3>
                <CreateProjectWithData></CreateProjectWithData>
                <CreateProjectWithMetadata></CreateProjectWithMetadata>
                <UpdateDataAndMetadata></UpdateDataAndMetadata>
                <UpdateData></UpdateData>
                <UpdateMetadata></UpdateMetadata>
                <GetData></GetData>
                <GetMetadata></GetMetadata>
                <GetDataAndMetadata></GetDataAndMetadata>
            </div>
        )
    }
}

export default DemoImport