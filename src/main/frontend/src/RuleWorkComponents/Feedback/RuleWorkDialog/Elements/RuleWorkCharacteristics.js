import React, {Fragment} from "react";
import PropTypes from "prop-types";
import VirtualizedTable from "./VirtualizedTable";
import Paper from "@material-ui/core/Paper";

function RuleWorkCharacteristics(props) {
    const {traits, ...other} = props;

    const getColumns = () => {
        return [{width: 200, label: "Name of the property:", dataKey: "key", },
                {width: 200, label: "Value of the property:", dataKey: "value"}];       
    };

    const getRows = (traits) => {
        const tmp = [];
        for(const k in traits) {
            tmp.push({
                key: k,
                value: traits[k],
            })
        }
        return tmp;
    };

    const rowCount = (traits) => {
        return Object.keys(traits).length;
    };


    return (
        <Fragment>
            {traits &&
                <Paper style={{ height: '100%', width: '100%' }} {...other} >
                    <VirtualizedTable
                        rowCount={rowCount(traits)}
                        rowGetter={({ index }) => getRows(traits)[index]}
                        columns={getColumns()}
                    />
                </Paper>
            }
        </Fragment>
    )
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