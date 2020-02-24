import React from 'react';
import ReactDataGrid from 'react-data-grid';
import 'bootstrap/dist/css/bootstrap.css';
import { Editors,  Data, Menu, Filters} from 'react-data-grid-addons';
import data from './resources/data-example.json';
import metadata from './resources/metadata-example.json';
import './DisplayData.css';
import EditDataButtons from './EditDataButtons';
import EditDataFilterButton from './EditDataFilterButton'

import DropDownForAttributes from './DropDownForAttributes';
import Notification from './Notification';
import AttributeDomain from './AttributeDomain';
import ColumnHeaderMenu from './ColumnHeaderMenu';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

const selectors = Data.Selectors;
const { NumericFilter } = Filters;
const { DropDownEditor } = Editors;
const { ContextMenu, MenuItem, ContextMenuTrigger } = Menu;

let kolumny = [{key: "uniqueLP", name: "No.", sortable:true, resizable:true, filterable:true, sortDescendingFirst:true,  width:160, filterRenderer: NumericFilter, visible: true}]

for(let el in metadata) {
    //if(metadata[el].uniqueLP)  metadata[el].UniqueLP=== "uniqueLP") {
    const attribute = {editable:true, sortable:true, resizable:true, filterable:true, visible: true}
    attribute.key = metadata[el].name;
    attribute.name = metadata[el].name;
    attribute.active = metadata[el].active;
    if(metadata[el].missingValueType !== undefined) attribute.missingValueType = metadata[el].missingValueType;
    else if(metadata[el].identifierType === undefined) attribute.missingValueType = "mv2";
    
    if(metadata[el].identifierType !== undefined) { //identification attribute
        attribute.identifierType = metadata[el].identifierType;
    } else {
        attribute.type = metadata[el].type;
        attribute.preferenceType = metadata[el].preferenceType;
        attribute.valueType = metadata[el].valueType;
        if(attribute.valueType === "enumeration") {
            attribute.domain = metadata[el].domain;
            attribute.editor = <DropDownEditor options={attribute.domain} />;
        } else if(attribute.valueType === "integer" || attribute.valueType === "real") {
            attribute.filterRenderer = NumericFilter;
        }
    }
    kolumny.push(attribute)
}

let wiersze = [...data]
let maxUniqueLP = 1
wiersze.forEach(x => { x.uniqueLP = maxUniqueLP++ })

const heightOfRow = 50;
const heightOfHeaderRow = 60;

const ValidationTextField = withStyles({
    root: {
      '& input:valid + fieldset': {
        borderColor: 'green',
        borderWidth: 2,
      },
      '& input:invalid + fieldset': {
        borderColor: 'red',
        borderWidth: 2,
      },
      '& input:valid:focus + fieldset': {
        borderLeftWidth: 6,
        padding: '4px !important', // override inline-style
      },
    },
})(TextField);

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
            rows: wiersze, 
            enableRowInsert: 0, //-1 no sort, 0-sort asc, 1-sort desc
            columns: kolumny,
            selectedRows: [],
            filters: {},
            dataModified: false,

            isOpenedAddAttribute: false,
            isOpenedEditAttributes: false,
            
            addAttributeErrorNotification: '',
            attributeTypeSelected: '',
            attributePreferenceTypeSelected: '',
            valueTypeSelected: '',
            identifierTypeSelected: '',
            missingValueTypeSelected: '',
            attributesDomainElements: [],

            isOpenedNotification: true,
            isColumnHeaderMenuOpened: null,
            columnKeyOfHeaderMenuOpened: -1,
            
            scrollOffset: 0,
        };
    }

    componentDidMount() {
        const headers = document.getElementsByClassName("react-grid-HeaderCell-sortable");
        for(let i=0; i<headers.length; i++) {
            for(let j=0; j<this.state.columns.length; j++)
            {
                if(headers[i].innerText === this.state.columns[j].name) {
                    this.setHeaderColorAndStyleAndRightClick(this.state.columns[j], i);
                    break;
                }
            }                        
        }
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
                dataModified: true
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
            selectedRows: []
        })
    }

    deleteRowByRowIdx = (rowIdx) => {
        this.setState(prevState => {
            const nextRows = [...prevState.rows];
            if( nextRows[rowIdx] !== undefined) {
                const removedRowUniqueLP = nextRows[rowIdx].uniqueLP;
                nextRows.splice(rowIdx, 1);
                nextRows.forEach(r => {
                    if(r.uniqueLP >= removedRowUniqueLP) r.uniqueLP-=1
                })
                return {rows: nextRows, dataModified: true};
            }
        })
    };

    deleteSelectedRows = () => {
        this.setState(prevState => {
            const nextRows = [...prevState.rows];
            const selected = [...prevState.selectedRows]
            if(selected.length === nextRows.length) return {rows: [], selectedRows : []};
            while(selected.length > 0) {
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
                        })
                        break;
                    }
                }                                             
            }

            return {rows: nextRows,
                selectedRows : [], dataModified: true};
        }, () => { 
            if(this.state.rows.length > 0 && this.state.rows.length * heightOfRow < document.getElementsByClassName("react-grid-Canvas")[0].scrollTop) {
                document.getElementsByClassName("react-grid-Canvas")[0].scrollTop = this.state.rows.length * heightOfRow;
            }
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
                };
                return { 
                    rows: nextRows,
                    dataModified: true
                };
            } else if(nextRows.length === 0) { //when array is empty
                newRow.uniqueLP = 1;
                nextRows.push(newRow);
                return { 
                    rows: nextRows, dataModified: true
                };
            }
        });
    
    };

    onAddAttribute = () => {
        this.setState({isOpenedAddAttribute: true});
    }

    onEditAttributes = () => {
        this.setState({isOpenedEditAttributes: true});
    }

    /* TUTAJ TO WRZUC POZNIEJ !!! */

    closeOnAddAttribute = () => {
        this.setState({
            isOpenedAddAttribute: false,
            attributeTypeSelected: '',
            attributePreferenceTypeSelected: '',
            valueTypeSelected: '',
            identifierTypeSelected: '',
            missingValueTypeSelected: '',
            attributesDomainElements: [],
        });
    }

    closeOnEditAttributes = () => {
        this.setState({
            isOpenedEditAttributes: false,
            
            /*
            attributeTypeSelected: '',
            attributePreferenceTypeSelected: '',
            valueTypeSelected: '',
            identifierTypeSelected: '',
            attributesDomainElements: [],
            */
        });
    }

    prepareMetadataFileBeforeSendingToServer() {
        const newMetadata = [...this.state.columns].map(({editable,sortable,resizable,filterable,visible,editor,filterRenderer,sortDescendingFirst,key,...others}) => others);
        if(newMetadata.length > 0) newMetadata.shift();
        return newMetadata;
    }

    prepareDataFileBeforeSendingToServer() {
        const newData = [...this.state.rows].map( ({uniqueLP, ...others}) => others);
        return newData;
    }
    
    sendFilesToServer = () => {
        const id_projektu = '2541bed3-63f3-4b88-88ba-543a2bb54f60';

        fetch(`localhost:8080/projects/${id_projektu}/metadata`, {
            method: 'PUT',
            body: JSON.stringify(this.prepareMetadataFileBeforeSendingToServer()),
        }).then(response => {
            console.log(response)
            return response.json()
        }).then(result => {
            console.log("Wynik dzialania response.json():")
            console.log(result)
        }).catch(err => {
            console.log(err)
        }).then(() => {

            fetch(`localhost:8080/projects/${id_projektu}/data`, {
                method: 'PUT',
                body: JSON.stringify(this.prepareDataFileBeforeSendingToServer())
            }).then(response => {
                console.log(response)
                return response.json()
            }).then(result => {
                console.log("Wynik dzialania response.json():")
                console.log(result)
            }).catch(err => {
                console.log(err)
            })
        })
        
    }

    saveToFile = () => {
        console.log("(Save file locally) button was clicked");
        //TO DO
    }


    getColumns() {
        const newColumns = this.state.columns.filter(x => x.visible !== false);
        return newColumns;
    }

    EmptyRowsView = () => {
        return (
            <div>
                <h5> There are no rows to display! </h5>
            </div>
        );
    };

    getSelectedAttributeType = (selected) => {
        this.setState({attributeTypeSelected: selected});
    }

    getSelectedAttributePreferenceType = (selected) => {
        console.log("Handle change (actually getSelected in parent)");
        this.setState({attributePreferenceTypeSelected: selected});
    }

    getSelectedValueType = (selected) => {
        this.setState({valueTypeSelected: selected});
    }

    getSelectedIdentifierType = (selected) => {
        this.setState({identifierTypeSelected: selected});
    }

    getSelectedMissingValueType = (selected) => {
        this.setState({missingValueTypeSelected: selected});
    }

    closeOpenedNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenedNotification: false,
        })
    }

    closeOpenedColumnHeaderMenu = (selected) => {
        console.log("W funkcji zamykania: " + this.state.columnKeyOfHeaderMenuOpened);
        if(selected !== undefined) {
            let cols = [...this.state.columns];
            for(let i=0; i<this.state.columns.length; i++) {
                if(this.state.columns[i].key === this.state.columnKeyOfHeaderMenuOpened) {
                    let col = {...cols[i]};

                    if(selected === "Mark attribute as: inactive" || selected === "Mark attribute as: active") {
                        col.active = !col.active;
                        cols[i] = col;
                    } else if(selected === "Delete attribute") {
                        cols.splice(i,1);
                    }

                    this.setState({
                        columns: cols,
                        isColumnHeaderMenuOpened: null,
                        columnKeyOfHeaderMenuOpened: -1,
                    })
                    
                    break;
                }
            }            
        } else {
            this.setState({
                isColumnHeaderMenuOpened: null,
                columnKeyOfHeaderMenuOpened: -1,
            })
        }
    }

    attributeAlreadyExists = (name) => {
        for(let i in this.state.columns) {
            if(this.state.columns[i].key === name) {
                return true;
            }
        }
        return false;
    }

    setDomainElements = (array) => {
        this.setState({
            attributesDomainElements: array,
        })
      }

    validateOnAddAttribute = (name, type, mvType, identifierType, preferenceType, valueType, domain) => {
        let error = ''

        //name validation (restricted + already exist)
        if(name === "uniqueLP" || name === "key") error = "You have chosen restricted name for the attribute! Please choose other name.";

        else if(this.attributeAlreadyExists(name)) error = "The attribute with the same name ("+name+") already exists! Please choose other name.";

        //type validation
        else if(type === '') error = "You didn't select any attribute type! Please select any.";
        
        else if(type !== "Identification") {
            //preference type validation
            if(preferenceType === '') error = "You didn't select any attribute preference type! Please select any.";

            //value type validation
            else if(valueType === '') error = "You didn't select any value type! Please select any.";

            //enumeration validation
            else if(valueType === "Enumeration") {
                if(domain.length === 0) error = "You have chosen enumeration type, but didn't provide any domain! Please add the domain to your enumeration value type.";

                for(let i=0; i<domain.length; i++) {
                    if(domain[i].text === "") {
                        error = "At least one attribute has empty domain! Please fill in the data.";
                        break;
                    }
                    const domainTmp = domain.map(x => x.text.trim());
                    
                    if(new Set(domainTmp).size !== domainTmp.length) {
                        error = "There are at least 2 attributes, which have the same domain name!  The domain name must be unique, so please rename them.";
                        break;
                    }
                }
            }
        }
        else {
            //identifier type validation
            if(identifierType === '') error = "You didn't select any identifier type! Please select any.";
        }
        
        this.setState({
            addAttributeErrorNotification: error,
        });  

        //everything was fine
        if(error === '') return true;

        //there are some errors
        return false;
    }

    createColumn = (name, active, type, mvType, identifierType, preferenceType, valueType, domain) => {
        const attribute = {editable:true, sortable:true, resizable:true, filterable:true, visible: true}
        attribute.key = name;
        attribute.name = name;
        attribute.active = active;
        if(type === "Identification") {
            attribute.identifierType = identifierType.toLowerCase();
        }
        else {
            attribute.type = type.toLowerCase();
            attribute.preferenceType = preferenceType.toLowerCase();
            attribute.valueType = valueType.toLowerCase();
            if(mvType === "MV 2") attribute.missingValueType = "mv2";
            else attribute.missingValueType = "mv1.5";
            
            if(attribute.valueType === "enumeration") {
                attribute.domain = domain.map(x => x.text.trim());
                attribute.editor = <DropDownEditor options={attribute.domain} />
            } else if(attribute.valueType === "integer" || attribute.valueType === "real") {
                attribute.filterRenderer = NumericFilter;
            }
        }
        return attribute;
    }

    setHeaderColorAndStyle = (column, idx) => {
        //color
        if(column.type !== undefined && !(/<\/?[a-z][\s\S]*>/i.test(column.type))) //make sure attribute type doesn't contain html tags
            document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(" + column.type +")");
        if(column.preferenceType === "gain")
            document.getElementsByClassName("react-grid-HeaderCell")[idx].style.backgroundColor = "#228B22";
        else if(column.preferenceType === "cost")
            document.getElementsByClassName("react-grid-HeaderCell")[idx].style.backgroundColor = "#DC143C";
        else {
            document.getElementsByClassName("react-grid-HeaderCell")[idx].style.backgroundColor = "gray";
        }
    }

    setHeaderRightClick = (column, idx) => {
        //right-click
        document.getElementsByClassName("react-grid-HeaderCell")[idx].oncontextmenu = (e) => {
            e.preventDefault();
            var isRightMB;
            e = e || window.event;
            if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                isRightMB = e.which == 3; 
            else if ("button" in e)  // IE, Opera 
                isRightMB = e.button == 2; 

            if(isRightMB) {
                this.setState({
                    isColumnHeaderMenuOpened: e.currentTarget,
                    columnKeyOfHeaderMenuOpened: column.key,
                })
                return(false);
            }
        }
    }

    setHeaderColorAndStyleAndRightClick = (column, idx) => {
        this.setHeaderColorAndStyle(column, idx);
        this.setHeaderRightClick(column, idx);
    }

    applyOnAddAttribute = (e) => {
        e.preventDefault();
        const validationOk = this.validateOnAddAttribute(e.target.attributeName.value, this.state.attributeTypeSelected, this.state.missingValueTypeSelected,
                    this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements)
        if(validationOk) {
            const newColumn = this.createColumn(e.target.attributeName.value, e.target.attributeIsActive.checked, this.state.attributeTypeSelected, 
                this.state.missingValueTypeSelected, this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements);

            this.setState( (prevState) => ({
                dataModified: true,
                isOpenedAddAttribute: false,
                attributeTypeSelected: '',
                attributePreferenceTypeSelected: '',
                valueTypeSelected: '',
                identifierType: '',
                missingValueTypeSelected: '',
                attributesDomainElements: [],
                columns: [...prevState.columns, newColumn]
            }),() => this.setHeaderColorAndStyleAndRightClick(this.state.columns[this.state.columns.length-1], this.state.columns.length-1)
            );   
        } else {
            this.setState({
                isOpenedNotification: true,
            });  
        }
    }

    displayAddAttributeFields = () => {
        const tmp = [];
        tmp.push(<FormControlLabel
            control={<Checkbox defaultChecked={true} color="primary" style={{float: "left", width: "65%"}} name="attributeIsActive"/* onChange={handleChange('checkedB')}*//>}
            label="Active"
            labelPlacement="start"
            key="attributeIsActive"
        />)
        tmp.push(<ValidationTextField label="Name" required variant="outlined" id="attributeName" key="attributeName" defaultValue="" />)
        tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key="attributeType" displayName={"Type"} items={["Identification","Description","Condition","Decision"]}/>)

        if(this.state.attributeTypeSelected !== "Identification") {
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedMissingValueType} name={"missingValueType"} key="missingValueType" displayName={"Missing value type"} defaultValue="MV 2" items={["MV 1.5","MV 2"]}/>)
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributePreferenceType} name={"attributePreferenceType"} key="attributePreferenceType" displayName={"Preference type"} items={["None","Cost","Gain"]}/>)
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedValueType} name={"valueType"} displayName={"Value type"} key="valueType" items={["Integer","Real","Enumeration"]}/>)
            if(this.state.valueTypeSelected === "Enumeration")
            {
                tmp.push(<div className="attributeDomainWrapper" key="attributeDomainWrapper"><div className="attributeDomain"> <AttributeDomain setDomainElements={this.setDomainElements}/> </div> </div>)
            }
        } else if(this.state.attributeTypeSelected === "Identification") { 
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedIdentifierType} name={"identifierType"} displayName={"Identifier type"} key="identifierType" items={["UUID","Text"]}/>)
        }
      
        if(tmp.length !== 0) return tmp;
        return ;
    }

    editAttributes = () => {
       
    }

    displayColumnHeaderMenu = () => {
        if(this.state.isColumnHeaderMenuOpened && this.state.columnKeyOfHeaderMenuOpened !== "uniqueLP") { //don't touch No. column
            const tmp = [];
            for(let i=0; i<this.state.columns.length; i++) {
                if(this.state.columns[i].key === this.state.columnKeyOfHeaderMenuOpened) {
                    if(this.state.columns[i].active)
                        tmp.push("Mark attribute as: inactive");
                    else if(this.state.columns[i].active === false)
                        tmp.push("Mark attribute as: active");

                    break;
                }
            }

            tmp.push("Delete attribute");

            return <ColumnHeaderMenu items={tmp} handleClose={this.closeOpenedColumnHeaderMenu} anchorEl={this.state.isColumnHeaderMenuOpened} />
        }
        return null;
    }

    getValidFilterValues(rows, columnId) {
        return rows.map(r => r[columnId]).filter((item, i, a) => {
            return i === a.indexOf(item);
        });
    }

    render() {        
        return (
            <div >              
                <ReactDataGrid
                    ref={(node) => this.grid = node}
                    columns={this.getColumns()}
                    rowGetter={i => this.filteredRows()[i]}
                    rowsCount={this.filteredRows().length}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    onGridSort = {this.onGridSort}
                    enableCellSelect={true}
                    getValidFilterValues={columnKey => this.getValidFilterValues(this.state.rows, columnKey)}
                    toolbar={<EditDataFilterButton enableFilter={true} > 
                                < EditDataButtons deleteRow={this.deleteSelectedRows} insertRow={this.insertRow} 
                                        sendFilesToServer={this.sendFilesToServer} saveToFile={this.saveToFile}
                                        onAddAttribute={this.onAddAttribute} onEditAttributes={this.onEditAttributes} modified={this.state.dataModified} /> 
                            </EditDataFilterButton> }
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
                    rowHeight={heightOfRow}
                    rowScrollTimeout={200}
                    headerRowHeight={heightOfHeaderRow}
                    contextMenu={
                        <RightClickContextMenu
                          onRowDelete={(e, { rowIdx }) => this.deleteRowByRowIdx(rowIdx)}
                          onRowInsertAbove={(e, { rowIdx }) => this.insertRow(rowIdx, "above")}
                          onRowInsertBelow={(e, { rowIdx }) => this.insertRow(rowIdx, "below")}
                        />
                      }
                      RowsContainer={ContextMenuTrigger}
                      emptyRowsView={this.EmptyRowsView}
                />
                
                <Dialog open={this.state.isOpenedAddAttribute} onClose={this.closeOnAddAttribute} aria-labelledby="add-attribute-dialog">
                    <DialogTitle id="add-attribute-dialog">Add new attribute</DialogTitle>
                    <form onSubmit={this.applyOnAddAttribute}>
                    <DialogContent>
                        <DialogContentText>
                            This is the place where you can add new attribute
                        </DialogContentText>
                        <div className="nicelyInColumn">
                            {this.displayAddAttributeFields()}
                            {
                                this.state.addAttributeErrorNotification !== '' ? <Notification open={this.state.isOpenedNotification} 
                                closeOpenedNotification={this.closeOpenedNotification} message={this.state.addAttributeErrorNotification} variant={"error"} /> : null
                            }                        
                        </div>        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeOnAddAttribute} color="primary"> Cancel </Button>
                        <Button type="submit" color="primary" disabled={false}> Apply </Button>
                    </DialogActions>
                    </form>
                </Dialog>

                <Dialog open={this.state.isOpenedEditAttributes} onClose={this.closeOnEditAttributes} aria-labelledby="edit-attributes-dialog">
                    <DialogTitle id="add-attribute-dialog">Add new attribute</DialogTitle>
                    <form onSubmit={this.applyOnAddAttribute}>
                    <DialogContent>
                        <DialogContentText>
                            This is the place where you can add new attribute
                        </DialogContentText>
                        <div className="nicelyInColumn">
                            {this.displayAddAttributeFields()}
                            {
                                this.state.addAttributeErrorNotification !== '' ? <Notification open={this.state.isOpenedNotification} 
                                closeOpenedNotification={this.closeOpenedNotification} message={this.state.addAttributeErrorNotification} variant={"error"} /> : null
                            }                        
                        </div>        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeOnEditAttributes} color="primary"> Cancel </Button>
                        <Button type="submit" color="primary" disabled={false}> Apply </Button>
                    </DialogActions>
                    </form>
                </Dialog>
                
                {this.displayColumnHeaderMenu()};

            </div>
        )
    }
}

export default DisplayData;