import React from 'react';
import ReactDataGrid from 'react-data-grid';
import 'bootstrap/dist/css/bootstrap.css';
import { Editors,  Data, Menu, Filters} from 'react-data-grid-addons';

import './DisplayData.css';
import EditDataButtons from './EditDataButtons';
import EditDataFilterButton from './EditDataFilterButton'

import DropDownForAttributes from './DropDownForAttributes';
import Notification from './Notification';
import AttributeDomain from './AttributeDomain';
import ColumnHeaderMenu from './ColumnHeaderMenu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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
import { DraggableHeader } from 'react-data-grid-addons';

const selectors = Data.Selectors;
const { NumericFilter } = Filters;
const { DropDownEditor } = Editors;
const { ContextMenu, MenuItem, ContextMenuTrigger } = Menu;
const { DraggableContainer } = DraggableHeader;

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
            rows: this.prepareDataFromImport(this.props.data),
            columns: this.prepareMetaDataFromImport(this.props.metadata),
            enableRowInsert: 0, //-1 no sort, 0-sort asc, 1-sort desc
            selectedRows: [],
            filters: {},
            dataModified: false,

            isOpenedAddAttribute: false,
            isOpenedEditAttributes: false,
            isOpenedSaveToFile: false,
            saveToFileWhichFile: '',
            saveToFileWhichFormat: '',
            
            editAttributeSelected: '', //name of selected attribute
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
            
        };
    }

    prepareDataFromImport = (data) => {
        let tmp = [...data];
        let maxUniqueLP = 1;
        tmp.forEach(x => { x.uniqueLP = maxUniqueLP++ })
        return tmp;
    }

    prepareMetaDataFromImport = (metadata) => {
        const tmp = [{key: "uniqueLP", name: "No.", sortable: true, resizable: true, filterable: true, draggable: true, sortDescendingFirst: true, width: 160, filterRenderer: NumericFilter, visible: true}];
        
        for(let el in metadata) {
            if(metadata[el].name === "uniqueLP") { //restricted name (brute force change the first letter to uppercase)
                metadata[el].name = "UniqueLP";
            }            
            const attribute = {editable:true, sortable:true, resizable:true, filterable:true, draggable: true, visible: true};
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
            tmp.push(attribute)
        }
        return tmp; 
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
            editAttributeSelected: '',
            attributeTypeSelected: '',
            attributePreferenceTypeSelected: '',
            valueTypeSelected: '',
            identifierTypeSelected: '',
            missingValueTypeSelected: '',
            attributesDomainElements: [],
        });
    }

    prepareMetadataFileBeforeSendingToServer() {
        const newMetadata = [...this.state.columns].map(({editable,sortable,resizable,filterable,visible,draggable,editor,filterRenderer,sortDescendingFirst,key,...others}) => others);
        if(newMetadata.length > 0) newMetadata.shift();
        return newMetadata;
    }

    prepareDataFileBeforeSendingToServer() {
        const newData = [...this.state.rows].map( ({uniqueLP, ...others}) => others);
        return newData;
    }
    
    sendFilesToServer = () => {
        fetch(`http://localhost:8080/projects/${this.props.project.id}/metadata`, {
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

            fetch(`http://localhost:8080/projects/${this.props.project.id}/data`, {
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

        this.setState({
            dataModified: false,
        })
        
    }

    handleChangeSaveToFileWhichFile = (e) => {
        this.setState({
            saveToFileWhichFile: e.target.value,
        })
    }

    handleChangeSaveToFileWhichFormat = (e) => {
        this.setState({
            saveToFileWhichFormat: e.target.value,
        })
    }

    closeOnSaveToFile = () => {
        this.setState({
            isOpenedSaveToFile: false,
            saveToFileWhichFile: '',
            saveToFileWhichFormat: '',
        })
    }

    saveToFileDialog = () => {
        this.setState({
            isOpenedSaveToFile: true,
        })
    }

    saveToFile = () => {
        if(this.state.saveToFileWhichFormat === "json") {
            if(this.state.saveToFileWhichFile === "data") this.saveToJsonFile(this.prepareDataFileBeforeSendingToServer(), "data.json");
            else if(this.state.saveToFileWhichFile === "metadata") this.saveToJsonFile(this.prepareMetadataFileBeforeSendingToServer(), "metadata.json");
            else if(this.state.saveToFileWhichFile === "both") {
                this.saveToJsonFile(this.prepareMetadataFileBeforeSendingToServer(), "metadata.json");
                this.saveToJsonFile(this.prepareDataFileBeforeSendingToServer(), "data.json");                
            }
        } else if(this.state.saveToFileWhichFormat === "csv") {
            if(this.state.saveToFileWhichFile === "data") this.saveToCSVFile();
            else if(this.state.saveToFileWhichFile === "metadata") this.saveToCSVFile();
            else if(this.state.saveToFileWhichFile === "both") {
                this.saveToCSVFile();
                this.saveToCSVFile();
            }
        }
        this.setState({
            isOpenedSaveToFile: false,
            saveToFileWhichFile: '',
            saveToFileWhichFormat: '',
        })
    } 

    saveToCSVFile = () => {
        this.setState({
            isOpenedSaveToFile: false,
        })

    }

    saveToJsonFile = (data, filename) => {
        const blob = new Blob([JSON.stringify(data, null, 1)], {type: "application/json"});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style = "display: none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
        if(selected !== undefined) {
            let cols = [...this.state.columns];
            for(let i=0; i<this.state.columns.length; i++) {
                if(this.state.columns[i].key === this.state.columnKeyOfHeaderMenuOpened) {
                    let col = {...cols[i]};
                    let didIRemoveColumn = false;
                    if(selected === "Mark attribute as: inactive" || selected === "Mark attribute as: active") {
                        col.active = !col.active;
                        cols[i] = col;
                    } else if(selected === "Duplicate column") {
                        //cols.splice(i+1,0,col);
                    } else if(selected === "Delete attribute") {
                        cols.splice(i,1);
                        didIRemoveColumn = true;
                    }

                    this.setState({
                        columns: cols,
                        isColumnHeaderMenuOpened: null,
                        columnKeyOfHeaderMenuOpened: -1,
                    },() => {if(!didIRemoveColumn) this.setHeaderColorAndStyle(cols[i],i)});
                    
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
            if(this.state.columns[i].name === name) {
                return true;
            }
        }
        return false;
    }

    attributeAlreadyExistAndIsDifferentThanSelected(name) {
        for(let i in this.state.columns) {
            if(this.state.columns[i].name === name && this.state.editAttributeSelected !== name) {
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

    validateOnAddAndEditAttribute = (isOnAddMethod, name, type, mvType, identifierType, preferenceType, valueType, domain) => {

        let error = ''

        //name validation (restricted + already exist)
        if(name === "uniqueLP" || name === "key") error = "You have chosen restricted name for the attribute! Please choose other name.";

        if(isOnAddMethod) { //add new column
            if(this.attributeAlreadyExists(name)) error = "The attribute with the same name ("+name+") already exists! Please choose other name.";
        } else { //change existing column
            if(this.attributeAlreadyExistAndIsDifferentThanSelected(name)) error = "The attribute with the same name ("+name+") already exists! Please choose other name.";
        }
        
            //type validation
            if(type === '') error = "You didn't select any attribute type! Please select any.";
            
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

                        if(error === '') {
                            const domainTmp = domain.map(x => x.text.trim());
                            if(new Set(domainTmp).size !== domainTmp.length) {
                                error = "There are at least 2 attributes, which have the same domain name! The domain name must be unique, so please rename them.";
                                break;
                            }
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
        const attribute = {editable:true, sortable:true, resizable:true, filterable:true, draggable: true, visible: true}
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
        const tmp = document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes;
        if(column.type !== undefined && !(/<\/?[a-z][\s\S]*>/i.test(column.type))) { //make sure attribute type doesn't contain html tags
            if(tmp.length === 2) {
                if(column.active) document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(" + column.type + ",active)");
                else document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(" + column.type + ",inactive)");
            } else if(tmp.length > 2) {
                if(column.active) document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes[3].textContent = "(" + column.type + ",active)";
                else document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes[3].textContent = "(" + column.type + ",inactive)";
            }
        }

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
        const validationOk = this.validateOnAddAndEditAttribute(true,e.target.attributeName.value.trim(), this.state.attributeTypeSelected, this.state.missingValueTypeSelected,
                    this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements)
        if(validationOk) {
            const newColumn = this.createColumn(e.target.attributeName.value.trim(), e.target.attributeIsActive.checked, this.state.attributeTypeSelected, 
                this.state.missingValueTypeSelected, this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements);

            this.setState( (prevState) => ({
                dataModified: true,
                isOpenedAddAttribute: false,
                attributeTypeSelected: '',
                attributePreferenceTypeSelected: '',
                valueTypeSelected: '',
                identifierTypeSelected: '',
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
            control={<Checkbox defaultChecked={true} color="primary" style={{float: "left", width: "65%"}} name="attributeIsActive"/>}
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

    handleListItemClick = (e) => {
        const selectedItem = e.currentTarget.dataset.value;
        this.setState( (prevState) => {
            if(prevState.editAttributeSelected !== selectedItem) {
                return { 
                    editAttributeSelected: selectedItem,
                    attributeTypeSelected: '',
                    attributePreferenceTypeSelected: '',
                    valueTypeSelected: '',
                    identifierTypeSelected: '',
                    missingValueTypeSelected: '',
                    attributesDomainElements: [],
                };
            }          
        })
    }

    applyOnEditAttributes = (e) => {
        e.preventDefault();
        let cols = [...this.state.columns];
        let i=0;
        for(i=0; i<cols.length; i++) {
            if(cols[i].name === this.state.editAttributeSelected) break;
        }
        let col = {...cols[i]} //copy all attributes

        const validationOk = this.validateOnAddAndEditAttribute(false,e.target.attributeName.value.trim(), this.state.attributeTypeSelected, this.state.missingValueTypeSelected,
            this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements)
        
        if(validationOk) {
            col.key = e.target.attributeName.value.trim();
            col.name = e.target.attributeName.value.trim();
            col.active = e.target.attributeIsActive.checked;
            if(this.state.attributeTypeSelected === "Identification") {
                col.identifierType = this.state.identifierTypeSelected.toLowerCase();  
            } else {
                col.type = this.state.attributeTypeSelected.toLowerCase();
                col.preferenceType = this.state.attributePreferenceTypeSelected.toLowerCase();
                col.valueType = this.state.valueTypeSelected.toLowerCase();
                if(this.state.missingValueTypeSelected === "MV 2") col.missingValueType = "mv2";
                else col.missingValueType = "mv1.5";

                if(col.valueType === "enumeration") {
                    col.domain = this.state.attributesDomainElements.map(x => x.text.trim());
                    col.editor = <DropDownEditor options={col.domain} />
                } else if(col.valueType === "integer" || col.valueType === "real") {
                    col.filterRenderer = NumericFilter;
                }
            }
            cols[i] = col;

            this.setState({
                dataModified: true,
                editAttributeSelected: '',
                isOpenedEditAttributes: false,
                attributeTypeSelected: '',
                attributePreferenceTypeSelected: '',
                valueTypeSelected: '',
                identifierTypeSelected: '',
                missingValueTypeSelected: '',
                attributesDomainElements: [],
                columns: cols,
            },() => this.setHeaderColorAndStyleAndRightClick(this.state.columns[i], i)
            );   
        } else {
            this.setState({
                isOpenedNotification: true,
            });  
        }
    }

    displayListOfAttributesForModification = () => {
       const tmp = [];
        for(let i=0; i<this.state.columns.length; i++) {
            if(this.state.columns[i].key !== "uniqueLP") {
                tmp.push(this.state.columns[i]);
            }
        }
        
        return tmp;
    }

    displayFieldsOfSelectedAttribute = () => {
        let attribute;
        for(let i=0; i<this.state.columns.length; i++) {if(this.state.editAttributeSelected === this.state.columns[i].name) { attribute = {...this.state.columns[i]}; break;}}
        
        const tmp = [];
        
        tmp.push(<FormControlLabel
            control={<Checkbox defaultChecked={attribute.active} color="primary" style={{float: "left", width: "65%"}} name="attributeIsActive"/>}
            label="Active"
            labelPlacement="start"
            key={"attributeIsActive"+attribute.name}
        />)
        tmp.push(<ValidationTextField label="Name" required variant="outlined" id="attributeName" key={"attributeName"+attribute.name} defaultValue={attribute.name} />)

        if((this.state.attributeTypeSelected === '' && this.state.valueTypeSelected === '') || (this.state.attributeTypeSelected.toLowerCase()===attribute.type && this.state.valueTypeSelected.toLowerCase() === attribute.valueType)   /*|| (this.state.attributeTypeSelected.toLowerCase()===attribute.type && this.state.valueTypeSelected === '') //nothing has changed
            || (this.state.attributeTypeSelected === '' && this.state.valueTypeSelected.toLowerCase() === attribute.valueType) || (this.state.attributeTypeSelected.toLowerCase()===attribute.type && this.state.valueTypeSelected.toLowerCase() === attribute.valueType) */
            || (this.state.attributeTypeSelected === 'Identification' && attribute.preferenceType === undefined)) { 

            if(attribute.identifierType !== '' && attribute.type === undefined) { //if it's identifier attribute
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key={"attributeType"+attribute.name} defaultValue={"Identification"} displayName={"Type"} items={["Identification","Description","Condition","Decision"]}/>) 
                
                if(attribute.identifierType.toLowerCase() === 'uuid') {
                    tmp.push(<DropDownForAttributes getSelected={this.getSelectedIdentifierType} name={"identifierType"} key={"identifierType"+attribute.name} defaultValue={"UUID"} displayName={"Identifier type"}  items={["UUID","Text"]}/>)
                }
                else { 
                    tmp.push(<DropDownForAttributes getSelected={this.getSelectedIdentifierType} name={"identifierType"} key={"identifierType"+attribute.name} defaultValue={"Text"} displayName={"Identifier type"}  items={["UUID","Text"]}/>) 
                }
            } else { //it's not identifier attribute
                
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key={"attributeType"+attribute.name} defaultValue={attribute.type.charAt(0).toUpperCase() + attribute.type.slice(1)} displayName={"Type"} items={["Identification","Description","Condition","Decision"]}/>)

                if(attribute.missingValueType === "mv2") {
                    tmp.push(<DropDownForAttributes getSelected={this.getSelectedMissingValueType} name={"missingValueType"} key={"missingValueType"+attribute.name} displayName={"Missing value type"} defaultValue="MV 2" items={["MV 1.5","MV 2"]}/>)
                }
                else {
                    tmp.push(<DropDownForAttributes getSelected={this.getSelectedMissingValueType} name={"missingValueType"} key={"missingValueType"+attribute.name} displayName={"Missing value type"} defaultValue="MV 1.5" items={["MV 1.5","MV 2"]}/>)
                }
                
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributePreferenceType} name={"attributePreferenceType"} key={"attributePreferenceType"+attribute.name} defaultValue={attribute.preferenceType.charAt(0).toUpperCase() + attribute.preferenceType.slice(1)} displayName={"Preference type"} items={["None","Cost","Gain"]}/>)

                tmp.push(<DropDownForAttributes getSelected={this.getSelectedValueType} name={"valueType"} displayName={"Value type"} key={"valueType"+attribute.name} defaultValue={attribute.valueType.charAt(0).toUpperCase() + attribute.valueType.slice(1)} items={["Integer","Real","Enumeration"]}/>)

                if(attribute.valueType === "enumeration")
                {
                    const domain = []
                    attribute.domain.forEach( (x, index) => {
                        domain.push({id: index, text: x});
                    })
                    tmp.push(<div className="attributeDomainWrapper" key={"attributeDomainWrapper"+attribute.name}><div className="attributeDomain"> <AttributeDomain setDomainElements={this.setDomainElements} defaultValue={domain}/> </div> </div>)
                }
            }
        } else if(this.state.attributeTypeSelected !== attribute.type) { //attribute type has changed (everything under it - rerender with empty values)
            
            if(this.state.attributeTypeSelected !== "Identification") {
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key={"attributeType"+attribute.name} displayName={"Type"} items={["Identification","Description","Condition","Decision"]}/>)
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedMissingValueType} name={"missingValueType"} key={"missingValueType"+attribute.name} defaultValue="MV 2" displayName={"Missing value type"} items={["MV 1.5","MV 2"]}/>)
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributePreferenceType} name={"attributePreferenceType"} key={"attributePreferenceType"+attribute.name} displayName={"Preference type"} items={["None","Cost","Gain"]}/>)
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedValueType} name={"valueType"} displayName={"Value type"} key={"valueType"+attribute.name} items={["Integer","Real","Enumeration"]}/>)
                if(this.state.valueTypeSelected === "Enumeration")
                {
                    tmp.push(<div className="attributeDomainWrapper" key={"attributeDomainWrapper"+attribute.name}><div className="attributeDomain"> <AttributeDomain setDomainElements={this.setDomainElements}/> </div> </div>)
                }
            } else if(this.state.attributeTypeSelected === "Identification") { 
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key={"attributeType"+attribute.name} displayName={"Type"} defaultValue={"Identification"} items={["Identification","Description","Condition","Decision"]}/>)
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedIdentifierType} name={"identifierType"} displayName={"Identifier type"} key={"identifierType"+attribute.name} items={["UUID","Text"]}/>)
            }
        } else if(this.state.valueTypeSelected !== attribute.valueType) {
            if(this.state.valueTypeSelected === "Enumeration")
            {
                tmp.push(<div className="attributeDomainWrapper" key={"attributeDomainWrapper"+attribute.name}><div className="attributeDomain"> <AttributeDomain setDomainElements={this.setDomainElements}/> </div> </div>)
            }
        }
      
        return tmp;
    }

    

    displayColumnHeaderMenu = () => {
        if(this.state.isColumnHeaderMenuOpened && this.state.columnKeyOfHeaderMenuOpened !== "uniqueLP") { //don't touch No. column
            const tmp = [];
            for(let i=0; i<this.state.columns.length; i++) {
                if(this.state.columns[i].key === this.state.columnKeyOfHeaderMenuOpened) {
                    if(this.state.columns[i].identifierType === undefined) {
                        if(this.state.columns[i].active)
                            tmp.push("Mark attribute as: inactive");
                        else if(this.state.columns[i].active === false)
                            tmp.push("Mark attribute as: active");
                    }

                    break;
                }
            }

            tmp.push("Duplicate column");
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

    onColumnHeaderDragDrop = (source, target) => {
        const newColumns = [...this.state.columns];
        const columnSourceIndex = this.state.columns.findIndex((i) => i.key === source);
        const columnTargetIndex = this.state.columns.findIndex((i) => i.key === target);
        newColumns.splice(columnTargetIndex,0,newColumns.splice(columnSourceIndex, 1)[0]);
           
        const emptyColumns = [];
        this.setState({ columns: emptyColumns });
        this.setState({ 
            columns: newColumns
        }, () => this.state.columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx))
        )        
    };

    render() {        
        return (
            <div >      
                <DraggableContainer onHeaderDrop={this.onColumnHeaderDragDrop}>   
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
                                        sendFilesToServer={this.sendFilesToServer} saveToFileDialog={this.saveToFileDialog}
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
                      //emptyRowsView={this.EmptyRowsView}
                />
                </DraggableContainer>     
                
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
                    <DialogTitle id="edit-attributes-dialog">Edit attributes</DialogTitle>
                    <form onSubmit={this.applyOnEditAttributes}>
                    <DialogContent>
                        <DialogContentText>
                            Choose attribute to edit. <br/> Please note that you can apply changes only to the selected attribute.
                        </DialogContentText>
                        <div className="nicelyInColumn">
                            <List component="nav" aria-label="display attributes"> 
                            {this.displayListOfAttributesForModification().map(x => (
                                <ListItem button data-value={x.name} key={x.key} selected={this.state.editAttributeSelected === x.name} onClick={this.handleListItemClick} >
                                    <ListItemText primary={x.name}/>
                                </ListItem>))}
                            </List>
                        </div>
                        <div className="editAttributesValues">
                            {this.state.editAttributeSelected !== '' ? this.displayFieldsOfSelectedAttribute() : null}    
                            {
                                this.state.addAttributeErrorNotification !== '' ? <Notification open={this.state.isOpenedNotification} 
                                closeOpenedNotification={this.closeOpenedNotification} message={this.state.addAttributeErrorNotification} variant={"error"} /> : null
                            }                        
                        </div>        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeOnEditAttributes} color="primary"> Cancel </Button>
                        <Button type="submit" color="primary" disabled={this.state.editAttributeSelected === ''}> Apply </Button>
                    </DialogActions>
                    </form>
                </Dialog>


                <Dialog fullWidth={true} maxWidth={"sm"} open={this.state.isOpenedSaveToFile} onClose={this.closeOnSaveToFile} aria-labelledby="save-files-dialog">
                    <DialogTitle id="alert-dialog-title">{"Choose type and format to be saved in."}</DialogTitle>
                    <DialogContent>
                        When selected "Both" the first downloaded file will be "Metadata" and then the second one "Data" 
                    
                    <RadioGroup className={"radio-button-group-save-file"} aria-label="file" name="file" value={this.state.saveToFileWhichFile} onChange={this.handleChangeSaveToFileWhichFile}>
                        <FormControlLabel value="data" control={<Radio color="primary"/>} label="Data" />
                        <FormControlLabel value="metadata" control={<Radio color="primary" />} label="Metadata" />
                        <FormControlLabel value="both" control={<Radio color="primary"/>} label="Both" />
                    </RadioGroup>
                    
                    <RadioGroup className={"radio-button-group-save-file"} aria-label="format" name="format" value={this.state.saveToFileWhichFormat} onChange={this.handleChangeSaveToFileWhichFormat}>
                        <FormControlLabel value="csv" control={<Radio color="primary"/>} label="CSV" />
                        <FormControlLabel value="json" control={<Radio color="primary" />} label="JSON" />
                    </RadioGroup>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.closeOnSaveToFile} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={this.saveToFile} color="primary" autoFocus variant="outlined" 
                            disabled={!(this.state.saveToFileWhichFormat!=='' && this.state.saveToFileWhichFile!=='')}>
                        Ok
                    </Button>
                    </DialogActions>
                </Dialog>
                
                {this.displayColumnHeaderMenu()}

            </div>
        )
    }
}

DisplayData.defaultProps = {
    data: [],
    metadata: [],
    project: {id: '2541bed3-63f3-4b88-88ba-543a2bb54f60', name: '', files: []},
};
  
export default DisplayData;