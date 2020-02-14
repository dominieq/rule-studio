import React from 'react';
import ReactDataGrid from 'react-data-grid';
import 'bootstrap/dist/css/bootstrap.css';
import { Editors, Toolbar, Data} from 'react-data-grid-addons';
import data from '../Body/Data/data-example.json';
import metadata from '../Body/Data/metadata-example.json';
import '../Body/Data/Data.css';
import DataButtons from '../Body/Data/DataButtons';
const selectors = Data.Selectors;

const { DropDownEditor } = Editors;

let kolumny = [{key: "uniqueLP", name: "LP", sortable:true, resizable:true, filterable:true, width:100, visible: true}]

for(var el in metadata) {
    //if(metadata[el].name === "id") metadata[el].name = "ID";
    if(metadata[el].domain) {
        kolumny.push({editable:true, sortable:true, resizable:true, filterable:true, 
            key : metadata[el].name, name : (metadata[el].name + (metadata[el].preferenceType === "gain" ? "(+)" : "(-)")),
            editor : <DropDownEditor options={metadata[el].domain} />})
        console.log(metadata[el])
    } else {
        kolumny.push({editable:true, sortable:true, resizable:true, filterable:true,
            key : metadata[el].name, name : (metadata[el].name + (metadata[el].preferenceType === "gain" ? "(+)" : "(-)"))})
    }

    console.log("el = " + metadata[el].name)
}

let wiersze = [...data]
let uniqueLP = 1
wiersze.forEach(x => {
    //if(x.id) x.ID = x.id;
    x.uniqueLP = uniqueLP++
})

class DisplayData extends React.Component {
    constructor(props) {
        super(props);
    
        this.dwanascie = 12

        this.state = {
            rows : wiersze,
            columns : kolumny,
            selectedRows : [],
            filters : {}
        };
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log("ComponentDidUpdate -> Przed updatem (selectedRows):")
        //console.log(prevState.selectedRows)
        //console.log("Po updacie:")
        //console.log(this.state.selectedRows)
        console.log("ComponentDidUpdate -> Przed updatem (selectedRows):")
        console.log(prevState.rows)
        console.log("Po updacie:")
        console.log(this.state.rows)
        this.dwanascie++
    }

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        //console.log("FUNKCJA GRID UPDATED")
        //console.log("FromRow = ")
        console.log("FUNKCJA GRID UPDATED")
        this.setState(prevState => {
            const rows = prevState.rows.slice();
            const filtered = this.filteredRows();
            console.log("Filtered = ")
            console.log(filtered)
            for (let i = fromRow; i <= toRow; i++) {
                const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP); // LP-1
                rows[rows_index] = { ...filtered[i], ...updated };
            }
            return { rows };
        });
        console.log("onGridRowsUpdated")
        console.log("fromRow = " + fromRow + ", toRow = " + toRow)
        console.log("updated = ")
        console.log(updated)
    };

    onGridSort = (sortColumn, sortDirection) => {
       // console.log("Przed sortowaniem:")
       // console.log(this.state.rows)

        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        };

        //const tmpRows = sortDirection === "NONE" ? wiersze : [...this.state.rows].sort(comparer);
        //this.sortRows(wiersze, sortColumn, sortDirection)(this.state.rows);
        this.setState( (prevState) => ({
            rows: sortDirection === "NONE" ? wiersze : [...prevState.rows].sort(comparer)
        }));
        

       // console.log("Po sortowaniu")
       // console.log(this.state.rows)
        wiersze = [...this.state.rows] //.slice(); //kopiowanie tablicy poprzez wartosc (nie referencje)
      //  console.log("onGridSort")
      //  console.log("sortColumn = " + sortColumn + ", sortDirection = " + sortDirection)
      //  console.log("uniqueLP? = ")
       // wiersze.forEach(x => console.log(x.uniqueLP + ", " + x.ID))
    };

    onRowsSelected = rows => {
        console.log("onRowsSelected")
        console.log(rows)
       // rows.forEach(x => console.log(x.uniqueLP))
        this.setState( (prevState) => ({ 
            selectedRows: prevState.selectedRows.concat(rows.map(r => r.row.uniqueLP))
        }));
        //console.log("onRowsSelected")
        //console.log("wiersz o indeksie 0 ma uniqueLP = " + rows[0].uniqueLP)
        //console.log(this.state.selectedRows);
        console.log("Ile wierszy wybrano:")
        console.log(this.state.selectedRows.length)
    };

    onRowsDeselected = rows => {
        let rowIndexes = rows.map(r => r.row.uniqueLP);
        console.log("onRowsDeselected")
        console.log(rows)
        
        this.setState( prevState => ({
            selectedRows: prevState.selectedRows.filter(
                i => rowIndexes.indexOf(i) === -1
            )
        }));
        
        //console.log(this.state.selectedRows);
        console.log("Ile wierszy wybrano:")
        console.log(this.state.selectedRows.length)
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
        console.log("handleFilterChange")
        console.log(filter);
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

        let rows = this.state.rows.slice();
        //rows = update(rows, {$push: [newRow]});
        rows = [...rows, newRow]
        this.setState({ rows });
    };

    handleRemoveRow = rowIndex => {
        this.setState(prevState => ({ 
            rows: prevState.rows.filter(r => r !== rowIndex) 
        }))
    }

    render() {
        const rowText = this.state.selectedRows.length === 1 ? "row" : "rows";
        return (

            <div>
               
              <span>
              
              {this.state.selectedRows.length} {rowText} selected
              {this.state.selectedRows}
              </span>
              < DataButtons handleRemoveRow={this.handleRemoveRow}/>
              
                <ReactDataGrid
                    columns={kolumny.filter(c => c.visible !== false)}
                    rowGetter={i => this.filteredRows()[i]}
                    rowsCount={this.filteredRows().length}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    onGridSort = {this.onGridSort}
                    enableCellSelect={true}

                    toolbar={<Toolbar enableFilter={true} filterRowsButtonText={"Filter"} onAddRow={this.handleAddRow}/> }
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
                            //indexes: this.state.selectedRows
                        }
                    }}
                    
                    minHeight={600}
                    rowHeight={50}
                    rowScrollTimeout={200}
                />
                {this.dwanascie}
            </div>
        )
    }
}

export default DisplayData;