import React from 'react';
import ReactDataGrid from 'react-data-grid';

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
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { DraggableHeader } from 'react-data-grid-addons';
import PropTypes from 'prop-types';
import RuleWorkLoadingIcon from './RuleWorkLoadingIcon';

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

/**
 * Component responsible for displaying data i.e. attributes and objects, which are received from
 * the import tab via props (more specifically props.project.informationTable)
 * @class
 * @param {Object} props Arguments received from the parent component
 * @param {Object} props.project Holds data about the current project like id, name and everything associated with the project e.g. information table, unions, cones etc.
 * @param {Object} props.project.result.informationTable InformationTable received from the server, holds attributes and objects
 * @param {Array} props.project.result.informationTable.attributes Attributes (metadata, might be empty)
 * @param {Array} props.project.result.informationTable.objects Objects (data, might be empty)
 * @param {Function} props.updateProject Method for updating project in the parent component (which is ProjectTabs.js)
 */
class DisplayData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: this.prepareDataFromImport(this.props.project.result.informationTable.objects),
            columns: this.prepareMetaDataFromImport(this.props.project.result.informationTable.attributes),
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

            isLoading: false,
            isOpenedTransform: false,
            binarizeNominalAttributesWith3PlusValues: false,
        };    
        
        this._isMounted = false;
    }

    /**
     * Method responsible for catching errors
     */
    componentDidCatch(error, info) {
        console.log(error);
        console.log(info);
    }

    /**
     * Method responsible for changing displayed data when project is changed. Runs after every [render()]{@link DisplayData#render} and holds the newest values of props and state.
     * If the project has been changed then initialize all the values (overwrite) in the state.
     * @param {Object} prevProps Props object containing all the props e.g. props.project.id or props.project.name
     * @param {Object} prevState State object containing all the properties from state e.g. state.columns or state.rows
     */
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.project.result.id !== this.props.project.result.id) {
            this.setState({
                columns: this.prepareMetaDataFromImport(this.props.project.result.informationTable.attributes),
                rows: this.prepareDataFromImport(this.props.project.result.informationTable.objects),

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

                isLoading: false,
                isOpenedTransform: false,
                binarizeNominalAttributesWith3PlusValues: false
            }, () => this.state.columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx)))
        }
    }

    /** 
     * Method responsible for preparing data i.e. objects to display them in rows. This is the place where No. property is added to each object.
     * @method
     * @param {Array} data Data i.e. objects received from the import. Each object consists of pairs key-value with name of the property as the key and value as the value. 
     * @returns {Array}
     */
    prepareDataFromImport = (data) => {
        let tmp = [...data];
        let maxUniqueLP = 1;
        tmp.forEach(x => { x.uniqueLP = maxUniqueLP++ })
        return tmp;
    }

    /** 
     * Method responsible for preparing metadata i.e. attributes to display them in columns. This is the place where certain properties are added to each attribute
     * e.g. sorting, filtering, resizing etc.
     * @method
     * @param {Array} metadata I.e. attributes received from the import. Each attribute consists of pairs key-value with name of the property as the key and value as the value. 
     * @returns {Array}
     */
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
                attribute.width = Math.max(100, 20 + 10*metadata[el].name.length, 20+10*(metadata[el].type.length + 9));
                attribute.preferenceType = metadata[el].preferenceType;
                attribute.valueType = metadata[el].valueType;
                if(attribute.valueType === "enumeration") {
                    attribute.domain = metadata[el].domain;
                    if(!attribute.domain.includes("?")) attribute.domain.push("?");
                    attribute.editor = <DropDownEditor options={attribute.domain} />;
                } else if(attribute.valueType === "integer" || attribute.valueType === "real") {
                    attribute.filterRenderer = NumericFilter;
                }
            }
            tmp.push(attribute)
        }
        return tmp; 
    }

    /** 
     * Method responsible for setting the color of column headers accordingly to the attribute preference type during initialization of the component.
     * Runs only once, after component is mounted (after first [render]{@link DisplayData#render} and before methods shouldComponentUpdate() and [componentDidUpdate]{@link DisplayData#componentDidUpdate}).
     */
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
        this._isMounted = true;
    }

    componentWillUnmount() {
        if(this.state.dataModified) {
            const tmpMetaData = this.prepareMetadataFileBeforeSendingToServer();
            const tmpData = this.prepareDataFileBeforeSendingToServer();
            const tmpProject = {...this.props.project}
            tmpProject.result.informationTable.attributes = tmpMetaData;
            tmpProject.result.informationTable.objects = tmpData;
            this.props.updateProject(tmpProject);
        }
        this._isMounted = false;
    }

    /** 
     * Method responsible for updating displayed data when the value in the cell changes (or multiple values when dragging). First row has index 0.
     * @method
     * @param {Number} fromRow Indicates which row have been changed (or when dragging - from which row dragging has began).
     * @param {Number} toRow Indicates on which row dragging has ended (or if the number is the same as fromRow, then which row has been changed) inclusive.
     * @param {Object} updated Indicates on which column and to which value changes happend. 
     * It is a pair key - value, where the key is the column key and the value is the value of the cell to which the cell has been changed.
     */
    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        if(toRow - fromRow > 100) {
            this.setState({
                loading: true
            });   

            setTimeout(() => {
                const rows = [...this.state.rows]
                const filtered = this.filteredRows();
                for (let i = fromRow; i <= toRow; i++) {
                    const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                    rows[rows_index] = { ...filtered[i], ...updated };
                }

                this.setState({
                    rows: rows, 
                    dataModified: true,
                    loading: false
                })
            })
        } else {
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

        }
    };

    /** 
     * Method responsible for sorting data. Runs when the header of the column is clicked.
     * @method
     * @param {String} sortColumn Indicates which column header has been clicked i.e. which column should be sorted. This is the column key.
     * @param {Number} sortDirection Indicates which way sorting should take place. This is one of the values "ASC", "DESC", "NONE", which stand for ascending, descending and none.
     */
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

    /** 
     * Method responsible for adding selected, i.e. the checkbox on the left of the row is marked, rows to the selectedRows array which is in the state.
     * @method
     * @param {Array} rows Indicates which row has been selected. It consists of two objects. The first one is rowIdx, which is the number of row from the top (indexing from 0).
     * The second object is row object containg all the pairs key-value for the row.
     */
    onRowsSelected = (rows) => {
        this.setState( (prevState) => ({ 
            selectedRows: prevState.selectedRows.concat(rows.map(r => r.row.uniqueLP))
        }));
    };

    /**
     * Method responsible for removing deselected, i.e. the checkbox on the left of the row is unmarked, rows from the selectedRows array which is in the state.
     * @method
     * @param {Array} rows Indicates which row has been deselected. It consists of two objects. The first one is rowIdx, which is the number of row from the top (indexing from 0).
     * The second object is row object containg all the pairs key-value for the row.
     */
    onRowsDeselected = (rows) => {
        let rowIndexes = rows.map(r => r.row.uniqueLP);
        
        this.setState( prevState => ({
            selectedRows: prevState.selectedRows.filter(
                i => rowIndexes.indexOf(i) === -1
            )
        }));
    };

    /**
     * Method responsible for adding filter to filters array which is in the state.
     * @method
     * @param {Object} filter Consists of two objects. The first one is the column object containg all the pairs key-value for the column.
     * The second object is flterTerm which has been written in the filter field.
     */
    handleFilterChange = (filter) => {
        this.setState(prevState => {
            const newFilters = { ...prevState.filters };
            if (filter.filterTerm) {
                newFilters[filter.column.key] = filter;
            } else {
                delete newFilters[filter.column.key];
            }
            return { 
                filters: newFilters,
                selectedRows : []
            };
        });
    };

    /**
     * Helper method to get all the filtered rows. This method uses [selectors]{@link https://adazzle.github.io/react-data-grid/docs/examples/column-filtering#using-rdg-dataselectors-to-filter-rows}
     * @method
     * @param {Array} rows All the rows i.e. this is the array containing all the rows where each row (object of the array) consists of key-value pairs
     * @param {Array} filters All the filters i.e. this is the array containing [filter objects]{@link DisplayData#handleFilterChange}
     */
    getRows(rows, filters) {
        return selectors.getRows({ rows, filters });
    }

    /**
     * Method responsible for getting all the filtered rows. Uses method [getRows]{@link DisplayData#getRows}.
     * @method
     */
    filteredRows = () => {
        return this.getRows(this.state.rows, this.state.filters);
    }

    /**
     * Method responsible for clearing filters.
     * @method
     */
    onClearFilters = () => {
        this.setState({
            filters: {},
            selectedRows: []
        })
    }

    /**
     * Method responsible for removing certain row after choosing option "Delete example" from right click menu.
     * @method
     * @param {Number} rowIdx Indicates the row number from the top, to be removed.
     */
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

    /**
     * Method responsible for removing selected rows (i.e. the checkbox on the left of the row is marked).
     * @method
     */
    deleteSelectedRows = () => {
        this.setState(prevState => {
            const selected = [...prevState.selectedRows];
            const tmpRows =  [...prevState.rows];

            //if selected all rows
            if(selected.length === tmpRows.length) {
                this.grid.selectAllCheckbox.checked = false;
                return {rows: [], selectedRows : [], dataModified: true};
            }

            //add additional column (uniqueLPtmp)
            tmpRows.forEach((r,idx) => r.uniqueLPtmp = idx);

            //sort by No.
            tmpRows.sort((a,b) => a["uniqueLP"] - b["uniqueLP"]);

            //sort
            selected.sort((a, b) => a - b); //default sorting is alphanumerical, sort numbers

            //filter all elements from tmpRows array that are in selected array
            const filteredRows = tmpRows.filter((r) => !selected.includes(r["uniqueLP"]))

            //correct No. numbers after removing elements
            filteredRows.forEach((r,idx) => r["uniqueLP"] = idx+1);

            //sort back by uniqueLPtmp
            filteredRows.sort((a,b) => a.uniqueLPtmp - b.uniqueLPtmp);

            //remove additional column (uniqueLPtmp)
            const nextRows = filteredRows.map( ({uniqueLPtmp, ...others}) => others);

            return {
                rows: nextRows,
                selectedRows : [], 
                dataModified: true
            };
        }, () => { 
            if(this.state.rows.length > 0 && this.state.rows.length * heightOfRow < document.getElementsByClassName("react-grid-Canvas")[0].scrollTop) {
                document.getElementsByClassName("react-grid-Canvas")[0].scrollTop = this.state.rows.length * heightOfRow;
            };
        })        
    };
    
    /**
     * Method responsible for adding row. After right click menu one can add row above ("Add new example above") or below ("Add new example below") the clicked row.
     * After "ADD NEW EXAMPLE" button click one can add row at the end of the rows array.
     * @method
     * @param {Number} rowIdx Indicates the row number from the top.
     * @param {String} where Indicates where to add the row. The existing options are "above" or "below" (the clicked row) or any other name which means at the end of the rows array.
     */
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
                    rows: nextRows, 
                    dataModified: true
                };
            }
        });
    
    };

    /**
     * Method responsible for opening the "Add attribute" dialog. The dialog is accessible through the "ADD ATTRIBUTE" button.
     * @method
     */
    onAddAttribute = () => {
        this.setState({isOpenedAddAttribute: true});
    }

    /**
     * Method responsible for opening the "Edit attributes" dialog. The dialog is accessible through the "EDIT ATTRIBUTES" button.
     * @method
     */
    onEditAttributes = () => {
        this.setState({isOpenedEditAttributes: true});
    }

    /**
     * Method responsible for closing the "Add attribute" dialog. The dialog is accessible through the "ADD ATTRIBUTE" button.
     * @method
     */
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

    /**
     * Method responsible for closing the "Edit attributes" dialog. The dialog is accessible through the "EDIT ATTRIBUTES" button.
     * @method
     */
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

    /**
     * Method responsible for closing the warning dialog. The method is executed when the chosen option is "No" in the [warning dialog]{@link DisplayData#openOnTransformWarning}.
     * @method
     */
    closeOnTransform = () => {
        this.setState({
            isOpenedTransform: false,
        })
    }

    /**
     * Method responsible for opening the warning dialog. The dialog is accessible through the "TRANSFORM" button, but only when modifications have not been saved.
     * @method
     */
    openOnTransform = () => {
        this.setState({
            isOpenedTransform: true,
        })
    }

    /**
     * Method responsible for imposing preference order when evaluation attribute doesn't have preference order.
     * The method is executed when the chosen option is "Yes" in the [warning dialog]{@link DisplayData#openOnTransformWarning}.
     * For more information [click here]{@link https://github.com/ruleLearn/rulelearn/blob/develop/src/main/java/org/rulelearn/data/InformationTable.java#L922}.
     * @method
     */
    onTransformAttributes = () => {
        console.log("Wykonuje transform, gdzie binaryzacja: " + this.state.binarizeNominalAttributesWith3PlusValues)
        this.setState({
                isLoading: true,
                isOpenedTransform: false,
            }, () => {
    
            fetch(`http://localhost:8080/projects/${this.props.project.result.id}?imposePreferenceOrder=${this.state.binarizeNominalAttributesWith3PlusValues}`, {
                method: 'GET'
            }).then(response => {
                console.log(response)
                return response.json()
            }).then(result => {
                console.log("Wynik dzialania response.json():")
                console.log(result)
                console.log("atrybuty:")
                console.log(result.informationTable.attributes);
                console.log("obiekty:")
                console.log(result.informationTable.objects);
        
                if(this._isMounted) {
                    this.setState({
                        columns: this.prepareMetaDataFromImport(result.informationTable.attributes),
                        rows: this.prepareDataFromImport(result.informationTable.objects),
                        isLoading: false,
                        dataModified: true,
                    }, () => this.state.columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx)))
                }
        
            }).catch(err => {
                console.log(err)
            })
        })
        
    }

    /**
     * Method responsible for preparing metadata before sending it to the server. E.g. removing certain properties from all the columns like sorting, filtering, resizing etc.
     * @method
     * @returns {Array}
     */
    prepareMetadataFileBeforeSendingToServer() {
        const newMetadata = [...this.state.columns].map(({editable,sortable,resizable,filterable,visible,draggable,editor,filterRenderer,sortDescendingFirst,key,width,...others}) => others);
        if(newMetadata.length > 0) newMetadata.shift();
        return newMetadata;
    }

    /**
     * Method responsible for preparing data before sending it to the server. I.e. removing "No." property from all the rows.
     * @method
     * @returns {Array}
     */
    prepareDataFileBeforeSendingToServer() {
        const newData = [...this.state.rows].map( ({uniqueLP, ...others}) => others);
        return newData;
    }
    
    /**
     * Method responsible for sending changed files i.e. metadata and data files to the server. The method is executed after "SAVE CHANGES" button click.
     * @method
     */
    /*
    sendFilesToServer = () => {
        const tmpMetaData = JSON.stringify(this.prepareMetadataFileBeforeSendingToServer());
        const tmpData = JSON.stringify(this.prepareDataFileBeforeSendingToServer());
        this.setState({
            isLoading: true,
        }, () => {
        fetch(`http://localhost:8080/projects/${this.props.project.result.id}/metadata`, {
            method: 'PUT',
            body: tmpMetaData,
        }).then(response => {
            console.log(response)
            return response.json()
        }).then(result => {
            console.log("Wynik dzialania response.json():")
            console.log(result)
        }).catch(err => {
            console.log(err)
        }).then(() => {

            fetch(`http://localhost:8080/projects/${this.props.project.result.id}/data`, {
                method: 'PUT',
                body: tmpData,
            }).then(response => {
                console.log(response)
                return response.json()
            }).then(result => {
                console.log("Wynik dzialania response.json():")
                console.log(result)

                if(this._isMounted) {
                    this.setState({
                        dataModified: false,
                        isLoading: false,
                    })
                }
            }).catch(err => {
                console.log(err)
                if(this._isMounted) {
                    this.setState({
                        isLoading: false,
                    })
                }
            })
        })
        })

    }*/

    /**
     * Method responsible for setting the value of the chosen file type ("Data","Metadata","Both") in the save to file dialog. The dialog is accessible through the "SAVE TO FILE" button.
     * @method
     * @param {Event} e indicates the event on the radio button, from which the value of the chosen file type is selected. 
     */
    handleChangeSaveToFileWhichFile = (e) => {
        this.setState({
            saveToFileWhichFile: e.target.value,
        })
    }

    /**
     * Method responsible for setting the value of the chosen file format ("JSON","CSV") in the save to file dialog. The dialog is accessible through the "SAVE TO FILE" button.
     * @method
     * @param {Event} e indicates the event on the radio button, from which the value of the chosen file format is selected. 
     */
    handleChangeSaveToFileWhichFormat = (e) => {
        this.setState({
            saveToFileWhichFormat: e.target.value,
        })
    }

    /**
     * Method responsible for closing the "Save to file" dialog. The dialog is accessible through the "SAVE TO FILE" button.
     * @method
     */
    closeOnSaveToFile = () => {
        this.setState({
            isOpenedSaveToFile: false,
            saveToFileWhichFile: '',
            saveToFileWhichFormat: '',
        })
    }

    /**
     * Method responsible for opening the "Save to file" dialog. The dialog is accessible through the "SAVE TO FILE" button.
     * @method
     * @returns {Array}
     */
    openOnSaveToFile = () => {
        this.setState({
            isOpenedSaveToFile: true,
        })
    }

    /**
     * Method responsible for saving metadata and data to files displayed data when project is changed. Runs after every [twojaNazwa]{@link DisplayData#render} and holds the latest values of props and state.
     * If the project has been changed then initialize all the values (overwrite) in the state.
     * @method
     * @param {Object} prevProps Props object containing all the props e.g. props.project.result.id or props.project.result.name
     * @param {Object} prevState State object containing all the properties from state e.g. state.columns or state.rows
     * @returns {Array}
     */
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
            else if(this.state.saveToFileWhichFile === "metadata") this.saveToJsonFile(this.prepareMetadataFileBeforeSendingToServer(), "metadata.json");
            else if(this.state.saveToFileWhichFile === "both") {
                this.saveToCSVFile();
                this.saveToJsonFile(this.prepareMetadataFileBeforeSendingToServer(), "metadata.json");
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

    /**
     * Method responsible for opening the "Save to file" dialog. The dialog is accessible through the "SAVE TO FILE" button.
     * Method responsible for changing displayed data when project is changed. Runs after every [twojaNazwa]{@link DisplayData#render} and holds the latest values of props and state.
     * If the project has been changed then initialize all the values (overwrite) in the state.
     * @method
     * @param {Object} prevProps Props object containing all the props e.g. props.project.result.id or props.project.result.name
     * @param {Object} prevState State object containing all the properties from state e.g. state.columns or state.rows
     * @returns {Array}
     */
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

                        if(error === '' && domain[i].text === "?") {
                            error = "You cannot choose '?' for the domain name! Please rename the domain element.";
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
                if(!attribute.domain.includes("?")) attribute.domain.push("?");
                attribute.editor = <DropDownEditor options={attribute.domain} />
            } else if(attribute.valueType === "integer" || attribute.valueType === "real") {
                attribute.filterRenderer = NumericFilter;
            }
        }
        return attribute;
    }

    setHeaderColorAndStyle = (column, idx) => {
        const tmp = document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes;
        if((column.type !== undefined || column.identifierType !== undefined) && !(/<\/?[a-z][\s\S]*>/i.test(column.type))) { //make sure attribute type doesn't contain html tags
            if(tmp.length === 2) {
                if(column.identifierType !== undefined) document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(identification)");
                else if(column.active) {
                    document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(" + column.type + ",active)");
                }
                else {
                    document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(" + column.type + ",inactive)");
                }
            } else if(tmp.length > 2) {
                if(column.identifierType !== undefined) document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes[3].textContent = "(identification)";
                else if(column.active) {
                    document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes[3].textContent = "(" + column.type + ",active)";
                }
                else {
                    document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes[3].textContent = "(" + column.type + ",inactive)";
                }
            }
        }

        if(column.active === false || column.identifierType !== undefined || column.type === "description") document.getElementsByClassName("react-grid-HeaderCell")[idx].style.backgroundColor = "#A0A0A0";
        else {
            if(column.preferenceType === "gain")
                document.getElementsByClassName("react-grid-HeaderCell")[idx].style.backgroundColor = "#228B22";
            else if(column.preferenceType === "cost")
                document.getElementsByClassName("react-grid-HeaderCell")[idx].style.backgroundColor = "#DC143C";
            else if(column.preferenceType === "none")
                document.getElementsByClassName("react-grid-HeaderCell")[idx].style.backgroundColor = "#3F51B5";
            else {
                document.getElementsByClassName("react-grid-HeaderCell")[idx].style.backgroundColor = "#A0A0A0";
            }
        }

        let cols = [...this.state.columns];
        let newColumn = {...column};
        if(column.type !== undefined) newColumn.width = Math.max(120, 20 + 10*column.name.length, 20+10*(column.type.length + 9));
        else if(column.identifierType !== undefined) newColumn.width = Math.max(120, 20 + 10*column.name.length, 20+10*(column.identifierType.length + 9));
        else newColumn.width = 120;
        for(let i=0; i<cols.length; i++) {
            if(cols[i].key === column.key) {
                cols[i] = newColumn;
                break;
            }
        }
        this.setState({
            columns: cols,
        })
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
            style={{justifyContent: "space-evenly"}}
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
                col.type = undefined;
            } else {
                col.identifierType = undefined;
                col.type = this.state.attributeTypeSelected.toLowerCase();
                col.preferenceType = this.state.attributePreferenceTypeSelected.toLowerCase();
                col.valueType = this.state.valueTypeSelected.toLowerCase();
                if(this.state.missingValueTypeSelected === "MV 2") col.missingValueType = "mv2";
                else col.missingValueType = "mv1.5";

                if(col.valueType === "enumeration") {
                    col.domain = this.state.attributesDomainElements.map(x => x.text.trim());
                    if(!col.domain.includes("?")) col.domain.push("?");
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
            style={{justifyContent: "space-evenly"}}
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
                    const domain = [];
                    attribute.domain.forEach( (x, index) => { 
                        if(x !== "?") domain.push({id: index, text: x});
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

            tmp.push("Delete attribute");

            return <ColumnHeaderMenu items={tmp} handleClose={this.closeOpenedColumnHeaderMenu} anchorEl={this.state.isColumnHeaderMenuOpened} />
        }
        return null;
    }

    displayRadioButtonsAccordinglyToChosenFile = () => {
        if(this.state.saveToFileWhichFile === "data" || this.state.saveToFileWhichFile === "both") {
            return(
                <RadioGroup className={"radio-button-group-save-file"} aria-label="format" name="format" value={this.state.saveToFileWhichFormat} onChange={this.handleChangeSaveToFileWhichFormat}>
                    <FormControlLabel value="csv" control={<Radio color="primary"/>} label="CSV" />
                    <FormControlLabel value="json" control={<Radio color="primary" />} label="JSON" />
                </RadioGroup>
            )
        } else if(this.state.saveToFileWhichFile === "metadata") {
            return(
                <RadioGroup className={"radio-button-group-save-file"} aria-label="format" name="format" value={this.state.saveToFileWhichFormat} onChange={this.handleChangeSaveToFileWhichFormat}>
                    <FormControlLabel value="json" control={<Radio color="primary" />} label="JSON" />
                </RadioGroup>
            )
        }
    }

    onCellSelected = (coord) => {
        const {rowIdx, Idx} = coord;
    }

    handleChangeBinarize = (e) => {
        this.setState({
            binarizeNominalAttributesWith3PlusValues: e.target.checked,
        })
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

    /**
     * Method responsible for rendering everything
     */
    render() {        
        return (
            <div>      
                <DraggableContainer onHeaderDrop={this.onColumnHeaderDragDrop}>   
                <ReactDataGrid
                    ref={(node) => this.grid = node}
                    columns={this.getColumns()}
                    rowGetter={i => this.filteredRows()[i]}
                    rowsCount={this.filteredRows().length}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    onGridSort = {this.onGridSort}
                    enableCellSelect={true}
                    onCellSelected={this.onCellSelected}
                    getValidFilterValues={columnKey => this.getValidFilterValues(this.state.rows, columnKey)}
                    toolbar={<EditDataFilterButton enableFilter={true} > 
                            < EditDataButtons deleteRow={this.deleteSelectedRows} insertRow={this.insertRow} 
                                    /*sendFilesToServer={this.sendFilesToServer} */ saveToFileDialog={this.openOnSaveToFile} onAddAttribute={this.onAddAttribute} 
                                    onEditAttributes={this.onEditAttributes} openOnTransform={this.openOnTransform} modified={this.state.dataModified} 
                                    setProjectSettings={this.setProjectSettings}/> 
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
                    <DialogTitle id="add-attribute-dialog">{"Add new attribute"}</DialogTitle>
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
                    <DialogTitle id="edit-attributes-dialog">{"Edit attributes"}</DialogTitle>
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
                    <DialogTitle id="save-files-dialog">{"Choose type and format to be saved in."}</DialogTitle>
                    <DialogContent>
                        When selected "Both" the first downloaded file will be "Metadata" and then the second one "Data" 
                    
                    <RadioGroup className={"radio-button-group-save-file"} aria-label="file" name="file" value={this.state.saveToFileWhichFile} onChange={this.handleChangeSaveToFileWhichFile}>
                        <FormControlLabel value="data" control={<Radio color="primary"/>} label="Data" />
                        <FormControlLabel value="metadata" control={<Radio color="primary" />} label="Metadata" />
                        <FormControlLabel value="both" control={<Radio color="primary"/>} label="Both" />
                    </RadioGroup>
                    {this.displayRadioButtonsAccordinglyToChosenFile()}
                    
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

                <Dialog open={this.state.isOpenedTransform} onClose={this.closeOnTransform} aria-labelledby="transform-warning-dialog">
                    <DialogTitle id="transform-warning-title">{"Are you sure you want to continue?"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="transform-dialog-description">
                        Impose Preference Orders
                    </DialogContentText>
                    <Tooltip title="binarizeNominalAttributesWith3PlusValues" placement="bottom" arrow>
                    <FormControlLabel
                        control={<Checkbox defaultChecked={false} color="primary" name="binarize" onChange={this.handleChangeBinarize}/>}
                        label="Binarize"
                        labelPlacement="start"
                        key="attributeIsActive"
                    />
                    </Tooltip>
                    
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.closeOnTransform} style={{color: "#F2545B", borderColor:"#4C061D"}} variant={"outlined"}>
                        Cancel
                    </Button>
                    <Button onClick={this.onTransformAttributes} style={{color:"#66FF66", borderColor:"#6BD425"}} variant={"outlined"}>
                        Submit
                    </Button>
                    </DialogActions>
                </Dialog>

              
                {this.state.isLoading ? <RuleWorkLoadingIcon size={60}/> : null }
            </div>
        )
    }
}

DisplayData.propTypes = {
    project: PropTypes.any.isRequired,
    updateProject: PropTypes.func.isRequired,
};

DisplayData.defaultProps = {
    //project: {informationTable: '2541bed3-63f3-4b88-88ba-543a2bb54f60', name: '', files: []},
};
  
export default DisplayData;