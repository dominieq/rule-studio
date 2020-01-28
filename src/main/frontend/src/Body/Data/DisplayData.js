import React from 'react';
import ReactDataGrid from 'react-data-grid';
import 'bootstrap/dist/css/bootstrap.css';
import { Editors, Toolbar, Data, Menu} from 'react-data-grid-addons';
import data from './data-example.json';
import metadata from './metadata-example.json';
import './DisplayData.css';

const selectors = Data.Selectors;

const { DropDownEditor } = Editors;
const { ContextMenu, MenuItem, ContextMenuTrigger } = Menu;

let kolumny = [{key: "uniqueLP", name: "LP", sortable:true, resizable:true, filterable:true, sortDescendingFirst:true,  width:60, visible: true}]

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


function ExampleContextMenu({
    idx,
    uniqueLP,
    rowIdx,
    onRowDelete,
    onRowInsertAbove,
    onRowInsertBelow
  }) {
    return (
      <ContextMenu uniqueLP={uniqueLP}>
        <MenuItem data={{ rowIdx, idx }} onClick={onRowDelete}>
          Delete Example
        </MenuItem>
        <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertAbove}>
          Add new example above
        </MenuItem>
        <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertBelow}>
         Add new example below
        </MenuItem>
      </ContextMenu>
    );
  }

class DisplayData extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            rows : wiersze,
            enableRowInsert: 0, //-1 no sort, 0-sort asc, 1-sort desc
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
            return { 
                rows: rows, 
            };
        });
    };

    onGridSort = (sortColumn, sortDirection) => {
        let tmpEnableRowInsert = -1
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                ((sortColumn === "uniqueLP") ? tmpEnableRowInsert = 0 : tmpEnableRowInsert = -1)
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
                ((sortColumn === "uniqueLP") ? tmpEnableRowInsert = 1 : tmpEnableRowInsert = -1)
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            } else {
                tmpEnableRowInsert = 0;
                return a["uniqueLP"] > b["uniqueLP"] ? 1 : -1;
            }
        };
        this.setState( (prevState) => ({
            rows: [...prevState.rows].sort(comparer),
            enableRowInsert: tmpEnableRowInsert
        }));
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

    deleteRow = (rowIdx) => {
        this.setState(prevState => {
            const nextRows = [...prevState.rows];
            nextRows.splice(rowIdx, 1);
            return {rows: nextRows};
        })
        
      };
    
    insertRow = (rowIdx, where) => {       
        this.setState(prevState => {
            const nextRows = [...prevState.rows];
            const newRow = {};
            switch(where) {
                case "above": //above the chosen row
                    if(this.state.enableRowInsert === 0) { //sort-asc
                        newRow.uniqueLP = nextRows[rowIdx].uniqueLP;
                        nextRows.forEach(r => {
                            if(r.uniqueLP >= newRow.uniqueLP) r.uniqueLP+=1
                        });
                        nextRows.splice(rowIdx, 0, newRow);
                    } else if(this.state.enableRowInsert === 1) { //sort-desc
                        newRow.uniqueLP = nextRows[rowIdx].uniqueLP+1;
                        nextRows.forEach(r => {
                            if(r.uniqueLP >= newRow.uniqueLP) r.uniqueLP+=1
                        });
                        nextRows.splice(rowIdx, 0, newRow);
                    }
                break;
                case "below": //below the chosen row
                    if(this.state.enableRowInsert === 0) { //sort-asc
                        newRow.uniqueLP = nextRows[rowIdx].uniqueLP+1;
                        nextRows.forEach(r => {
                            if(r.uniqueLP >= newRow.uniqueLP) r.uniqueLP+=1
                        });
                        nextRows.splice(rowIdx+1, 0, newRow);
                    } else if(this.state.enableRowInsert === 1) { //sort-desc
                        newRow.uniqueLP = nextRows[rowIdx].uniqueLP;
                        nextRows.forEach(r => {
                            if(r.uniqueLP >= newRow.uniqueLP) r.uniqueLP+=1
                        });
                        nextRows.splice(rowIdx+1, 0, newRow);
                    }
                break;
                default: //at the end of rows array
                    newRow.uniqueLP = nextRows.length+1;
                    nextRows.push(newRow);
                break;
            };
            return { 
                rows: nextRows
            };
        });
    
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

                    toolbar={<Toolbar enableFilter={true} filterRowsButtonText={"Filter"} onAddRow={(a,b) => this.insertRow(0,0)}/> }
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

                    contextMenu={
                        <ExampleContextMenu
                          onRowDelete={(e, { rowIdx }) => this.deleteRow(rowIdx)}
                          onRowInsertAbove={(e, { rowIdx }) => this.insertRow(rowIdx, "above")}
                          onRowInsertBelow={(e, { rowIdx }) => this.insertRow(rowIdx, "below")}
                        />
                      }
                      RowsContainer={ContextMenuTrigger}
                />
            </div>
        )
    }
}

export default DisplayData;