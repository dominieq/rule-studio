import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Comparison from "./api/Comparison";

class VariantComparison extends Component {
    constructor(props) {
        super(props);

        this.rows = [];
    }

    componentDidMount() {
        const variantMain = this.props.comparison.variantMain;
        const variantOptional = this.props.comparison.variantOptional;
        const keys = Object.keys(variantMain);
        const valuesVariantMain = Object.values(variantMain);
        const valuesVariantOptional = Object.values(variantOptional);

        let rows = [];

        for (let i = 0; i < keys.length; i++) {
            let row = this.createRow(keys[i], valuesVariantMain[i], valuesVariantOptional[i]);
            rows = [...rows, row];
        }
        this.rows = rows;
    }

    createRow = (attribute, variant1, variant2) => {
        return { attribute, variant1, variant2 };
    };

    render() {
        return (
            <TableContainer component={Paper} square elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Attribute</TableCell>
                            <TableCell align={"right"}>Variant 1</TableCell>
                            <TableCell align={"right"}>Relation</TableCell>
                            <TableCell align={"right"}>Variant 2</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.rows.map((row) => (
                            <TableRow key={row.attribute}>
                                <TableCell component={"th"} scope={"row"}>{row.attribute}</TableCell>
                                <TableCell align={"right"}>{row.variant1}</TableCell>
                                <TableCell align={"right"}>{this.props.comparison.relation}</TableCell>
                                <TableCell align={"right"}>{row.variant2}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

VariantComparison.propTypes = {
    comparison: PropTypes.instanceOf(Comparison).isRequired,
};

export default VariantComparison;