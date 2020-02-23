import React, {PureComponent} from 'react';
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

class ObjectComparison extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            comparison: null
        };
    }

    updateComparison = (comparison) => {
        this.setState({
            comparison: comparison,
        });
    };

    createRows = (comparison) => {
        const objectMain = comparison.objectMain;
        const objectOptional = comparison.objectOptional;
        const keys = Object.keys(objectMain);
        const valuesObjectMain = Object.values(objectMain);
        const valuesObjectOptional = Object.values(objectOptional);

        let rows = [];

        for (let i = 0; i < keys.length; i++) {
            let row = this.createRow(keys[i], valuesObjectMain[i], valuesObjectOptional[i]);
            rows = [...rows, row];
        }
        return rows;
    };

    createRow = (attribute, object1, object2) => {
        return { attribute, object1, object2 };
    };

    render() {
        const comparison = this.state.comparison;

        if (comparison === null) {
            return null;
        }
        else {
            const rows = this.createRows(comparison);

            return (
                <TableContainer component={Paper} square elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Attribute</TableCell>
                                <TableCell align={"right"}>{"Object 1"}</TableCell>
                                <TableCell align={"right"}>Relation</TableCell>
                                <TableCell align={"right"}>{"Object 2"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.attribute}>
                                    <TableCell component={"th"} scope={"row"}>{row.attribute}</TableCell>
                                    <TableCell align={"right"}>{row.object1}</TableCell>
                                    <TableCell align={"right"}>{comparison.relation}</TableCell>
                                    <TableCell align={"right"}>{row.object2}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }
    }
}

export default ObjectComparison;