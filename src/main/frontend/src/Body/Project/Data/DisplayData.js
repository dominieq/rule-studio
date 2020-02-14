import React from 'react';
import ReactDataGrid from 'react-data-grid';
import {Editors, Data, Menu} from 'react-data-grid-addons';
import EditDataButtons from './EditDataButtons';
import EditDataFilterButton from './EditDataFilterButton'
import 'bootstrap/dist/css/bootstrap.css';
import './DisplayData.css';
import data from './resources/data-example.json';
import metadata from './resources/metadata-example.json';


const selectors = Data.Selectors;

const { DropDownEditor } = Editors;
const { ContextMenu, MenuItem, ContextMenuTrigger } = Menu;

let kolumny = [{key: "uniqueLP", name: "LP", sortable:true, resizable:true, filterable:true, sortDescendingFirst:true,  width:60, visible: true}]

for(let el in metadata) {
    if(metadata[el].domain) {
        kolumny.push({editable:true, sortable:true, resizable:true, filterable:true,
            key : metadata[el].name, name : (metadata[el].name + (metadata[el].preferenceType === "gain" ? "(+)" : "(-)")),
            editor : <DropDownEditor options={metadata[el].domain} />})
    } else {
        kolumny.push({editable:true, sortable:true, resizable:true, filterable:true,
            key : metadata[el].name, name : (metadata[el].name + (metadata[el].preferenceType === "gain" ? "(+)" : "(-)"))})
    }
}

let wiersze = [...data];
let maxUniqueLP = 1;
wiersze.forEach(x => { x.uniqueLP = maxUniqueLP++ });


function RightClickContextMenu({
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
            Delete example
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
            filters : {},
            dataModified: false
        };
    }

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState(prevState => {
            const rows = [...prevState.rows];
            const filtered = this.filteredRows();
            for (let i = fromRow; i <= toRow; i++) {
                const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                rows[rows_index] = { ...filtered[i], ...updated };
            }
            return { 
                rows: rows, 
                dataModified: true
            };
        });
    };

    onGridSort = (sortColumn, sortDirection) => {
        let tmpEnableRowInsert = -1;
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                ((sortColumn === "uniqueLP") ? tmpEnableRowInsert = 0 : tmpEnableRowInsert = -1);
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
                ((sortColumn === "uniqueLP") ? tmpEnableRowInsert = 1 : tmpEnableRowInsert = -1);
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            } else {
                tmpEnableRowInsert = 0;
                return a["uniqueLP"] > b["uniqueLP"] ? 1 : -1;
            }
        };
        this.setState( prevState => ({
            rows: [...prevState.rows].sort(comparer),
            enableRowInsert: tmpEnableRowInsert
        }));
    };

    onRowsSelected = (rows) => {
        this.setState( prevState => ({
            selectedRows: prevState.selectedRows.concat(rows.map(r => r.row.uniqueLP))
        }));
    };

    onRowsDeselected = (rows) => {
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

    getRows = (rows, filters) => {
        return selectors.getRows({ rows, filters });
    };

    filteredRows = () => {
        return this.getRows(this.state.rows, this.state.filters);
    };

    onClearFilters = () => {
        this.setState({
            filters: {},
            selectedRows: []
        })
    };

    deleteRowByRowIdx = (rowIdx) => {
        this.setState(prevState => {
            const nextRows = [...prevState.rows];
            if( nextRows[rowIdx] !== undefined) {
                const removedRowUniqueLP = nextRows[rowIdx].uniqueLP;
                nextRows.splice(rowIdx, 1);
                nextRows.forEach(r => {
                    if(r.uniqueLP >= removedRowUniqueLP) r.uniqueLP-=1
                });
                return {rows: nextRows};
            }
        })
    };

    deleteSelectedRows = () => {
        this.setState(prevState => {
            const nextRows = [...prevState.rows];
            const selected = [...prevState.selectedRows];
            while(selected.length > 0){
                const LP = selected[0];
                let i = nextRows.length;
                while(i--)
                {
                    if(nextRows[i].uniqueLP === LP) {
                        nextRows.splice(i, 1);
                        nextRows.forEach(r => {
                            if(r.uniqueLP >= LP) r.uniqueLP-=1;
                        });
                        selected.splice(0,1);
                        selected.forEach((x, idx) => {
                            return ((x > LP) ? selected[idx]-=1 : selected[idx]);
                        });
                        break;
                    }
                }                                             
            }
                        
            return {rows: nextRows,
                selectedRows : []};
        })
    };
    
    insertRow = (rowIdx, where) => {
        this.setState(prevState => {
            const nextRows = [...prevState.rows];
            const newRow = {};
            if( nextRows[rowIdx] !== undefined) { //if the cell is selected (and exists)
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
                        } else { //for every other column, doesn't matter if sorted
                            newRow.uniqueLP = nextRows[rowIdx].uniqueLP;
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
                        } else { //for every other column, doesn't matter if sorted
                            newRow.uniqueLP = nextRows[rowIdx].uniqueLP+1;
                            nextRows.forEach(r => {
                                if(r.uniqueLP >= newRow.uniqueLP) r.uniqueLP+=1
                            });
                            nextRows.splice(rowIdx+1, 0, newRow);
                        }
                    break;
                    default: //at the end of rows array
                        newRow.uniqueLP = Math.max(...nextRows.map(o => o.uniqueLP), 0) + 1; //nextRows[nextRows.length-1].uniqueLP + 1;
                        nextRows.push(newRow);
                    break;
                }
                return { 
                    rows: nextRows
                };
            } else if(nextRows.length === 0) { //when array is empty
                newRow.uniqueLP = 1; //nextRows[nextRows.length-1].uniqueLP + 1;
                nextRows.push(newRow);
                return { 
                    rows: nextRows
                };
            }
        });
    
    };

    sendModifiedDataToServer = () => {
        console.log("(Send data to server) button was clicked");
        //TODO
    };

    saveFileLocally = () => {
        console.log("(Save file locally) button was clicked");
        //TODO
    };

    onCellSelected = (rowIdx, idx) => {
      /* */
    };

    render() {
        const rowText = this.state.selectedRows.length === 1 ? "row" : "rows";
        return (

            <div>
              <span>
              {/*{this.state.selectedRows.length} {rowText} selected */}
              
              {this.state.dataModified ? "Data has been modified! Don't forget to save it" : ""}
              </span>

                <ReactDataGrid
                    columns={kolumny.filter(c => c.visible !== false)}
                    rowGetter={i => this.filteredRows()[i]}
                    rowsCount={this.filteredRows().length}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    onGridSort = {this.onGridSort}
                    enableCellSelect={true}

                    toolbar={<EditDataFilterButton enableFilter={true} > 
                                < EditDataButtons deleteRow={this.deleteSelectedRows} insertRow={this.insertRow} 
                                        sendModifiedDataToServer={this.sendModifiedDataToServer} saveFileLocally={this.saveFileLocally}/> 
                            </EditDataFilterButton> }
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}

                    onCellSelected={this.onCellSelected}
                    
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
                        <RightClickContextMenu
                          onRowDelete={(e, { rowIdx }) => this.deleteRowByRowIdx(rowIdx)}
                          onRowInsertAbove={(e, { rowIdx }) => this.insertRow(rowIdx, "above")}
                          onRowInsertBelow={(e, { rowIdx }) => this.insertRow(rowIdx, "below")}
                        />
                      }
                      RowsContainer={ContextMenuTrigger}
                />
            </div>
        )
    };
}

export default DisplayData;