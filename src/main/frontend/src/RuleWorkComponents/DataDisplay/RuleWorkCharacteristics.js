import React, {Component} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import VirtualizedTable from "./VirtualizedTable";
import Paper from "@material-ui/core/Paper";

class RuleWorkCharacteristics extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getColumns() {
        return [{width: 200, label: "Name of the property:", dataKey: "key", },
                {width: 200, label: "Value of the property:", dataKey: "value"}];       
    }

    getRows(traits) {
        const tmp = [];
        for(const k in traits) {
            tmp.push({
                key: k,
                value: traits[k],
            })
        }
        return tmp;
    }

    rowCount(traits) {
        return Object.keys(traits).length;
    }

    render() {        
        const {traits, ...other} = this.props;
        return (
            <Paper style={{ height: '100%', width: '100%' }} {...other} >
            {
                traits !== null && 
                <VirtualizedTable
                    rowCount={this.rowCount(traits)}
                    rowGetter={({ index }) => this.getRows(traits)[index]}
                    columns={this.getColumns()}
                />
            }
            </Paper>
        )
        
    }
}

// Expected props:
// traits (required) <-- key value pairs explaining the characteristic
// anything other (optional) <-- additional settings for Paper

//Example of props:
/*
    traits = {accuracyOfApproximation: 0.17234567898765}
}
*/

RuleWorkCharacteristics.propTypes = {
    traits: PropTypes.object.isRequired,
};

export default RuleWorkCharacteristics;