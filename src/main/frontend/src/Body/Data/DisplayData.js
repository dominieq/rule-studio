import React from 'react';
import ReactDataGrid from 'react-data-grid';
import 'bootstrap/dist/css/bootstrap.css';
import { Editors, Toolbar, Data} from 'react-data-grid-addons';
import data from './data-example.json';
import metadata from './metadata-example.json';
import './DisplayData.css';

const selectors = Data.Selectors;

const { DropDownEditor } = Editors;

let kolumny = [{key: "uniqueLP", name: "LP", sortable:true, resizable:true, filterable:true, width:100, visible: true}]

for(var el in metadata) {
    if(metadata[el].domain) {
        kolumny.push({editable:true, sortable:true, resizable:true, filterable:true, 
            key : metadata[el].name, name : (metadata[el].name + (metadata[el].preferenceType === "gain" ? "(+)" : "(-)")),
            editor : <DropDownEditor options={metadata[el].domain} />})
    } else {
        kolumny.push({editable:true, sortable:true, resizable:true, filterable:true,
            key : metadata[el].name, name : (metadata[el].name + (metadata[el].preferenceType === "gain" ? "(+)" : "(-)"))})
    }
}

let wiersze = [...data]
let uniqueLP = 1
wiersze.forEach(x => { x.uniqueLP = uniqueLP++ })

class DisplayData extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            rows : wiersze,
            columns : kolumny,
            selectedRows : [],
            filters : {}
        };
    }

    componentDidUpdate(prevProps, prevState) {
        //onEveryChange
    }

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState(prevState => {
            const rows = [...prevState.rows]
            const filtered = this.filteredRows();
            for (let i = fromRow; i <= toRow; i++) {
                const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                rows[rows_index] = { ...filtered[i], ...updated };
            }
            return { rows };
        });
    };

    onGridSort = (sortColumn, sortDirection) => {
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        };
        this.setState( (prevState) => ({
            rows: sortDirection === "NONE" ? wiersze : [...prevState.rows].sort(comparer)
        }));
        wiersze = [...this.state.rows]
    };

    onRowsSelected = rows => {
        this.setState( (prevState) => ({ 
            selectedRows: prevState.selectedRows.concat(rows.map(r => r.row.uniqueLP))
        }));
    };

    onRowsDeselected = rows => {
        let rowIndexes = rows.map(r => r.row.uniqueLP);
        
        this.setState( prevState => ({
            selectedRows: prevState.selectedRows.filter(
                i => rowIndexes.indexOf(i) === -1
            )
        }));
    };

    handleFilterChange = (filter) => {
        this.setState(prevState => {
            const newFilters = { ...prevState.filters };
            if (filter.filterTerm) {
                newFilters[filter.column.key] = filter;
            } else {
                delete newFilters[filter.column.key];
            }
            return { filters: newFilters,
                selectedRows : []};
        });
    };

    getRows(rows, filters) {
        return selectors.getRows({ rows, filters });
    }

    filteredRows = () => {
        return this.getRows(this.state.rows, this.state.filters);
    }

    onClearFilters = () => {
        this.setState({
            filters: {},
            selectedRows : []
        })
    }

    handleAddRow = ({ newRowIndex }) => {
        const newRow = {
            value: newRowIndex,
            id: this.state.rows.length+1,
        };

        let rows = [...this.state.rows]
        rows = [...rows, newRow]
        this.setState({ rows });
    };

    handleAddRow1 = () => {
        const newRow = {
            value: uniqueLP,
            uniqueLP: uniqueLP++,
        };

        this.setState( prevState => ({ rows: [...prevState.rows, newRow] }));
    };

    render() {
        const rowText = this.state.selectedRows.length === 1 ? "row" : "rows";
        return (

            <div>
              <span>
              {this.state.selectedRows.length} {rowText} selected
              </span>
              < DataButtons handleRemoveRow={this.handleRemoveRow}/>
              
                <ReactDataGrid
                    columns={kolumny.filter(c => c.visible !== false)}
                    rowGetter={i => this.filteredRows()[i]}
                    rowsCount={this.filteredRows().length}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    onGridSort = {this.onGridSort}
                    enableCellSelect={true}

                    toolbar={<Toolbar enableFilter={true} filterRowsButtonText={"Filter"} onAddRow={this.handleAddRow1}/> }
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}

                    rowSelection={{
                        showCheckbox: true,
                        enableShiftSelect: true,
                        onRowsSelected: this.onRowsSelected,
                        onRowsDeselected: this.onRowsDeselected,
                        selectBy: {
                            keys: {
                                rowKey: "uniqueLP",
                                values: this.state.selectedRows
                            }
                        }
                    }}
                    
                    minHeight={600}
                    rowHeight={50}
                    rowScrollTimeout={200}
                />
            </div>
        )
    }
}

export default DisplayData;