import React from 'react';
import ReactDataGrid from '@emsi-iggy/rulework-react-data-grid';

import { Editors,  Data, Menu} from 'react-data-grid-addons';

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
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { DraggableHeader } from 'react-data-grid-addons';
import PropTypes from 'prop-types';
import RuleWorkLoadingIcon from './RuleWorkLoadingIcon';
import StyledButton from '../../../RuleWorkComponents/Inputs/StyledButton';
import NumericFilter from './NumericFilter';
import { Divider } from '@material-ui/core';

const selectors = Data.Selectors;
const { DropDownEditor } = Editors;
const { ContextMenu, MenuItem, ContextMenuTrigger } = Menu;
const { DraggableContainer } = DraggableHeader;

const heightOfRow = 40; //50
const heightOfHeaderRow = 50; //60
const maxNoOfHistorySteps = 30;

const SimpleDialog = withStyles( theme => ({
    paper: {
        backgroundColor: theme.palette.paper.background,
        color: theme.palette.paper.text,
    }
}), {name: "simple-dialog"})(props => (
    <Dialog {...props}/>
));

const StyledReactDataGrid = (theme) => createStyles({
    root: {
    "& div.react-grid-Container": {
        
      "& .react-grid-Canvas": {
        backgroundColor: theme.palette.reactDataGrid.cell.backgroundColor
      },
      "& .react-grid-HeaderRow": {
        backgroundColor: theme.palette.reactDataGrid.cell.backgroundColor
      },
      "& .react-grid-Row:hover .react-grid-Cell, .react-grid-Row.row-context-menu .react-grid-Cell": {
        backgroundColor: theme.palette.reactDataGrid.rowHover.backgroundColor
      },
      "& .react-grid-Row .row-selected": {
        backgroundColor: theme.palette.reactDataGrid.rowMarked.backgroundColor
      },
      "& .react-grid-Cell": {
        backgroundColor: theme.palette.reactDataGrid.cell.backgroundColor,
        color: theme.palette.reactDataGrid.cell.color,
        borderRight: theme.palette.reactDataGrid.cell.borderRight,
        borderBottom: theme.palette.reactDataGrid.cell.borderBottom,
      },
      "& .react-grid-HeaderCell": {
        backgroundColor: theme.palette.reactDataGrid.headerCell.backgroundColor,
        color: theme.palette.reactDataGrid.headerCell.color,
        borderRight: theme.palette.reactDataGrid.headerCell.borderRight,
        borderBottom: theme.palette.reactDataGrid.headerCell.borderBottom,
      },
      "& .react-grid-cell-dragged-over-up, .react-grid-cell-dragged-over-down": {
        background: theme.palette.reactDataGrid.cellDragging.background
      },
      "& .rdg-selected": {
        border: theme.palette.reactDataGrid.cellSelected.border
      },
      "& .rdg-selected .drag-handle": {
        background: theme.palette.reactDataGrid.cellSelected.squareDragHandle.background
      },
      "& .rdg-selected:hover .drag-handle": {
        border: theme.palette.reactDataGrid.cellSelected.squareDragHandle.onHover.border,
        background: theme.palette.reactDataGrid.cellSelected.squareDragHandle.background
      },
      "& .rdg-editor-container .form-control.editor-main": {
        backgroundColor: theme.palette.reactDataGrid.cellEditor.simple.backgroundColor,
        color: theme.palette.reactDataGrid.cellEditor.simple.color
      },
      "& .rdg-editor-container .editor-main": {
        backgroundColor: theme.palette.reactDataGrid.cellEditor.dropDown.backgroundColor,
        color: theme.palette.reactDataGrid.cellEditor.dropDown.color
      },
      "& input.editor-main:focus, select.editor-main:focus": {
        border: theme.palette.reactDataGrid.cellEditor.outline.border,
      },
      "& .react-grid-checkbox:checked + .react-grid-checkbox-label:before": {
        background: theme.palette.reactDataGrid.checkbox.selected.background,
        boxShadow: theme.palette.reactDataGrid.checkbox.selected.boxShadow,
      },
      "& .react-grid-checkbox + .react-grid-checkbox-label:before, .radio-custom + .radio-custom-label:before": {
        background: theme.palette.reactDataGrid.checkbox.deselected.background,
        border: theme.palette.reactDataGrid.checkbox.deselected.border,
      },
      "& .react-grid-HeaderCell .input-sm": {
        backgroundColor: theme.palette.reactDataGrid.search.backgroundColor,
        color: theme.palette.reactDataGrid.search.color,
      },
      "& .react-grid-Main .form-control:focus": {
        backgroundColor: theme.palette.reactDataGrid.search.focused.backgroundColor,
        color: theme.palette.reactDataGrid.search.focused.color,
        borderColor: theme.palette.reactDataGrid.search.focused.borderColor
      },
      "& .form-control.input-sm::placeholder": {
        color: theme.palette.reactDataGrid.search.placeholder.color,
        opacity: theme.palette.reactDataGrid.search.placeholder.opacity,
      },
      "& .react-contextmenu": {
        backgroundColor: theme.palette.reactDataGrid.contextMenu.backgroundColor,
        border: theme.palette.reactDataGrid.contextMenu.border,
      },
      "& .react-contextmenu-item.react-contextmenu-item--active, .react-contextmenu-item.react-contextmenu-item--selected": {
        backgroundColor: theme.palette.reactDataGrid.contextMenu.hover.backgroundColor,
        color: theme.palette.reactDataGrid.contextMenu.hover.color,
      },
            
    }
  }   
});

const defaultPrimaryColor = "#ABFAA9";

const ValidationTextField = withStyles(theme => ({
    root: {
        '& label': {
          color: 'black',
          backgroundColor: '#ABFAA9',
        },
        '&:hover label': {
            backgroundColor: "#6BD425",
        },
        '& label.Mui-focused': {
          color: 'black',
          backgroundColor: '#66FF66'
        },
      '& .MuiOutlinedInput-root': {
          height: 40,
          backgroundColor: theme.palette.button.primary,
          '&:hover fieldset': {
              borderColor: "#66FF66",
          },
          '&.Mui-focused fieldset': {
              borderColor: "#66FF66",
          },
          '&:hover': {
              backgroundColor: "#6BD425",
              '& label': {
                backgroundColor: '#ABFAA9'
              }
          },
          '&.Mui-focused': {
              backgroundColor: "#6BD425"
          },
      },
  },
}))(TextField);

const StyledList = withStyles({
    root: {
        backgroundColor: "#545F66",
        color: "#ABFAA9",
        minWidth: "50%",
    }
})(props => <List {...props} />);

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
            enableRowInsert: 0, //-1 no sort, 0-sort asc, 1-sort desc
            selectedRows: [],
            filters: {},
            dataModified: false,

            isOpenedAddAttribute: false,
            isOpenedEditAttributes: false,
            isOpenedSaveToFile: false,
            saveToFileMetaData: false,
            saveToFileData: '',
            saveToFileCsvHeader: false,
            saveToFileCsvSeparator: '',
            
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

            historySnapshot: this.props.project.dataHistory.historySnapshot,
            history: this.props.project.dataHistory.history.length ? 
                this.props.project.dataHistory.history 
                :
                [
                    {
                        rows: this.prepareDataFromImport(this.props.project.result.informationTable.objects),
                        columns: this.prepareMetaDataFromImport(this.props.project.result.informationTable.attributes),
                    }
                ],
            wholeAppError: false,
        };    
        
        this._isMounted = false;
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { wholeAppError: true };
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
        console.log("Witam w metodzie: componentDidUpdate")
        if(prevProps.project.result.id !== this.props.project.result.id) {
            this.setState({
                enableRowInsert: 0, //-1 no sort, 0-sort asc, 1-sort desc
                selectedRows: [],
                filters: {},
                dataModified: false,

                isOpenedAddAttribute: false,
                isOpenedEditAttributes: false,
                isOpenedSaveToFile: false,
                saveToFileMetaData: false,
                saveToFileData: '',
                saveToFileCsvHeader: false,
                saveToFileCsvSeparator: '',
                
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

                historySnapshot: this.props.project.dataHistory.historySnapshot,
                history: this.props.project.dataHistory.history.length ? 
                this.props.project.dataHistory.history 
                :
                [
                    {
                        rows: this.prepareDataFromImport(this.props.project.result.informationTable.objects),
                        columns: this.prepareMetaDataFromImport(this.props.project.result.informationTable.attributes),
                    }
                ],
            }, () => this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,true)))
        }
       // if(prevState.history[prevState.historySnapshot] !== undefined && this.state.history[this.state.historySnapshot] !== undefined) {
            console.log("PrevState columns (gdzieJestem = " + prevState.historySnapshot + "):")
            console.log(prevState.history);
            console.log("State columns (gdzieJestem = " + this.state.historySnapshot + "):")
            console.log(this.state.history)
        //}
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
        const tmp = [{key: "uniqueLP", name: "No.", sortable: true, resizable: true, filterable: true, draggable: true, sortDescendingFirst: true, width: 160, filterRenderer: NumericFilter, visible: true, temp: false}];
        
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
        console.log("Witam w metodzie: componentDidMount")
        const headers = document.getElementsByClassName("react-grid-HeaderCell-sortable");
        for(let i=0; i<headers.length; i++) {
            for(let j=0; j<this.state.history[this.state.historySnapshot].columns.length; j++)
            {
                if(headers[i].innerText === this.state.history[this.state.historySnapshot].columns[j].name) {
                    this.setHeaderColorAndStyleAndRightClick(this.state.history[this.state.historySnapshot].columns[j], i, true);
                    break;
                }
            }                        
        }
       

        this._isMounted = true;
    }

    componentWillUnmount() {
        console.log("Witam w metodzie: componentWillUnmount")
        if(this.state.dataModified) {
            console.log("wszedlem do component did update -> zmienione dane")
            const tmpMetaData = this.prepareMetadataFileBeforeSendingToServer();
            const tmpData = this.prepareDataFileBeforeSendingToServer();
            const tmpProject = {...this.props.project}
            tmpProject.result.informationTable.attributes = tmpMetaData;
            tmpProject.result.informationTable.objects = tmpData;
            tmpProject.dataHistory = {historySnapshot: this.state.historySnapshot, history: this.state.history}
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
        if(toRow - fromRow > 15) {
            this.setState({
                isLoading: true
            }, () => {
                setTimeout(() => {
                    this.setState(prevState => {
                        const rows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
                        const filtered = this.filteredRows();
                        for (let i = fromRow; i <= toRow; i++) {
                            const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                            rows[rows_index] = { ...filtered[i], ...updated };
                        }

                        const tmpHistory = prevState.history.slice(0,prevState.historySnapshot+1);
                        tmpHistory.push({rows: rows, columns: prevState.history[prevState.historySnapshot].columns});
                        if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();

                        if(this._isMounted) {
                            return {
                                dataModified: true,
                                isLoading: false,
                                history: tmpHistory,
                                historySnapshot: tmpHistory.length-1, 
                            }
                        }
                    });
                },500)
            });
        } else {
            this.setState(prevState => {
                const rows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
                const filtered = this.filteredRows();
                const tmp = Object.entries(updated)[0];
                const editedCol = prevState.history[prevState.historySnapshot].columns.find(x => x.key === tmp[0])
                if(editedCol.valueType === "real") { //enable only reals and "?"
                    if(tmp[1] !== "?" && isNaN(Number(tmp[1]))) {
                        const message = <span> Cell hasn't been updated. <br/> Column type: real <br/> The entered value: {tmp[1]}, which is invalid. </span>
                        return {
                            isOpenedNotification: true,
                            addAttributeErrorNotification: message
                        }
                    }
                } else if(editedCol.valueType === "integer") { //enable only integers and "?"
                    if(tmp[1] !== "?" && (isNaN(Number(tmp[1])) || tmp[1].indexOf(".") !== -1 )) {
                        const message = <span> Cell hasn't been updated. <br/> Column type: integer <br/> The entered value: {tmp[1]}, which is invalid. </span>
                        return {
                            isOpenedNotification: true,
                            addAttributeErrorNotification: message
                        }
                    }
                } else if(editedCol.valueType === "enumeration") { //enable only domain elements and "?" - can happen only during ctrl+c, ctrl+v
                    if(tmp[1] !== "?" && !editedCol.domain.includes(tmp[1])) {
                        const message = <span> Cell hasn't been updated. <br/> Column type: enumeration <br/> The entered value: {tmp[1]}, which is invalid. Please check the domain. </span>
                        return {
                            isOpenedNotification: true,
                            addAttributeErrorNotification: message
                        }
                    }
                }

                for (let i = fromRow; i <= toRow; i++) {
                    const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                    if(fromRow === toRow) //check if any change happend
                    {
                        if(rows[rows_index][tmp[0]] === tmp[1]) {
                            return ;
                        }
                    }
                    
                    rows[rows_index] = { ...filtered[i], ...updated };
                }
                const tmpHistory = prevState.history.slice(0, prevState.historySnapshot+1);
                tmpHistory.push({rows: rows, columns: prevState.history[prevState.historySnapshot].columns});
                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                return { 
                    dataModified: true,
                    history: tmpHistory,
                    historySnapshot: tmpHistory.length-1, 
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
        let tmpEnableRowInsert = -1;
        const tmpCol = this.state.history[this.state.historySnapshot].columns.find(col => col.key === sortColumn);
        let numberSorting = false;
        if(tmpCol.valueType !== undefined && (tmpCol.valueType === "integer" || tmpCol.valueType === "real")) numberSorting = true;
        
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                console.log("Porownuje: " + a[sortColumn] + " z " + b[sortColumn]);
                ((sortColumn === "uniqueLP") ? tmpEnableRowInsert = 0 : tmpEnableRowInsert = -1)
                if(numberSorting) {
                    //a-at the beginning, b-at the end
                    if(a[sortColumn] === "?") return -1;
                    return a[sortColumn] - b[sortColumn];
                }
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
                ((sortColumn === "uniqueLP") ? tmpEnableRowInsert = 1 : tmpEnableRowInsert = -1)
                if(numberSorting) {
                    //a-at the beginning, b-at the end
                    if(b[sortColumn] === "?") return -1;
                    return b[sortColumn] - a[sortColumn];
                }
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            } else {
                tmpEnableRowInsert = 0;
                return a["uniqueLP"] > b["uniqueLP"] ? 1 : -1;
            }
        };
        
        this.setState(prevState => {
            const rows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows)).sort(comparer);
            const tmpHistory = prevState.history.slice(0, prevState.historySnapshot+1);
            tmpHistory.push({rows: rows, columns: prevState.history[prevState.historySnapshot].columns});
            if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
            return {
                enableRowInsert: tmpEnableRowInsert,
                dataModified: true,
                history: tmpHistory,
                historySnapshot: tmpHistory.length-1,
            }
        });
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
     * @param {Object} filter Consists of two key-value pairs. The first one is the column object containg all the pairs key-value for the column.
     * The second is flterTerm which has been written in the filter field.
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
        if(this.state.history[this.state.historySnapshot] !== undefined) {
            return this.getRows(this.state.history[this.state.historySnapshot].rows, this.state.filters);
        }
        return [];
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
            const nextRows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
            if( nextRows[rowIdx] !== undefined) {
                const removedRowUniqueLP = nextRows[rowIdx].uniqueLP;
                nextRows.splice(rowIdx, 1);
                nextRows.forEach(r => {
                    if(r.uniqueLP >= removedRowUniqueLP) r.uniqueLP-=1
                })
                const tmpHistory = prevState.history.slice(0, prevState.historySnapshot+1);
                tmpHistory.push({rows: nextRows, columns: prevState.history[prevState.historySnapshot].columns});
                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                return {
                    dataModified: true, 
                    history: tmpHistory, 
                    historySnapshot: tmpHistory.length-1
                };
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
            const tmpRows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));

            //if none of the rows is selected
            if(selected.length === 0) { return ;}

            //if selected all rows
            if(selected.length === tmpRows.length) {
                this.grid.selectAllCheckbox.checked = false;
                const tmpHistory = prevState.history.slice(0, prevState.historySnapshot+1);
                tmpHistory.push({rows: [], columns: prevState.history[prevState.historySnapshot].columns});
                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                return {
                    selectedRows: [], 
                    dataModified: true, 
                    history: tmpHistory, 
                    historySnapshot: tmpHistory.length-1
                };
            }

            //add additional column (uniqueLP2)
            tmpRows.forEach((r,idx) => r.uniqueLP2 = idx);

            //sort by No.
            tmpRows.sort((a,b) => a["uniqueLP"] - b["uniqueLP"]);

            //sort
            selected.sort((a, b) => a - b); //default sorting is alphanumerical, sort numbers

            //filter all elements from tmpRows array that are in selected array
            const filteredRows = tmpRows.filter((r) => !selected.includes(r["uniqueLP"]))

            //correct No. numbers after removing elements
            filteredRows.forEach((r,idx) => r["uniqueLP"] = idx+1);

            //sort back by uniqueLP2
            filteredRows.sort((a,b) => a.uniqueLP2 - b.uniqueLP2);

            //remove additional column (uniqueLP2)
            const nextRows = filteredRows.map( ({uniqueLP2, ...others}) => others);

            const tmpHistory = prevState.history.slice(0, prevState.historySnapshot+1);
            tmpHistory.push({rows: nextRows, columns: prevState.history[prevState.historySnapshot].columns});
            if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();

            return {
                selectedRows: [], 
                dataModified: true,
                history: tmpHistory, 
                historySnapshot: tmpHistory.length-1
            };
        }, () => { 
            if(this.state.history[this.state.historySnapshot].rows.length > 0 && this.state.history[this.state.historySnapshot].rows.length * heightOfRow < document.getElementsByClassName("react-grid-Canvas")[0].scrollTop) {
                document.getElementsByClassName("react-grid-Canvas")[0].scrollTop = this.state.history[this.state.historySnapshot].rows.length * heightOfRow;
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
            const nextRows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
            const newRow = {};
            prevState.history[prevState.historySnapshot].columns.forEach( col => {
                if(col.key !== "uniqueLP") newRow[col.key] = "?";
            });
            
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
                        newRow.uniqueLP = Math.max(...nextRows.map(o => o.uniqueLP), 0) + 1;
                        nextRows.push(newRow);
                    break;
                };
                const tmpHistory = prevState.history.slice(0, prevState.historySnapshot+1);
                tmpHistory.push({rows: nextRows, columns: prevState.history[prevState.historySnapshot].columns});
                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                return { 
                    dataModified: true,
                    history: tmpHistory, 
                    historySnapshot: tmpHistory.length-1
                };
            } else if(nextRows.length === 0) { //when array is empty
                newRow.uniqueLP = 1;
                nextRows.push(newRow);
                const tmpHistory = prevState.history.slice(0, prevState.historySnapshot+1);
                tmpHistory.push({rows: nextRows, columns: prevState.history[prevState.historySnapshot].columns});
                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                return { 
                    dataModified: true,
                    history: tmpHistory,
                    historySnapshot: tmpHistory.length-1
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
        if(this.state.dataModified) {
            console.log("Wykonuje transform wrzucajac nowe pliki, gdzie binaryzacja: " + this.state.binarizeNominalAttributesWith3PlusValues)
            this.setState({
                    isLoading: true,
                    isOpenedTransform: false,
                }, () => {
                    let formData = new FormData();
                    formData.append('binarizeNominalAttributesWith3PlusValues', this.state.binarizeNominalAttributesWith3PlusValues);
                    formData.append('metadata', JSON.stringify(this.prepareMetadataFileBeforeSendingToServer()));
                    formData.append('data', JSON.stringify(this.prepareDataFileBeforeSendingToServer()));
        
                fetch(`http://localhost:8080/projects/${this.props.project.result.id}/imposePreferenceOrder`, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    console.log(response)

                    if(response.status === 200) {
                        response.json().then(result => {
                            console.log("Received information table:")
                            console.log(result)
                            console.log("atrybuty:")
                            console.log(result.attributes);
                            console.log("obiekty:")
                            console.log(result.objects);
                    
                            if(this._isMounted) {
                                const tmpHistory = this.state.history.slice(0, this.state.historySnapshot+1);
				                tmpHistory.push({rows: this.prepareDataFromImport(result.objects), columns: this.prepareMetaDataFromImport(result.attributes)});
                                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                                this.setState({
                                    isLoading: false,
                                    dataModified: true,
                                    history: tmpHistory, 
                                    historySnapshot: tmpHistory.length-1
                                }, () => this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,true)))
                            }

                        }).catch(err => {
                            console.log(err)
                        })
                    } else if(response.status === 404) {
                        response.json().then(result => {
                            console.log("Error 404.")
                            console.log(result.message)
                            const message = <span> Error 404. <br/> {result.message} </span>
                            if(this._isMounted) {
                                this.setState({
                                    isOpenedNotification: true,
                                    addAttributeErrorNotification: message,
                                    isLoading: false,
                                })
                            }
                        }).catch(err => {
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                            console.log(err)
                        })
                    } else {
                        response.json().then(result => {
                            console.log("Result of response.json():")
                            console.log(result)
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                        }).catch(err => {
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                            console.log(err)
                        })
                    }
                }).catch(err => {
                    if(this._isMounted) {
                        this.setState({
                            isLoading: false,
                        })
                    }
                    console.log(err)
                })
            })
        } else {
            this.setState({
                isLoading: true,
                isOpenedTransform: false,
            }, () => {
                console.log("Wykonuje transform bez nowych plikow, gdzie binaryzacja: " + this.state.binarizeNominalAttributesWith3PlusValues)
                let link = `http://localhost:8080/projects/${this.props.project.result.id}/imposePreferenceOrder?binarizeNominalAttributesWith3PlusValues=${this.state.binarizeNominalAttributesWith3PlusValues}`;
                console.log(link);
                
                fetch(link, {
                    method: 'GET'
                }).then(response => {
                    console.log(response)
                    if(response.status === 200) {
                        response.json().then(result => {
                            console.log("Received information table:")
                            console.log(result)
                            console.log("atrybuty:")
                            console.log(result.attributes);
                            console.log("obiekty:")
                            console.log(result.objects);
                            
                            if(this._isMounted) {
                                const tmpHistory = this.state.history.slice(0, this.state.historySnapshot+1);
                                tmpHistory.push({rows: this.prepareDataFromImport(result.objects), columns: this.prepareMetaDataFromImport(result.attributes)});
                                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                                this.setState({
                                    isLoading: false,
                                    dataModified: true,
                                    history: tmpHistory, 
                                    historySnapshot: tmpHistory.length-1
                                }, () => this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,true)))
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else if(response.status === 404) {
                        response.json().then(result => {
                            console.log("Error 404.")
                            console.log(result.message)
                            const message = <span> Error 404. <br/> {result.message} </span>
                            if(this._isMounted) {
                                this.setState({
                                    isOpenedNotification: true,
		                            addAttributeErrorNotification: message,
                                    isLoading: false,
                                })
                            }
                        }).catch(err => {
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                            console.log(err)
                        })
                    } else {
                        response.json().then(result => {
                            console.log("Result of response.json():")
                            console.log(result)
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                        }).catch(err => {
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                            console.log(err)
                        })
                    }
                }).catch(err => {
                    if(this._isMounted) {
                        this.setState({
                            isLoading: false,
                        })
                    }
                    console.log(err)
                })
            })
        }
    }

    /**
     * Method responsible for preparing metadata before sending it to the server. E.g. removing certain properties from all the columns like sorting, filtering, resizing etc.
     * @method
     * @returns {Array}
     */
    prepareMetadataFileBeforeSendingToServer() {
        if(this.state.history[this.state.historySnapshot] === undefined) return ;
        const newMetadata = JSON.parse(JSON.stringify(this.state.history[this.state.historySnapshot].columns)).map(({editable,sortable,resizable,filterable,visible,draggable,editor,filterRenderer,sortDescendingFirst,key,width,...others}) => others);
        
        //remove No. column
        if(newMetadata.length > 0) newMetadata.shift();
        
        //remove missing value sign ("?")
        newMetadata.forEach(col => {
            if(col.domain !== undefined) col.domain.pop();
        })
        return newMetadata;
    }

    /**
     * Method responsible for preparing data before sending it to the server. I.e. removing "No." property from all the rows.
     * @method
     * @returns {Array}
     */
    prepareDataFileBeforeSendingToServer() {
        if(this.state.history[this.state.historySnapshot] === undefined) return ;
        const newData = JSON.parse(JSON.stringify(this.state.history[this.state.historySnapshot].rows)).map( ({uniqueLP, ...others}) => others);
        return newData;
    }

    handleChangeSaveToFileMetaData = (e) => {
        this.setState({
          saveToFileMetaData: e.target.checked
        })
    }

    handleChangeSaveToFileData = (e) => {
        this.setState({
            saveToFileData: e.target.value
        })
    }

    handleChangeSaveToFileCsvHeader = (e) => {
        this.setState({
            saveToFileCsvHeader: e.target.checked
        })
    }

    getSelectedSaveToFileCsvSeparator = (selected) => {
        this.setState({
            saveToFileCsvSeparator: selected
        })
    }

    /**
     * Method responsible for closing the "Save to file" dialog. The dialog is accessible through the "SAVE TO FILE" button.
     * @method
     */
    closeOnSaveToFile = () => {
        this.setState({
            isOpenedSaveToFile: false,
            saveToFileMetaData: false,
            saveToFileData: '',
            saveToFileCsvHeader: false,
            saveToFileCsvSeparator: '',
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
        if(this.state.saveToFileMetaData) {
            this.saveToJsonFile(this.prepareMetadataFileBeforeSendingToServer(), this.props.project.result.name + "_metadata.json");
        }
        if(this.state.saveToFileData === 'json') {
            this.saveToJsonFile(this.prepareDataFileBeforeSendingToServer(), this.props.project.result.name + "_data.json");
        } else if(this.state.saveToFileData === 'csv') {
            let separator = " ";
            if(this.state.saveToFileCsvSeparator === "tab") separator = "%09";
            else if(this.state.saveToFileCsvSeparator === "semicolon") separator = ";";
            else if(this.state.saveToFileCsvSeparator === "comma") separator = ",";
            //else it is space
            this.saveToCSVFile(this.props.project.result.name + "_data.csv", this.state.saveToFileCsvHeader, separator);
        }

        this.setState({
            isOpenedSaveToFile: false,
            saveToFileMetaData: false,
            saveToFileData: '',
            saveToFileCsvHeader: false,
            saveToFileCsvSeparator: '',
        })
    } 

    saveToCSVFile = (name, header, separator) => {
        console.log("Otrzymalem:")
        console.log(header);
        console.log(separator);
        console.log("Wszedlem do funkcji pobierania danych PUT")
        let x = true;
        if(x) { //modified?
            let filename = name;
            let link = `http://localhost:8080/projects/${this.props.project.result.id}/data/download`;
            link += `?format=csv`;
            link += `&separator=${separator}`;
            link += `&header=${header}`;
            console.log(link)

            let formData = new FormData();
            formData.append('metadata', JSON.stringify(this.prepareMetadataFileBeforeSendingToServer()));
            formData.append('data', JSON.stringify(this.prepareDataFileBeforeSendingToServer()));

            console.log("Poczatek - co wysylam:")
            console.log(JSON.stringify(this.prepareMetadataFileBeforeSendingToServer()))
            console.log(JSON.stringify(this.prepareDataFileBeforeSendingToServer()));
            console.log("Koniec - co wysylam")
            fetch(link, {
                method: 'PUT',
                body: formData
            }).then(response => {
                console.log(response)
                if(response.status === 200) { 
                    filename =  response.headers.get('Content-Disposition').split('filename=')[1];
                    response.blob().then(result => {
                        console.log("Result of response.blob():")
                        console.log(result)
                        const url = window.URL.createObjectURL(result);
                        const b = document.createElement('a');
                        b.href = url;
                        b.download = filename;
                        b.click();
                    }).catch(err => {
                        console.log(err)
                    }) 
                } else {
                    response.json().then(result => {
                        console.log("Result of response.json():")
                        console.log(result)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
            
        } else {
            console.log("Wszedlem do funkcji pobierania danych GET")
            let filename = name;

            let link = `http://localhost:8080/projects//${this.props.project.result.id}/data/download`;
            link += `?format=csv`;
            link += `&separator=${separator}`;
            link += `&header=${header}`;
    
            console.log(link)
    
            fetch(link, {
                method: 'GET'
            }).then(response => {
                console.log(response)
                if(response.status === 200) {
                    filename =  response.headers.get('Content-Disposition').split('filename=')[1];
                    response.blob().then(result => {
                        console.log("Result of response.blob():")
                        console.log(result)
                        const url = window.URL.createObjectURL(result);
                        const b = document.createElement('a');
                        b.href = url;
                        b.download = filename;
                        document.body.appendChild(b);
                        b.click();
                        document.body.removeChild(b);
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    response.json().then(result => {
                        console.log("Result of response.json():")
                        console.log(result)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }).catch(err => {
                console.log(err)
            })

        }
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
        if(this.state.history[this.state.historySnapshot] !== undefined) {
            const newColumns = this.state.history[this.state.historySnapshot].columns.filter(x => x.visible !== false);
            return newColumns;
        }
        return [];
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
            let history = [...this.state.history];
            let cols = [...history[this.state.historySnapshot].columns];
            for(let i=0; i<cols.length; i++) {
                if(cols[i].key === this.state.columnKeyOfHeaderMenuOpened) {
                    let col = {...cols[i]};
                    let didIRemoveColumn = false;
                    if(selected === "Mark attribute as: inactive" || selected === "Mark attribute as: active") {
                        col.active = !col.active;
                        cols[i] = col;
                    } else if(selected === "Delete attribute") {
                        cols.splice(i,1);
                        didIRemoveColumn = true;
                    }

                    const tmpHistory = history.slice(0, this.state.historySnapshot+1);
                    tmpHistory.push({rows: history[this.state.historySnapshot].rows, columns: cols});
                    if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                    this.setState({
                        dataModified: true,
                        isColumnHeaderMenuOpened: null,
                        columnKeyOfHeaderMenuOpened: -1,
                        history: tmpHistory, 
                        historySnapshot: tmpHistory.length-1
                    },() => {if(!didIRemoveColumn) this.setHeaderColorAndStyle(cols[i],i,false)});
                    
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
        for(let i in this.state.history[this.state.historySnapshot].columns) {
            if(this.state.history[this.state.historySnapshot].columns[i].name === name) {
                return true;
            }
        }
        return false;
    }

    attributeAlreadyExistAndIsDifferentThanSelected(name) {
        for(let i in this.state.history[this.state.historySnapshot].columns) {
            if(this.state.history[this.state.historySnapshot].columns[i].name === name && this.state.editAttributeSelected !== name) {
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
        if(name === "uniqueLP" || name === "key" || name === "uniqueLP2") error = "You have chosen restricted name for the attribute! Please choose other name.";

        if(isOnAddMethod) { //add new column
            if(this.attributeAlreadyExists(name)) error = "The attribute with the same name ("+name+") already exists! Please choose other name.";
        } else { //change existing column
            if(this.attributeAlreadyExistAndIsDifferentThanSelected(name)) error = "The attribute with the same name ("+name+") already exists! Please choose other name.";
        }
        
            //type validation
            if(type === '') error = "You didn't select any attribute type! Please select any.";
            
            else if(type !== "identification") {
                //preference type validation
                if(preferenceType === '') error = "You didn't select any attribute preference type! Please select any.";

                //value type validation
                else if(valueType === '') error = "You didn't select any value type! Please select any.";

                //enumeration validation
                else if(valueType === "enumeration") {
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
        if(type === "identification") {
            attribute.identifierType = identifierType.toLowerCase();
        }
        else {
            attribute.type = type.toLowerCase();
            attribute.preferenceType = preferenceType.toLowerCase();
            attribute.valueType = valueType.toLowerCase();
            if(mvType === "mv2") attribute.missingValueType = "mv2";
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

    setHeaderColorAndStyle = (column, idx, changeWidth) => {
        if(document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes !== undefined) {
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

            if(changeWidth) {
                let history = [...this.state.history];

                let cols = [...history[this.state.historySnapshot].columns];
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

                let newHistoryCols = {...history[this.state.historySnapshot]};
                newHistoryCols.columns = cols;
                history[this.state.historySnapshot] = newHistoryCols;

                this.setState({
                    history: history
                })
            }
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

    setHeaderColorAndStyleAndRightClick = (column, idx, changeWidth) => {
        this.setHeaderColorAndStyle(column, idx, changeWidth);
        this.setHeaderRightClick(column, idx);
    }

    renameKeyInObject = (oldName, newName, {[oldName]: old, ...others}) => ({
        [newName]: old,
        ...others
    })
    
    setRowsAndHeaderColorAndStyleAndRightClick = (column, idx, ifIsNewColumnElseOldColumn) => {
        let nextRows = JSON.parse(JSON.stringify(this.state.history[this.state.historySnapshot].rows));
        if(typeof ifIsNewColumnElseOldColumn === "boolean") { //new column fill with "?"
            for(let i in nextRows) {
                nextRows[i][column.key] = "?";
            }
        } else { //editing column

            //both name and valueType of the column has been changed
            if(ifIsNewColumnElseOldColumn.name !== column.name && ifIsNewColumnElseOldColumn.valueType !== column.valueType) {
                if(column.valueType === "enumeration") { 
                    for(let i in nextRows) {
                        nextRows[i] = this.renameKeyInObject(ifIsNewColumnElseOldColumn.key, column.key, nextRows[i]);
                        nextRows[i][column.key] = nextRows[i][column.key].toString();
                        if(!column.domain.includes(nextRows[i][column.key])) nextRows[i][column.key] = "?";
                    }
                } else if(column.valueType === "integer") {
                    for(let i in nextRows) {
                        nextRows[i] = this.renameKeyInObject(ifIsNewColumnElseOldColumn.key, column.key, nextRows[i]);
                        let tmp = parseInt(nextRows[i][column.key],10);
                        if(isNaN(tmp)) nextRows[i][column.key] = "?";
                        else nextRows[i][column.key] = tmp;
                    }
                } else if(column.valueType === "real") {
                    for(let i in nextRows) {
                        nextRows[i] = this.renameKeyInObject(ifIsNewColumnElseOldColumn.key, column.key, nextRows[i]);
                        let tmp = parseFloat(nextRows[i][column.key]);
                        if(isNaN(tmp)) nextRows[i][column.key] = "?";
                        else nextRows[i][column.key] = tmp;
                    }
                } else {
                    for(let i in nextRows) {
                        nextRows[i] = this.renameKeyInObject(ifIsNewColumnElseOldColumn.key, column.key, nextRows[i]);
                        nextRows[i][column.key] = "?";
                    }
                }
            // column valueType has been changed so check the content of each row
            } else if(ifIsNewColumnElseOldColumn.valueType !== column.valueType) {
                if(column.valueType === "enumeration") {
                    for(let i in nextRows) {
                        if(!column.domain.includes(nextRows[i][column.key])) nextRows[i][column.key] = "?";
                    }
                }
                else if(column.valueType === "integer") {
                    for(let i in nextRows) {
                        let tmp = parseInt(nextRows[i][column.key],10);
                        if(isNaN(tmp)) nextRows[i][column.key] = "?";
                        else nextRows[i][column.key] = tmp;
                    }
                } else if(column.valueType === "real") {
                    for(let i in nextRows) {
                        let tmp = parseFloat(nextRows[i][column.key]);
                        if(isNaN(tmp)) nextRows[i][column.key] = "?";
                        else nextRows[i][column.key] = tmp;
                    }
                } else {
                    for(let i in nextRows) {
                        nextRows[i][column.key] = "?";
                    }
                }
            //column name has been changed (rename all keys in rows)
            } else if(ifIsNewColumnElseOldColumn.name !== column.name) {
                for(let i in nextRows) {
                    nextRows[i] = this.renameKeyInObject(ifIsNewColumnElseOldColumn.key, column.key, nextRows[i]);
                }
            }             
        }
        
        let history = [...this.state.history];
        let newHistory = {...history[this.state.historySnapshot]};
        newHistory.rows = nextRows;
        history[this.state.historySnapshot] = newHistory;

        this.setState({
            history: history,
        }, () => {this.setHeaderColorAndStyleAndRightClick(column, idx, true)}) 
        
    }

    applyOnAddAttribute = (e) => {
        e.preventDefault();
        const validationOk = this.validateOnAddAndEditAttribute(true,e.target.attributeName.value.trim(), this.state.attributeTypeSelected, this.state.missingValueTypeSelected,
                    this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements)
        if(validationOk) {
            const newColumn = this.createColumn(e.target.attributeName.value.trim(), e.target.attributeIsActive.checked, this.state.attributeTypeSelected, 
                this.state.missingValueTypeSelected, this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements);
            
            this.setState( (prevState) => {
                let tmpHistory = prevState.history.slice(0, prevState.historySnapshot+1);
                let cols = [...tmpHistory[prevState.historySnapshot].columns];

                tmpHistory.push({rows: tmpHistory[prevState.historySnapshot].rows, columns: [...cols, newColumn]});
                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();

                return {
                    dataModified: true,
                    isOpenedAddAttribute: false,
                    attributeTypeSelected: '',
                    attributePreferenceTypeSelected: '',
                    valueTypeSelected: '',
                    identifierTypeSelected: '',
                    missingValueTypeSelected: '',
                    attributesDomainElements: [],
                    history: tmpHistory,
                    historySnapshot: tmpHistory.length-1,
                    }
                },() => {this.setRowsAndHeaderColorAndStyleAndRightClick(
                    this.state.history[this.state.historySnapshot].columns[this.state.history[this.state.historySnapshot].columns.length-1], 
                    this.state.history[this.state.historySnapshot].columns.length-1, true)}
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
            control={<Checkbox defaultChecked={true} style={{float: "left", width: "65%", color: defaultPrimaryColor}} name="attributeIsActive"/>}
            label="Active"
            labelPlacement="start"
            key="attributeIsActive"
            style={{justifyContent: "space-evenly"}}
        />)
        tmp.push(<ValidationTextField autoComplete="off" label="Name" size="small" fullWidth required variant="outlined" id="attributeName" key="attributeName" defaultValue="" />)
        tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key="attributeType" displayName={"Type"} items={["identification","description","condition","decision"]}/>)

        if(this.state.attributeTypeSelected !== "identification") {
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedMissingValueType} name={"missingValueType"} key="missingValueType" displayName={"Missing value type"} missingVal={true} defaultValue="mv2" items={["1.5","2"]}/>)
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributePreferenceType} name={"attributePreferenceType"} key="attributePreferenceType" displayName={"Preference type"} items={["none","cost","gain"]}/>)
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedValueType} name={"valueType"} displayName={"Value type"} key="valueType" items={["integer","real","enumeration"]}/>)
            if(this.state.valueTypeSelected === "enumeration")
            {
                tmp.push(<div className="attributeDomainWrapper" key="attributeDomainWrapper"><div className="attributeDomain"> <AttributeDomain setDomainElements={this.setDomainElements}/> </div> </div>)
            }
        } else if(this.state.attributeTypeSelected === "identification") { 
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedIdentifierType} name={"identifierType"} displayName={"Identifier type"} key="identifierType" items={["uuid","text"]}/>)
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
        let history = [...this.state.history];
        let cols = [...history[this.state.historySnapshot].columns];
        let i=0;
        for(i=0; i<cols.length; i++) {
            if(cols[i].name === this.state.editAttributeSelected) break;
        }
        let col = {editable:true, sortable:true, resizable:true, filterable:true, draggable: true, visible: true}

        const validationOk = this.validateOnAddAndEditAttribute(false,e.target.attributeName.value.trim(), this.state.attributeTypeSelected, this.state.missingValueTypeSelected,
            this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements)
        
        if(validationOk) {
            col.key = e.target.attributeName.value.trim();
            col.name = e.target.attributeName.value.trim();
            col.active = e.target.attributeIsActive.checked;
            if(this.state.attributeTypeSelected === "identification") {
                col.identifierType = this.state.identifierTypeSelected.toLowerCase();
                col.type = undefined;
            } else {
                col.identifierType = undefined;
                col.type = this.state.attributeTypeSelected.toLowerCase();
                col.preferenceType = this.state.attributePreferenceTypeSelected.toLowerCase();
                col.valueType = this.state.valueTypeSelected.toLowerCase();
                if(this.state.missingValueTypeSelected === "mv2") col.missingValueType = "mv2";
                else col.missingValueType = "mv1.5";

                if(col.valueType === "enumeration") {
                    col.domain = this.state.attributesDomainElements.map(x => x.text.trim());
                    if(!col.domain.includes("?")) col.domain.push("?");
                    col.editor = <DropDownEditor options={col.domain} />
                } else if(col.valueType === "integer" || col.valueType === "real") {
                    col.editor = undefined;
                    col.filterRenderer = NumericFilter;
                }
            }
            const oldColumn = {...cols[i]};
            cols[i] = col;
            const tmpHistory = this.state.history.slice(0, this.state.historySnapshot+1);
            tmpHistory.push({rows: this.state.history[this.state.historySnapshot].rows, columns: cols});
            if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
            
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
                history: tmpHistory,
                historySnapshot: tmpHistory.length-1
            },() => this.setRowsAndHeaderColorAndStyleAndRightClick(this.state.history[this.state.historySnapshot].columns[i], i, oldColumn)
            );   
        } else {
            this.setState({
                isOpenedNotification: true,
            });  
        }
    }

    displayListOfAttributesForModification = () => {
       const tmp = [];
       if(this.state.history[this.state.historySnapshot] !== undefined) {
            for(let i=0; i<this.state.history[this.state.historySnapshot].columns.length; i++) {
                if(this.state.history[this.state.historySnapshot].columns[i].key !== "uniqueLP") {
                    tmp.push(this.state.history[this.state.historySnapshot].columns[i]);
                }
            }
        }
        
        return tmp;
    }

    displayFieldsOfSelectedAttribute = () => {
        let attribute;
        for(let i=0; i<this.state.history[this.state.historySnapshot].columns.length; i++) {
            if(this.state.editAttributeSelected === this.state.history[this.state.historySnapshot].columns[i].name) { 
                attribute = {...this.state.history[this.state.historySnapshot].columns[i]};
                break;
            }
        }
        
        const tmp = [];
        
        tmp.push(<FormControlLabel
            control={<Checkbox defaultChecked={attribute.active} color="primary" style={{float: "left", width: "65%", color: defaultPrimaryColor}} name="attributeIsActive"/>}
            label="Active"
            labelPlacement="start"
            key={"attributeIsActive"+attribute.name}
            style={{justifyContent: "space-evenly"}}
        />)
        tmp.push(<ValidationTextField autoComplete="off" label="Name" fullWidth required variant="outlined" id="attributeName" key={"attributeName"+attribute.name} defaultValue={attribute.name} />)

        if((this.state.attributeTypeSelected === '' && this.state.valueTypeSelected === '') || (this.state.attributeTypeSelected.toLowerCase()===attribute.type && this.state.valueTypeSelected.toLowerCase() === attribute.valueType)   /*|| (this.state.attributeTypeSelected.toLowerCase()===attribute.type && this.state.valueTypeSelected === '') //nothing has changed
            || (this.state.attributeTypeSelected === '' && this.state.valueTypeSelected.toLowerCase() === attribute.valueType) || (this.state.attributeTypeSelected.toLowerCase()===attribute.type && this.state.valueTypeSelected.toLowerCase() === attribute.valueType) */
            || (this.state.attributeTypeSelected === 'identification' && attribute.preferenceType === undefined)) { 

            if(attribute.identifierType !== '' && attribute.type === undefined) { //if it's identifier attribute
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key={"attributeType"+attribute.name} defaultValue={"identification"} displayName={"Type"} items={["identification","description","condition","decision"]}/>) 
                
                if(attribute.identifierType.toLowerCase() === 'uuid') {
                    tmp.push(<DropDownForAttributes getSelected={this.getSelectedIdentifierType} name={"identifierType"} key={"identifierType"+attribute.name} defaultValue={"uuid"} displayName={"Identifier type"}  items={["uuid","text"]}/>)
                }
                else { 
                    tmp.push(<DropDownForAttributes getSelected={this.getSelectedIdentifierType} name={"identifierType"} key={"identifierType"+attribute.name} defaultValue={"text"} displayName={"Identifier type"}  items={["uuid","text"]}/>) 
                }
            } else { //it's not identifier attribute
                
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key={"attributeType"+attribute.name} defaultValue={attribute.type} displayName={"Type"} items={["identification","description","condition","decision"]}/>)

                if(attribute.missingValueType === "mv2") {
                    tmp.push(<DropDownForAttributes getSelected={this.getSelectedMissingValueType} name={"missingValueType"} key={"missingValueType"+attribute.name} displayName={"Missing value type"} missingVal={true} defaultValue="mv2" items={["1.5","2"]}/>)
                }
                else {
                    tmp.push(<DropDownForAttributes getSelected={this.getSelectedMissingValueType} name={"missingValueType"} key={"missingValueType"+attribute.name} displayName={"Missing value type"} missingVal={true} defaultValue="mv1.5" items={["1.5","2"]}/>)
                }
                
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributePreferenceType} name={"attributePreferenceType"} key={"attributePreferenceType"+attribute.name} defaultValue={attribute.preferenceType} displayName={"Preference type"} items={["none","cost","gain"]}/>)

                tmp.push(<DropDownForAttributes getSelected={this.getSelectedValueType} name={"valueType"} displayName={"Value type"} key={"valueType"+attribute.name} defaultValue={attribute.valueType} items={["integer","real","enumeration"]}/>)

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
            
            if(this.state.attributeTypeSelected !== "identification") {
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key={"attributeType"+attribute.name} displayName={"Type"} items={["identification","description","condition","decision"]}/>)
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedMissingValueType} name={"missingValueType"} key={"missingValueType"+attribute.name} missingVal={true}  defaultValue="mv2" displayName={"Missing value type"} items={["1.5","2"]}/>)
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributePreferenceType} name={"attributePreferenceType"} key={"attributePreferenceType"+attribute.name} displayName={"Preference type"} items={["none","cost","gain"]}/>)
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedValueType} name={"valueType"} displayName={"Value type"} key={"valueType"+attribute.name} items={["integer","real","enumeration"]}/>)
                if(this.state.valueTypeSelected === "enumeration")
                {
                    tmp.push(<div className="attributeDomainWrapper" key={"attributeDomainWrapper"+attribute.name}><div className="attributeDomain"> <AttributeDomain setDomainElements={this.setDomainElements}/> </div> </div>)
                }
            } else if(this.state.attributeTypeSelected === "identification") { 
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key={"attributeType"+attribute.name} displayName={"Type"} defaultValue={"identification"} items={["identification","description","condition","decision"]}/>)
                tmp.push(<DropDownForAttributes getSelected={this.getSelectedIdentifierType} name={"identifierType"} displayName={"Identifier type"} key={"identifierType"+attribute.name} items={["uuid","text"]}/>)
            }
        } else if(this.state.valueTypeSelected !== attribute.valueType) {
            if(this.state.valueTypeSelected === "enumeration")
            {
                tmp.push(<div className="attributeDomainWrapper" key={"attributeDomainWrapper"+attribute.name}><div className="attributeDomain"> <AttributeDomain setDomainElements={this.setDomainElements}/> </div> </div>)
            }
        }
      
        return tmp;
    }

    

    displayColumnHeaderMenu = () => {
        if(this.state.isColumnHeaderMenuOpened && this.state.columnKeyOfHeaderMenuOpened !== "uniqueLP") { //don't touch No. column
            const tmp = [];
            for(let i=0; i<this.state.history[this.state.historySnapshot].columns.length; i++) {
                if(this.state.history[this.state.historySnapshot].columns[i].key === this.state.columnKeyOfHeaderMenuOpened) {
                    if(this.state.history[this.state.historySnapshot].columns[i].identifierType === undefined) {
                        if(this.state.history[this.state.historySnapshot].columns[i].active)
                            tmp.push("Mark attribute as: inactive");
                        else if(this.state.history[this.state.historySnapshot].columns[i].active === false)
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

    onCellSelected = (coord) => {
        const {rowIdx, Idx} = coord;
        /*   this.grid.openCellEditor(rowIdx, idx); */
        
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
        const history = [...this.state.history];
        const newColumns = [...history[this.state.historySnapshot].columns];
        const columnSourceIndex = history[this.state.historySnapshot].columns.findIndex((i) => i.key === source);
        const columnTargetIndex = history[this.state.historySnapshot].columns.findIndex((i) => i.key === target);
        const uniqueLPIdx = history[this.state.historySnapshot].columns.findIndex((i) => i.key === "uniqueLP");
        newColumns.splice(columnTargetIndex,0,newColumns.splice(columnSourceIndex, 1)[0]);
        
        let col = {...newColumns[uniqueLPIdx]};
        col.temp = !col.temp;
        newColumns[uniqueLPIdx] = col;
    
        const tmpHistory = history.slice(0, this.state.historySnapshot+1);
        tmpHistory.push({rows: this.state.history[this.state.historySnapshot].rows, columns: newColumns});
        if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
    
        this.setState({ 
            dataModified: true,
            history: tmpHistory,
            historySnapshot: tmpHistory.length-1
        }, () => this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,false))
        )        
    };

    onBack = () => {
        this.setState( prevState => {
            if(prevState.historySnapshot > 0) {
                return {
                    historySnapshot: prevState.historySnapshot-1,
                    dataModified: true,
                }
            }
        },() => this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,false)))
    }

    onRedo = () => {
        this.setState( prevState => {
            if(prevState.historySnapshot < prevState.history.length-1) {
                return {
                    historySnapshot: prevState.historySnapshot+1,
                    dataModified: true,
                }
            }
        },() => this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,false)))
    }

    onColumnResize = (columnIdx, newWidth) => {
        //In this method columnIdx = 0 means column with checkboxes,
        //so to get first column from history one have to subtract 1
        let history = [...this.state.history];

        let cols = [...history[this.state.historySnapshot].columns];
        let column = {...cols[columnIdx-1]};
        if(newWidth > 80) column.width = newWidth;
        else column.width = 80;
        
        cols[columnIdx-1] = column;
        history[this.state.historySnapshot].columns = cols;

        this.setState({
            history: history
        })
    }

    /**
     * Method responsible for rendering everything
     */
    render() {   
        const classes = this.props.classes;
        return (
            <div style={{height: "0px", flexGrow: 0.93}} className={classes.root}>      
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
                    getValidFilterValues={columnKey => this.getValidFilterValues(this.state.history[this.state.historySnapshot].rows, columnKey)}
                    toolbar={<EditDataFilterButton enableFilter={true} > 
                            < EditDataButtons deleteRow={this.deleteSelectedRows} insertRow={this.insertRow} 
                                    saveToFileDialog={this.openOnSaveToFile} onAddAttribute={this.onAddAttribute} 
                                    onBack={this.onBack} onRedo={this.onRedo} historySnapshot={this.state.historySnapshot} historyLength={this.state.history.length}
                                    onEditAttributes={this.onEditAttributes} openOnTransform={this.openOnTransform} setProjectSettings={this.setProjectSettings}/> 
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
                    onColumnResize={this.onColumnResize}
                    minHeight={1400}
                    rowHeight={heightOfRow}
                    rowScrollTimeout={200}
                    headerRowHeight={heightOfHeaderRow}
                    editorPortalTarget={document.getElementsByClassName("react-grid-Canvas")[0]}
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
                
                <SimpleDialog open={this.state.isOpenedAddAttribute} fullWidth={true} maxWidth={"xs"} onClose={this.closeOnAddAttribute} aria-labelledby="add-attribute-dialog">
                    <DialogTitle id="add-attribute-dialog">{"Add new attribute"}</DialogTitle>
                    <form onSubmit={this.applyOnAddAttribute}>
                    <DialogContent>
                        <div className="nicelyInColumn">
                            {this.displayAddAttributeFields()}
                            {
                                this.state.addAttributeErrorNotification !== '' ? <Notification open={this.state.isOpenedNotification} 
                                closeOpenedNotification={this.closeOpenedNotification} message={this.state.addAttributeErrorNotification} variant={"error"} /> : null
                            }                        
                        </div>        
                    </DialogContent>
                    <DialogActions>
                        <StyledButton onClick={this.closeOnAddAttribute} themeVariant={"secondary"} variant={"outlined"}> Cancel </StyledButton>
                        <StyledButton type="submit" themeVariant={"primary"} variant={"outlined"} disabled={false}> Apply </StyledButton>
                    </DialogActions>
                    </form>
                </SimpleDialog>

                <SimpleDialog open={this.state.isOpenedEditAttributes} fullWidth={true} maxWidth={"md"} onClose={this.closeOnEditAttributes} aria-labelledby="edit-attributes-dialog">
                    <DialogTitle id="edit-attributes-dialog">{"Edit attributes"}</DialogTitle>
                    <form onSubmit={this.applyOnEditAttributes}>
                    <DialogContent>
                        {this.state.history[this.state.historySnapshot].columns !== undefined && this.state.history[this.state.historySnapshot].columns.length === 1? 
                        <span> There are no attributes to edit! </span> :
                        <span> Choose attribute to edit. <br/> Please note that you can apply changes only to the selected attribute. </span>
                        }
                        
                        <div className="editAttributesWrapper">
                        <div className="nicelyInColumn">
                            <StyledList component="nav" aria-label="display attributes" id="edit-attributes-list"> 
                            {this.displayListOfAttributesForModification().map(x => (
                                <ListItem button data-value={x.name} key={x.key} selected={this.state.editAttributeSelected === x.name} onClick={this.handleListItemClick} >
                                    <ListItemText primary={x.name}/>
                                </ListItem>))}
                            </StyledList>
                        </div>
                        <div className="editAttributesValues">
                            {this.state.editAttributeSelected !== '' ? this.displayFieldsOfSelectedAttribute() : null}    
                            {
                                this.state.addAttributeErrorNotification !== '' ? <Notification open={this.state.isOpenedNotification} 
                                closeOpenedNotification={this.closeOpenedNotification} message={this.state.addAttributeErrorNotification} variant={"error"} /> : null
                            }                        
                        </div> 
                        </div>       
                    </DialogContent>
                    <DialogActions>
                        <StyledButton onClick={this.closeOnEditAttributes} themeVariant={"secondary"} variant={"outlined"}> Cancel </StyledButton>
                        <StyledButton type="submit" themeVariant={"primary"} variant={"outlined"} disabled={this.state.editAttributeSelected === ''}> Apply </StyledButton>
                    </DialogActions>
                    </form>
                </SimpleDialog>

                <SimpleDialog fullWidth={true} maxWidth={"sm"} open={this.state.isOpenedSaveToFile} onClose={this.closeOnSaveToFile} aria-labelledby="save-files-dialog">
                    <DialogTitle id="save-files-dialog">{"Choose type and format to be saved in."}</DialogTitle>
                    <DialogContent>
                        <span>Select appropriate checkboxes to download the file/files</span> <br/><br/>
                        <div style={{display: "flex"}}>
                            <div style={{flex: "1"}}>
                                <span style={{display: "flex", justifyContent: "center"}}>Metadata</span>
                                <FormControlLabel style={{display: "flex", justifyContent: "center"}}
                                    control={<Checkbox style={{color: defaultPrimaryColor}} name="metadata" 
                                    onChange={this.handleChangeSaveToFileMetaData}/>}
                                    label="JSON"
                                    labelPlacement="end"
                                />
                            </div>
                            
                            <Divider orientation="vertical" variant="fullWidth" flexItem
                            style={{backgroundColor: defaultPrimaryColor, flex: "0 0 1px"}}/>
                            
                            <div style={{flex: "1"}}>
                                <span style={{display: "flex", justifyContent: "center"}}>Data</span>
                                <div style={{display: "flex", justifyContent: "center" }}>
                                    <RadioGroup row={true} aria-label="file" name="file" value={this.state.saveToFileData} 
                                    onChange={this.handleChangeSaveToFileData}>
                                    <FormControlLabel value="json" control={<Radio style={{color: defaultPrimaryColor}}/>} label="JSON" />
                                    <FormControlLabel value="csv" control={<Radio style={{color: defaultPrimaryColor}}/>} label="CSV" />
                                    </RadioGroup>
                                </div>
                                {
                                    this.state.saveToFileData === "csv" && <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                    <Tooltip title="Save data with header row" placement="bottom">
                                    <FormControlLabel 
                                        control={<Checkbox style={{color: defaultPrimaryColor}} name="csvHeader" 
                                        onChange={this.handleChangeSaveToFileCsvHeader}/>}
                                        label="Header?"
                                        labelPlacement="end"
                                    />
                                    </Tooltip>
                                    <DropDownForAttributes getSelected={this.getSelectedSaveToFileCsvSeparator} 
                                        name={"saveToFileSeparator"} key="saveToFileSeparator" displayName={"Separator"} 
                                        items={["tab","semicolon","comma","space"]}
                                    />
                                    </div>
                                }
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <StyledButton onClick={this.closeOnSaveToFile} themeVariant={"secondary"} variant={"outlined"}> Cancel </StyledButton>
                        <StyledButton onClick={this.saveToFile} themeVariant={"primary"} variant={"outlined"} autoFocus
                            disabled={!((this.state.saveToFileMetaData && this.state.saveToFileData==='') || (this.state.saveToFileData==='json') ||
                                        (this.state.saveToFileData!=='' && this.state.saveToFileCsvSeparator!==''))}> 
                            Ok 
                        </StyledButton>
                    </DialogActions>
                </SimpleDialog>
                
                {this.displayColumnHeaderMenu()}

                <SimpleDialog open={this.state.isOpenedTransform} onClose={this.closeOnTransform} aria-labelledby="transform-warning-dialog">
                    <DialogTitle id="transform-warning-title">{"Do you want to impose preference orders?"}</DialogTitle>
                    <DialogContent>
                    <Tooltip title="Binarize nominal attributes with 3+ values?" placement="bottom" arrow>
                    <FormControlLabel
                        control={<Checkbox defaultChecked={false} style={{color: defaultPrimaryColor}} name="binarize" onChange={this.handleChangeBinarize}/>}
                        label="Binarize"
                        labelPlacement="start"
                        key="Binarize"
                    />
                    </Tooltip>
                    
                    </DialogContent>
                    <DialogActions>

                    <StyledButton onClick={this.closeOnTransform} themeVariant={"secondary"} variant={"outlined"}> Cancel </StyledButton>
                    <StyledButton onClick={this.onTransformAttributes} themeVariant={"primary"} variant={"outlined"} > Submit </StyledButton>

                    </DialogActions>
                </SimpleDialog>

                {
                    this.state.addAttributeErrorNotification !== '' ? <Notification open={this.state.isOpenedNotification} 
                    closeOpenedNotification={this.closeOpenedNotification} message={this.state.addAttributeErrorNotification} variant={"error"} /> : null
                }
              
                {this.state.isLoading ? <RuleWorkLoadingIcon color="primary" /> : null }
            </div>
        )
    }
}

DisplayData.propTypes = {
    project: PropTypes.any.isRequired,
    updateProject: PropTypes.func.isRequired,
};
  
export default withStyles(StyledReactDataGrid)(DisplayData);