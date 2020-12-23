import React, {Fragment} from 'react';
import ReactDataGrid from '@emsi-iggy/rulework-react-data-grid';

import { Editors,  Data, Menu} from 'react-data-grid-addons';

import './DisplayData.css';
import EditDataButtons from './EditDataButtons';
import EditDataFilterButton from './EditDataFilterButton'
import DropDownForAttributes from './DropDownForAttributes';
import Notification from './Notification';
import AttributeDomain from './AttributeDomain';
import ColumnHeaderMenu from './ColumnHeaderMenu';
import RadioGroup from '@material-ui/core/RadioGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { DraggableHeader } from 'react-data-grid-addons';
import PropTypes from 'prop-types';
import CustomLoadingIcon from './CustomLoadingIcon';
import { StyledButton } from '../../../Utils/Buttons';
import NumericFilter from './NumericFilter';
import AttributesVirtualizedTable from './AttributesVirtualizedTable';
import CustomTooltip from '../../../Utils/DataDisplay/CustomTooltip';

import { StyledCheckbox, StyledRadio, StyledCustomTextField} from './StyledComponents';
import StyledDivider from '../../../Utils/DataDisplay/StyledDivider';
import { fetchData } from '../../../Utils/utilFunctions/fetchFunctions';

const selectors = Data.Selectors;
const { DropDownEditor } = Editors;
const { ContextMenu, MenuItem, ContextMenuTrigger } = Menu;
const { DraggableContainer } = DraggableHeader;

const heightOfRow = 40; //50
const heightOfHeaderRow = 50; //60
const maxNoOfHistorySteps = 30;
const MAX_INT = 2147483647;

const SimpleDialog = withStyles( theme => ({
    paper: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.main1,
    },
    paperWidthSm: {
        maxWidth: "700px"
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
                Delete object
            </MenuItem>
            <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertAbove}>
                Add new object above
            </MenuItem>
            <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertBelow}>
                Add new object below
            </MenuItem>
        </ContextMenu>
    );
}

/**
 * The data tab in RuleStudio.
 * Presents the list of all objects (and attributes) from information table, allows to add, remove and edit them.
 *
 * @name Data
 * @constructor
 * @category Project
 * @subcategory Tabs
 * @param {Object} props - Arguments received from the parent component
 * @param {Object} props.project - Holds data about the current project like id, name and everything associated with the project e.g. information table, unions, cones etc.
 * @param {Object} props.informationTable - InformationTable received from and sent to the server, holds attributes and objects
 * @param {Array} props.project.informationTable.attributes - Attributes (metadata, might be empty)
 * @param {Array} props.project.informationTable.objects - Objects (data, might be empty)
 * @param {function} props.onDataChange - Callback method responsible for updating the informationTable in the parent component (which is ProjectTabs.js)
 * @param {function} props.updateProject - Callback method responsible for updating the whole project (kept in App.js)
 * @returns {React.Component}
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
            errorMessage: '',
            errorMessageSeverity: 'error',
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
                this.prepareHistory(this.props.project.dataHistory.history)
                :
                [
                    {
                        rows: [],
                        columns: [],
                        historyActionSubject: ''
                    }
                ],
        };

        this.isDataFromServer = this.props.project.isDataFromServer;
        this._isMounted = false;
        this.ctrlKeyDown = -1;
        this.ctrlPlusC = false;
    }

    /**
     * A component's lifecycle method. Fired after a component was updated.
     * Method responsible for changing displayed data when project is changed. Runs after every [render()]{@link DisplayData#render} and holds the newest values of props and state.
     * If the project has been changed then initialize all the values (overwrite) in the state.
     *
     * @function
     * @memberOf Data
     * @param {Object} prevProps - Old props object containing all the props e.g. props.project.id or props.project.name
     * @param {Object} prevState - Old state object containing all the properties from state e.g. state.columns or state.rows
     */
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.project.id !== this.props.project.id) {
            this.ctrlKeyDown = -1;
            this.ctrlPlusC = false;
            this.isDataFromServer = this.props.project.isDataFromServer;
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
                errorMessage: '',
                errorMessageSeverity: 'error',
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
                    this.prepareHistory(this.props.project.dataHistory.history)
                    :
                    [
                        {
                            rows: [],
                            columns: [],
                            historyActionSubject: ''
                        }
                    ],
            }, () => {
                this.fetchDataFromServerOrParent(true, false);
            })
        }
    }

    /**
     * Method responsible for adding elements (e.g. numeric filter), which have been removed due to parsing and stringifying history.
     *
     * @function
     * @memberOf Data
     * @param {Array} history - It is the array containing objects. Each object consists of rows, columns, and what has been changed (column, row, both)
     */
    prepareHistory = (history) => {
        const historyTmp = JSON.parse(JSON.stringify(history));
        for(let i in historyTmp) {
            for(let j in historyTmp[i].columns) {
                if(historyTmp[i].columns[j].domain !== undefined) {
                    if(!historyTmp[i].columns[j].domain.includes("?")) historyTmp[i].columns[j].domain.push("?");
                    historyTmp[i].columns[j].editor = <DropDownEditor options={historyTmp[i].columns[j].domain} />;
                }
                if(historyTmp[i].columns[j].valueType === "integer" || historyTmp[i].columns[j].valueType === "real" || historyTmp[i].columns[j].key === "uniqueLP") {
                    historyTmp[i].columns[j].filterRenderer = NumericFilter;
                }
            }
        }
        return historyTmp;
    }

    /**
     * Method responsible for preparing data i.e. objects to display them in rows. This is the place where No. property is added to each object.
     *
     * @function
     * @memberOf Data
     * @param {Array} data - Data i.e. objects received from the props. Each object consists of pairs key-value with name of the property as the key and value as the value.
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
     *
     * @function
     * @memberOf Data
     * @param {Array} metadata - I.e. attributes received from the props. Each attribute consists of pairs key-value with name of the property as the key and value as the value.
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
            if(metadata[el].type !== undefined) attribute.width = Math.max(120, 20 + 10*metadata[el].name.length, 20+10*(metadata[el].type.length + 9));
            else if(metadata[el].identifierType !== undefined) attribute.width = Math.max(120, 20 + 10*metadata[el].name.length, 20+10*(metadata[el].identifierType.length + 9));
            else attribute.width = 120;
            tmp.push(attribute)
        }
        return tmp;
    }

    /**
     * Method responsible for inserting into cells missing value signs (?) if the key of an object doesn't match the attribute.
     *
     * @function
     * @memberOf Data
     */
    replaceMissingDataWithQuestionMarks = () => {
        if(this.isDataFromServer) {
            this.setState(prevState => {
                let rows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
                for(let i in rows) {
                    for(let j in prevState.history[prevState.historySnapshot].columns) {
                        if(rows[i][prevState.history[prevState.historySnapshot].columns[j].key] === undefined || rows[i][prevState.history[prevState.historySnapshot].columns[j].key] === "") {
                            rows[i][prevState.history[prevState.historySnapshot].columns[j].key] = "?"
                        }
                    }
                }

                let history = [...this.state.history];
                let newHistory = {...history[this.state.historySnapshot]};
                newHistory.rows = rows;
                history[this.state.historySnapshot] = newHistory;

                if(this._isMounted) {
                    return {
                        history: history
                    }
                }
            });
            this.isDataFromServer = false;
        }
    }

    /**
     * Method responsible for getting information table from the server or from the parent component, used when entering the data tab.
     *
     * @function
     * @memberOf Data
     * @param {boolean} isFetchNeeded - If <code>true</code> the informationTable will be fetched from the server.
     * @param {boolean} cdm - If <code>true</code> this method is called from the ComponentDidMount method.
     */
    fetchDataFromServerOrParent = (isFetchNeeded, cdm) => {
        if(isFetchNeeded) {
            this.setState({
                isLoading: true
            }, () => {
                const serverBase = this.props.serverBase;
                const pathParams = { projectId: this.props.project.id };
                const method = "GET";
                const body = null;

                fetchData(
                    pathParams, method, body, serverBase
                ).then(result => {
                    if (result != null) {
                        const rows = this.prepareDataFromImport(result.objects);
                        const columns = this.prepareMetaDataFromImport(result.attributes);
                        
                        let history = [...this.state.history];
                        let newHistory = {...history[this.state.historySnapshot]};
                        newHistory.rows = rows;
                        newHistory.columns = columns;
                        history[this.state.historySnapshot] = newHistory;

                        this.setState({
                            history: history,
                        })
                    }
                }).catch(error => {
                    if(!(error.hasOwnProperty("type") && error.type === "AlertError")) {
                        console.error(error);
                        return;
                    }
                    this.setState({
                        isOpenedNotification: error.open,
                        errorMessage: error.message,
                        errorMessageSeverity: error.severity
                    })
                }).finally(() => {
                    this.setState({
                        isLoading: false
                    }, () => {
                        this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,true));
                        this.replaceMissingDataWithQuestionMarks(); 
                        this.updateInfoTableInTheParent(!cdm);
                    });
                    
                });
            });
        } else {
            if(this.state.history.length === 1 && this.state.history[0].columns.length === 0) {
                const history = [];
                const rows = this.prepareDataFromImport(this.props.informationTable.objects);
                const columns = this.prepareMetaDataFromImport(this.props.informationTable.attributes);

                history.push({
                    rows: rows,
                    columns: columns,
                    historyActionSubject: ''
                })               

                this.setState({
                    history: history,
                }, () => {
                    this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,true));
                    this.replaceMissingDataWithQuestionMarks();
                })
            } else {
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
                this.replaceMissingDataWithQuestionMarks();
            }
        }
    }

    /**
     * Method responsible for updating (sending to server) information table, so it will be possible to make attributes visible to choose in the "project settings" (objects visible name).
     * 
     * @function
     * @memberOf Data
     * @param {Object[]} objects - Array representing objects (data)
     * @param {Object[]} attributes - Array representing attributes (metadata)
     */
    sendInfoTableToServerDueToIdentifOrDescriptAttributeChange = (objects, attributes) => {
        this.setState({
            isLoading: true
        }, () => {
            const serverBase = this.props.serverBase;
            const pathParams = { projectId: this.props.project.id };
            const method = "POST";
            const body = new FormData();
            body.append("metadata", JSON.stringify(attributes));
            body.append("data", JSON.stringify(objects));

            fetchData(
                pathParams, method, body, serverBase
            ).then().catch(error => {
                if(!(error.hasOwnProperty("type") && error.type === "AlertError")) {
                    console.error(error);
                    return;
                }
                this.setState({
                    isOpenedNotification: error.open,
                    errorMessage: error.message,
                    errorMessageSeverity: error.severity
                })
            }).finally(() => {
                this.setState({
                    isLoading: false
                });
            });
        })
    }

    /**
     * Helper method responsible for preparing objects and attributes and forward them to {@link DisplayData#sendInfoTableToServerDueToIdentifOrDescriptAttributeChange}.
     *
     * @function
     * @memberOf Data
     */
    updateChangedIdentifOrDescriptAttribute = () => {
        const attributes = this.prepareMetadataFileBeforeSendingToServer();
        const objects = this.prepareDataFileBeforeSendingToServer();
        this.sendInfoTableToServerDueToIdentifOrDescriptAttributeChange(objects, attributes);
    }

    /**
     * Method checks if the [updateChangedIdentifOrDescriptAttribute]{@link DisplayData#updateChangedIdentifOrDescriptAttribute} needs to be fired.
     *
     * @function
     * @memberOf Data
     * @param {Object} oldCol - object representing old (previous) version of the column.
     * @param {Object} newCol - if it is false it means column has been removed, if it true column activeness has been changed, if it isn't boolean type
     * then it is the object representing new version of (changes made to) the column.
     */
    checkIfUpdateOfAttributesNeeded = (oldCol, newCol) => {
        //right click on header menu
        if(typeof newCol === "boolean") {
            if(newCol === false) { //column has been removed
                if(oldCol.type === "description" || oldCol.identifierType !== undefined) this.updateChangedIdentifOrDescriptAttribute();
            } else { //column activeness has been changed
                if(oldCol.identifierType !== undefined) this.updateChangedIdentifOrDescriptAttribute();
            }
        } else { //column has been edited
            if((oldCol.type === "description" && newCol.type !== "description")
                ||  (oldCol.type !== "description" && newCol.type === "description")
                ||  (oldCol.identifierType !== undefined && newCol.identifierType === undefined)
                ||  (oldCol.identifierType === undefined && newCol.identifierType !== undefined)
                ||  (oldCol.identifierType !== undefined && newCol.identifierType !== undefined && oldCol.identifierType !== newCol.identifierType)
                ||  (
                    oldCol.name !== newCol.name &&
                    ((oldCol.type === newCol.type && oldCol.type === "description") || ((oldCol.identifierType === newCol.identifierType && oldCol.identifierType !== undefined)))
                )
            ) {
                this.updateChangedIdentifOrDescriptAttribute();
            }
        }
    }

    /**
     * A component's lifecycle method. Fired once when component was mounted.
     * Method responsible for setting the color of column headers accordingly to the attribute preference type during initialization of the component.
     * Runs only once, after component is mounted (after first [render]{@link DisplayData#render} and before methods shouldComponentUpdate() and [componentDidUpdate]{@link DisplayData#componentDidUpdate}).
     *
     * @function
     * @memberOf Data
     */
    componentDidMount() {
        if(this.props.informationTable == null || this.props.refreshNeeded) this.fetchDataFromServerOrParent(true, true);
        else this.fetchDataFromServerOrParent(false, true);
        this._isMounted = true;    
    }

    /**
     * Method responsible for preparing whole project to update it (in the parent).
     *
     * @function
     * @memberOf Data
     */
    updateProject = () => {
        const tmpMetaData = this.prepareMetadataFileBeforeSendingToServer();
        const tmpData = this.prepareDataFileBeforeSendingToServer();
        this.updateInfoTableInTheParent(true, tmpMetaData, tmpData);

        const tmpProject = JSON.parse(JSON.stringify(this.props.project));
        tmpProject.dataHistory = {historySnapshot: this.state.historySnapshot, history: this.state.history};
        tmpProject.isDataFromServer = false;
        this.props.updateProject(tmpProject); //run parent method
    }

    /**
     * @function
     * @memberof Data
     * @param {boolean} isUpdateNecessary - The parameter indicates if the information table should be send to the server.
     * @param {Array} [args] - It is either empty array (no data were passed) or the array containing metadata and data, in that order. 
     */
    updateInfoTableInTheParent = (isUpdateNecessary, ...args) => {
        if(args.length > 0) {
            this.props.onDataChange({attributes: args[0], objects: args[1]}, isUpdateNecessary); //run parent method
        } else {
            const tmpMetaData = this.prepareMetadataFileBeforeSendingToServer();
            const tmpData = this.prepareDataFileBeforeSendingToServer();
            this.props.onDataChange({attributes: tmpMetaData, objects: tmpData}, isUpdateNecessary); //run parent method
        }
    }

    /**
     * A component's lifecycle method. Fired when component was requested to be unmounted.
     *
     * @function
     * @memberOf Data
     */
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Method returns the object containing of number part and rest of the string.
     * It is used e.g. when holding CTRL and double clicking on the square placed in the bottom right corner of the cell (in the identification attribute).
     *
     * @function
     * @memberOf Data
     * @param {string} text - Text to be divided into number part and constant part.
     * @returns {Object}
     */
    getNumberPartAndConstantPart(text) {
        let main = "";
        let num = "";
        let numberPartEnd = false
        for(let i=text.length-1; i>=0; i--) {
            if(text[i] >= '0' && text[i] <= '9' && !numberPartEnd) {
                num = text[i] + num;
            } else {
                numberPartEnd = true;
                main = text[i] + main;
            }
        }
        return {
            constantPart: main,
            numberPart: num
        }
    }

    /**
     * Method returns absolute value of an integer / real number.
     *
     * @function
     * @memberOf Data
     * @param {Number} x - It is the number from which absolute value will be taken.
     */
    absoluteValue(x) {
        return x < 0 ? -x : x;
    }

    /**
     * Method responsible for updating displayed data when the value in the cell changes (or multiple values when dragging). First row has index 0.
     *
     * @function
     * @memberOf Data
     * @param {string} action - Indicates which action triggered the update. Can be one of [CELL_UPDATE, COLUMN_FILL, COPY_PASTE, CELL_DRAG]
     * @param {string} cellKey - Indicates on which column updated has been done
     * @param {Number} fromRow - Indicates which row have been changed (or when dragging - from which row dragging has began).
     * @param {Number} toRow - Indicates on which row dragging has ended (or if the number is the same as fromRow, then which row has been changed) inclusive.
     * @param {Object} updated - Indicates on which column and to which value changes happend.
     * It is a pair key - value, where the key is the column key and the value is the value of the cell to which the cell has been changed.
     */
    onGridRowsUpdated = ({ action, cellKey, fromRow, toRow, updated }) => {
        const ctrlKeyPressed = this.ctrlKeyDown !== -1;
        if(action === "COLUMN_FILL") {
            this.setState({
                isLoading: true
            }, () => {
                setTimeout(() => {
                    this.setState(prevState => {
                        const rows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
                        const filtered = this.filteredRows();
                        const editedCol = prevState.history[prevState.historySnapshot].columns.find(x => x.key === cellKey)

                        if(ctrlKeyPressed && updated[cellKey] !== "?") {
                            let NumOfValsToReplaceThatExceededMax = 0;
                            let updatedTmp = {...updated};

                            if(editedCol.valueType === "integer") {
                                const tmp = parseInt(updated[cellKey],10);
                                if(toRow - fromRow + tmp - MAX_INT > 0) {
                                    NumOfValsToReplaceThatExceededMax = toRow - fromRow + tmp - MAX_INT;
                                }

                                for (let i = fromRow; i <= toRow; i++) {
                                    const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                    if(NumOfValsToReplaceThatExceededMax > 0 && i > toRow - NumOfValsToReplaceThatExceededMax) {
                                        updatedTmp[cellKey] = "?";
                                        rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                    }
                                    else {
                                        updatedTmp[cellKey] = i-fromRow+tmp;
                                        rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                    }
                                }
                            } else if(editedCol.valueType === "real") {
                                const tmp = Number(updated[cellKey]);
                                for (let i = fromRow; i <= toRow; i++) {
                                    const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                    updatedTmp[cellKey] = i-fromRow+tmp;
                                    rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                }
                            } else if(editedCol.identifierType === "text") {
                                const {constantPart, numberPart } = this.getNumberPartAndConstantPart(updated[cellKey]);
                                if(numberPart !== "") {
                                    const tmpNumberPart = Number(numberPart);
                                    for (let i = fromRow; i <= toRow; i++) {
                                        const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                        updatedTmp[cellKey] = constantPart + (i-fromRow+tmpNumberPart).toString();
                                        rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                    }
                                } else {
                                    for (let i = fromRow; i <= toRow; i++) {
                                        const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                        rows[rows_index] = { ...filtered[i], ...updated };
                                    }
                                }

                            } else {
                                for (let i = fromRow; i <= toRow; i++) {
                                    const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                    rows[rows_index] = { ...filtered[i], ...updated };
                                }
                            }
                        } else {
                            for (let i = fromRow; i <= toRow; i++) {
                                const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                rows[rows_index] = { ...filtered[i], ...updated };
                            }
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
                    }, () => this.updateProject())
                },500)
            });
        } else if(action === "CELL_DRAG") {
            const { rowIdx, overRowIdx } = this.grid.base.viewport.canvas.interactionMasks.state.draggedPosition || {};
            this.setState(prevState => {
                const rows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
                const filtered = this.filteredRows();
                const editedCol = prevState.history[prevState.historySnapshot].columns.find(x => x.key === cellKey)

                //the Ctrl key has been pressed and hold
                if(ctrlKeyPressed && updated[cellKey] !== "?") {
                    let NumOfValsToReplaceThatExceededMax = 0;
                    let updatedTmp = {...updated};
                    //a column type is integer
                    if(editedCol.valueType === "integer") {
                        const tmp = parseInt(updated[cellKey],10);
                        //dragging downwards
                        if(rowIdx < overRowIdx) {
                            //check if rows that exceeded max integer value exists
                            if(toRow - fromRow + tmp - MAX_INT > 0) {
                                NumOfValsToReplaceThatExceededMax = toRow - fromRow + tmp - MAX_INT;
                            }
                            for (let i = fromRow; i <= toRow; i++) {
                                const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                //if the value exceeded max integer place missing value sign "?"
                                if(NumOfValsToReplaceThatExceededMax > 0 && i > toRow - NumOfValsToReplaceThatExceededMax) {
                                    updatedTmp[cellKey] = "?";
                                    rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                }
                                //update with consecutive number
                                else {
                                    updatedTmp[cellKey] = i-fromRow+tmp;
                                    rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                }
                            }
                            //dragging upwards
                        } else {
                            if(tmp - toRow + fromRow + MAX_INT + 1 < 0) {
                                NumOfValsToReplaceThatExceededMax = - tmp + toRow - fromRow - MAX_INT - 1;
                            }
                            for (let i = toRow - 1; i >= fromRow; i--) {
                                const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                if(NumOfValsToReplaceThatExceededMax > 0 && i < fromRow + NumOfValsToReplaceThatExceededMax) {
                                    updatedTmp[cellKey] = "?";
                                    rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                }
                                else {
                                    updatedTmp[cellKey] = i-toRow+tmp;
                                    rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                }
                            }
                        }
                        //a column type is real
                    } else if(editedCol.valueType === "real") {
                        const tmp = Number(updated[cellKey]);
                        //dragging downwards
                        if(rowIdx < overRowIdx) {
                            for (let i = fromRow; i <= toRow; i++) {
                                const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                updatedTmp[cellKey] = i-fromRow+tmp;
                                rows[rows_index] = { ...filtered[i], ...updatedTmp };
                            }
                            //dragging upwards
                        } else {
                            for (let i = toRow - 1; i >= fromRow; i--) {
                                const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                updatedTmp[cellKey] = i-toRow+tmp;
                                rows[rows_index] = { ...filtered[i], ...updatedTmp };
                            }
                        }
                        //a column type is identification, identifierType is text
                    } else if(editedCol.identifierType === "text") {
                        const {constantPart, numberPart } = this.getNumberPartAndConstantPart(updated[cellKey]);
                        if(numberPart !== "") {
                            const tmpNumberPart = Number(numberPart);
                            //dragging downwards
                            if(rowIdx < overRowIdx) {
                                for (let i = fromRow; i <= toRow; i++) {
                                    const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                    updatedTmp[cellKey] = constantPart + (i-fromRow+tmpNumberPart).toString();
                                    rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                }
                                //dragging upwards
                            } else {
                                for (let i = toRow - 1; i >= fromRow; i--) {
                                    const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                    updatedTmp[cellKey] = constantPart + (this.absoluteValue(i-toRow+tmpNumberPart)).toString();
                                    rows[rows_index] = { ...filtered[i], ...updatedTmp };
                                }
                            }
                        } else {
                            for (let i = fromRow; i <= toRow; i++) {
                                const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                                rows[rows_index] = { ...filtered[i], ...updated };
                            }
                        }
                    } else {
                        for (let i = fromRow; i <= toRow; i++) {
                            const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                            rows[rows_index] = { ...filtered[i], ...updated };
                        }
                    }
                } else {
                    for (let i = fromRow; i <= toRow; i++) {
                        const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                        rows[rows_index] = { ...filtered[i], ...updated };
                    }
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
            }, () => this.updateProject())
        } else {
            let isTheSame = false;
            this.setState(prevState => {
                const rows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
                const filtered = this.filteredRows();
                const tmp = Object.entries(updated)[0];
                const editedCol = prevState.history[prevState.historySnapshot].columns.find(x => x.key === tmp[0])

                if(tmp[1]==="") {
                    const message = <span> Cell hasn't been updated. <br/> Empty value isn't valid input. Use question mark (?) instead. </span>
                    return {
                        isOpenedNotification: true,
                        errorMessage: message,
                        errorMessageSeverity: 'error'
                    }
                }
                if(editedCol.valueType === "real") { //enable only reals and "?"
                    if(tmp[1] !== "?" && isNaN(Number(tmp[1]))) {
                        const message = <span> Cell hasn't been updated. <br/> Column type: real <br/> The entered value: {tmp[1]}, which is invalid. </span>
                        return {
                            isOpenedNotification: true,
                            errorMessage: message,
                            errorMessageSeverity: 'error'
                        }
                    }
                } else if(editedCol.valueType === "integer") { //enable only integers and "?"
                    if(tmp[1] !== "?" && (isNaN(Number(tmp[1])) || tmp[1].indexOf(".") !== -1 )) {
                        const message = <span> Cell hasn't been updated. <br/> Column type: integer <br/> The entered value: {tmp[1]}, which is invalid. </span>
                        return {
                            isOpenedNotification: true,
                            errorMessage: message,
                            errorMessageSeverity: 'error'
                        }
                    }
                } else if(editedCol.valueType === "enumeration") { //enable only domain elements and "?" - can happen only during ctrl+c, ctrl+v
                    if(tmp[1] !== "?" && !editedCol.domain.includes(tmp[1])) {
                        const message = <span> Cell hasn't been updated. <br/> Column type: enumeration <br/> The entered value: {tmp[1]}, which is invalid. <br/> Please check the domain. </span>
                        return {
                            isOpenedNotification: true,
                            errorMessage: message,
                            errorMessageSeverity: 'error'
                        }
                    }
                }

                for (let i = fromRow; i <= toRow; i++) {
                    const rows_index = rows.map( x => x.uniqueLP ).indexOf(filtered[i].uniqueLP);
                    if(fromRow === toRow) //check if any change happend
                    {
                        if(rows[rows_index][tmp[0]] === tmp[1]) {
                            isTheSame = true;
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
            }, () => {
                if(!isTheSame) this.updateProject();
            })
        }
        this.ctrlKeyDown = -1;
    };

    /**
     * Method responsible for sorting data. Runs when the header of the column is clicked.
     *
     * @function
     * @memberOf Data
     * @param {string} sortColumn - Indicates which column header has been clicked i.e. which column should be sorted. This is the column key.
     * @param {Number} sortDirection - Indicates which way sorting should take place. This is one of the values "ASC", "DESC", "NONE", which stand for ascending, descending and none.
     */
    onGridSort = (sortColumn, sortDirection) => {
        let tmpEnableRowInsert = -1;
        const tmpCol = this.state.history[this.state.historySnapshot].columns.find(col => col.key === sortColumn);
        let numberSorting = false;
        if(tmpCol.valueType !== undefined && (tmpCol.valueType === "integer" || tmpCol.valueType === "real")) numberSorting = true;
        if(this.ctrlPlusC) this.turnOffCellCopyPaste();
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
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
        }, () => this.updateProject());
    };

    /**
     * Method responsible for adding selected rows to the selectedRows array which is in the state (selected row is the row in which the checkbox on the left of the row is marked).
     *
     * @function
     * @memberOf Data
     * @param {Array} rows - Indicates which row has been selected. It consists of two objects. The first one is rowIdx, which is the number of row from the top (indexing from 0).
     * The second object is row object containg all the pairs key-value for the row.
     */
    onRowsSelected = (rows) => {
        this.setState( (prevState) => ({
            selectedRows: prevState.selectedRows.concat(rows.map(r => r.row.uniqueLP))
        }));
    };

    /**
     * Method responsible for removing deselected, i.e. the checkbox on the left of the row is unmarked, rows from the selectedRows array which is in the state.
     *
     * @function
     * @memberOf Data
     * @param {Array} rows - Indicates which row has been deselected. It consists of two objects. The first one is rowIdx, which is the number of row from the top (indexing from 0).
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
     *
     * @function
     * @memberOf Data
     * @param {Object} filter - Consists of two key-value pairs. The first one is the column object containg all the pairs key-value for the column.
     * The second is flterTerm which has been written in the filter field.
     * If there is more than one filter term (e.g. in numeric filter let's choose numbers 1,2,3 and greater than 10. Then we have: 1,2,3,>10) the filter term
     * becomes the array. The class NumericFilter is responsible for handling numeric filters.
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
     *
     * @function
     * @memberOf Data
     * @param {Array} rows - All the rows i.e. this is the array containing all the rows where each row (object of the array) consists of key-value pairs
     * @param {Array} filters - All the filters i.e. this is the array containing [filter objects]{@link DisplayData#handleFilterChange}
     */
    getRows(rows, filters) {
        return selectors.getRows({ rows, filters });
    }

    /**
     * Method responsible for getting all the filtered rows. Uses method [getRows]{@link DisplayData#getRows}.
     *
     * @function
     * @memberOf Data
     */
    filteredRows = () => {
        if(this.state.history[this.state.historySnapshot] !== undefined) {
            return this.getRows(this.state.history[this.state.historySnapshot].rows, this.state.filters);
        }
        return [];
    }

    /**
     * Method responsible for clearing filters.
     *
     * @function
     * @memberOf Data
     */
    onClearFilters = () => {
        this.setState({
            filters: {},
            selectedRows: []
        })
    }

    /**
     * Method responsible for removing certain row after choosing option "Delete object" from right click menu.
     *
     * @function
     * @memberOf Data
     * @param {Number} rowIdx - Indicates the row number from the top, to be removed.
     */
    deleteRowByRowIdx = (rowIdx) => {
        this.setState(prevState => {
            const nextRows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
            if( nextRows[rowIdx] !== undefined) {
                if(this.ctrlPlusC) this.turnOffCellCopyPaste();
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
        }, () => this.updateProject())
    };

    /**
     * Method responsible for removing selected rows (the selected row means that the checkbox on the left of the row is marked).
     *
     * @function
     * @memberOf Data
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
            this.updateProject();
        })
    };

    /**
     * Method responsible for adding row. After right click menu one can add row above ("Add new object above") or below ("Add new object below") the clicked row.
     * After "ADD NEW OBJECT" button click one can add row at the end of the rows array.
     *
     * @function
     * @memberOf Data
     * @param {Number} rowIdx - Indicates the row number from the top.
     * @param {string} where - Indicates where to add the row. The existing options are "above" or "below" (the clicked row) or any other name which means at the end of the rows array.
     */
    insertRow = (rowIdx, where) => {
        this.setState(prevState => {
            const nextRows = JSON.parse(JSON.stringify(prevState.history[prevState.historySnapshot].rows));
            const newRow = {};
            prevState.history[prevState.historySnapshot].columns.forEach( col => {
                if(col.key !== "uniqueLP") newRow[col.key] = "?";
            });

            if( nextRows[rowIdx] !== undefined) { //if the cell is selected (and exists)
                if(this.ctrlPlusC) this.turnOffCellCopyPaste();
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
        }, () => this.updateProject());

    };

    /**
     * Method responsible for opening the "Add attribute" dialog. The dialog is accessible through the "ADD ATTRIBUTE" button.
     *
     * @function
     * @memberOf Data
     */
    onAddAttribute = () => {
        this.setState({isOpenedAddAttribute: true});
    }

    /**
     * Method responsible for opening the "Edit attributes" dialog. The dialog is accessible through the "EDIT ATTRIBUTES" button.
     *
     * @function
     * @memberOf Data
     */
    onEditAttributes = () => {
        this.setState({isOpenedEditAttributes: true});
    }

    /**
     * Method responsible for closing the "Add attribute" dialog. The dialog is accessible through the "ADD ATTRIBUTE" button.
     *
     * @function
     * @memberOf Data
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
     *
     * @function
     * @memberOf Data
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
     * Method responsible for closing the transform dialog. The method is executed when the chosen option is "No" in the [transform dialog]{@link DisplayData#openOnTransform}.
     *
     * @function
     * @memberOf Data
     */
    closeOnTransform = () => {
        this.setState({
            isOpenedTransform: false,
        })
    }

    /**
     * Method responsible for opening the transform dialog. The dialog is accessible through the "TRANSFORM" button, but only when modifications have not been saved.
     *
     * @function
     * @memberOf Data
     */
    openOnTransform = () => {
        this.setState({
            isOpenedTransform: true,
        })
    }

    /**
     * Method responsible for imposing preference order when evaluation attribute doesn't have preference order.
     * For more information [click here]{@link https://github.com/ruleLearn/rulelearn/blob/develop/src/main/java/org/rulelearn/data/InformationTable.java#L922}.
     *
     * @function
     * @memberOf Data
     */
    onTransformAttributes = () => {
        const base = this.props.serverBase;
        if(this.state.dataModified) {
            this.setState({
                isLoading: true,
                isOpenedTransform: false,
            }, () => {
                let formData = new FormData();
                formData.append('binarizeNominalAttributesWith3PlusValues', this.state.binarizeNominalAttributesWith3PlusValues);
                formData.append('metadata', JSON.stringify(this.prepareMetadataFileBeforeSendingToServer()));
                formData.append('data', JSON.stringify(this.prepareDataFileBeforeSendingToServer()));

                fetch(`${base}/projects/${this.props.project.id}/imposePreferenceOrder`, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if(response.status === 200) {
                        response.json().then(result => {
                            if(this._isMounted) {
                                this.isDataFromServer = true;
                                const tmpHistory = this.state.history.slice(0, this.state.historySnapshot+1);
                                tmpHistory.push({rows: this.prepareDataFromImport(result.objects), columns: this.prepareMetaDataFromImport(result.attributes), historyActionSubject: 'both'});
                                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                                this.setState({
                                    isLoading: false,
                                    dataModified: true,
                                    history: tmpHistory,
                                    historySnapshot: tmpHistory.length-1,
                                }, () => {
                                    this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,true));
                                    this.replaceMissingDataWithQuestionMarks();
                                    this.updateProject();
                                })
                            }

                        }).catch(err => {
                        })
                    } else if(response.status === 404) {
                        response.json().then(result => {
                            const message = <span> {result.message} </span>
                            if(this._isMounted) {
                                this.setState({
                                    isOpenedNotification: true,
                                    errorMessage: message,
                                    errorMessageSeverity: 'error',
                                    isLoading: false,
                                })
                            }
                        }).catch(err => {
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                        })
                    } else {
                        response.json().then(result => {
                            const message = <span> {result.message} </span>
                            if(this._isMounted) {
                                this.setState({
                                    isOpenedNotification: true,
                                    errorMessage: message,
                                    errorMessageSeverity: 'error',
                                    isLoading: false,
                                })
                            }
                        }).catch(err => {
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                        })
                    }
                }).catch(err => {
                    if(this._isMounted) {
                        this.setState({
                            isLoading: false,
                        })
                    }
                })
            })
        } else {
            this.setState({
                isLoading: true,
                isOpenedTransform: false,
            }, () => {
                let link = `${base}/projects/${this.props.project.id}/imposePreferenceOrder?binarizeNominalAttributesWith3PlusValues=${this.state.binarizeNominalAttributesWith3PlusValues}`;

                fetch(link, {
                    method: 'GET'
                }).then(response => {
                    if(response.status === 200) {
                        response.json().then(result => {
                            if(this._isMounted) {
                                this.isDataFromServer = true;
                                const tmpHistory = this.state.history.slice(0, this.state.historySnapshot+1);
                                tmpHistory.push({rows: this.prepareDataFromImport(result.objects), columns: this.prepareMetaDataFromImport(result.attributes), historyActionSubject: 'both'});
                                if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                                this.setState({
                                    isLoading: false,
                                    dataModified: true,
                                    history: tmpHistory,
                                    historySnapshot: tmpHistory.length-1
                                }, () => {
                                    this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,true));
                                    this.replaceMissingDataWithQuestionMarks();
                                    this.updateProject();
                                })
                            }
                        }).catch(err => {
                        })
                    } else if(response.status === 404) {
                        response.json().then(result => {
                            const message = <span> {result.message} </span>
                            if(this._isMounted) {
                                this.setState({
                                    isOpenedNotification: true,
                                    errorMessage: message,
                                    errorMessageSeverity: 'error',
                                    isLoading: false,
                                })
                            }
                        }).catch(err => {
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                        })
                    } else {
                        response.json().then(result => {
                            const message = <span> {result.message} </span>
                            if(this._isMounted) {
                                this.setState({
                                    isOpenedNotification: true,
                                    errorMessage: message,
                                    errorMessageSeverity: 'error',
                                    isLoading: false,
                                })
                            }
                        }).catch(err => {
                            if(this._isMounted) {
                                this.setState({
                                    isLoading: false,
                                })
                            }
                        })
                    }
                }).catch(err => {
                    if(this._isMounted) {
                        this.setState({
                            isLoading: false,
                        })
                    }
                })
            })
        }
    }

    /**
     * Method responsible for preparing metadata before sending it to the server. E.g. removing certain properties from all the columns like sorting, filtering, resizing, width etc.
     *
     * @function
     * @memberOf Data
     * @returns {Array}
     */
    prepareMetadataFileBeforeSendingToServer() {
        if(this.state.history[this.state.historySnapshot] === undefined) return ;
        const newMetadata = JSON.parse(JSON.stringify(this.state.history[this.state.historySnapshot].columns)).map(({editable,sortable,resizable,filterable,visible,draggable,editor,filterRenderer,sortDescendingFirst,key,width,...others}) => others);

        //remove No. column
        if(newMetadata.length > 0) newMetadata.shift();

        //remove missing value sign ("?")
        newMetadata.forEach(col => {
            if(col.domain !== undefined && col.domain[col.domain.length-1] === "?") col.domain.pop();
        })
        return newMetadata;
    }

    /**
     * Method responsible for preparing data before sending it to the server. I.e. removing "No." property from all the rows.
     *
     * @function
     * @memberOf Data
     * @returns {Array}
     */
    prepareDataFileBeforeSendingToServer() {
        if(this.state.history[this.state.historySnapshot] === undefined) return ;
        const newData = JSON.parse(JSON.stringify(this.state.history[this.state.historySnapshot].rows)).map( ({uniqueLP, ...others}) => others);
        return newData;
    }

    /**
     * In the "Save to file" dialog this method is responsible for remembering if the user wants to download the metadata in JSON format
     *
     * @function
     * @memberOf Data
     * @param {Object} e - Represents an event that takes place in DOM tree.
     */
    handleChangeSaveToFileMetaData = (e) => {
        this.setState({
            saveToFileMetaData: e.target.checked
        })
    }

    /**
     * In the "Save to file" dialog this method is responsible for remembering if the user wants to download the data in JSON or CSV format
     *
     * @function
     * @memberOf Data
     * @param {Object} e - Represents an event that takes place in DOM tree.
     */
    handleChangeSaveToFileData = (e) => {
        this.setState({
            saveToFileData: e.target.value
        })
    }

    /**
     * In the "Save to file" dialog this method is responsible for remembering if the user wants to have the header in CSV format
     *
     * @function
     * @memberOf Data
     * @param {Object} e - Represents an event that takes place in DOM tree.
     */
    handleChangeSaveToFileCsvHeader = (e) => {
        this.setState({
            saveToFileCsvHeader: e.target.checked
        })
    }

    /**
     * In the "Save to file" dialog this method is responsible for remembering the separator in CSV format
     *
     * @function
     * @memberOf Data
     * @param {string} selected - Selected option from the separator list. One of [comma, semicolon, space, tab].
     */
    getSelectedSaveToFileCsvSeparator = (selected) => {
        this.setState({
            saveToFileCsvSeparator: selected
        })
    }

    /**
     * Method responsible for closing the "Save to file" dialog. The dialog is accessible through the "SAVE TO FILE" button.
     *
     * @function
     * @memberOf Data
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
     *
     * @function
     * @memberOf Data
     */
    openOnSaveToFile = () => {
        this.setState({
            isOpenedSaveToFile: true,
        })
    }

    /**
     * Method resonsible for passing (to [this method]{@link DisplayData#saveDataToCsvOrJson}) appropriate parameters for saving (downloading) files.
     *
     * @function
     * @memberOf Data
     */
    saveToFile = () => {
        if(this.state.saveToFileMetaData) {
            this.saveMetaDataToJson(this.props.project.name + "_metadata.json");
        }
        if(this.state.saveToFileData === 'json') {
            this.saveDataToCsvOrJson(this.props.project.name + "_data.json", -1, -1);
        } else if(this.state.saveToFileData === 'csv') {
            let separator = " ";
            if(this.state.saveToFileCsvSeparator === "tab") separator = "%09";
            else if(this.state.saveToFileCsvSeparator === "semicolon") separator = ";";
            else if(this.state.saveToFileCsvSeparator === "comma") separator = ",";
            //else it is space
            this.saveDataToCsvOrJson(this.props.project.name + "_data.csv", this.state.saveToFileCsvHeader, separator);
        }

        this.setState({
            isOpenedSaveToFile: false,
            saveToFileMetaData: false,
            saveToFileData: '',
            saveToFileCsvHeader: false,
            saveToFileCsvSeparator: '',
        })
    }

    /**
     * Method responsible for saving (downloading) data file.
     *
     * @function
     * @memberOf Data
     * @param {string} name - Stands for the name of the file, usually server replace this name
     * @param {Object} header - True if CSV file needs to be saved with header row, -1 if it is JSON file (no header)
     * @param {Object} separator - Separator in the CSV file, -1 if it JSON file (no separator)
     */
    saveDataToCsvOrJson = (name, header, separator) => {
        const base = this.props.serverBase;
        if(this.state.dataModified) {
            let filename = name;
            let link = `${base}/projects/${this.props.project.id}/data/download`;
            if(header === -1) { //json
                link += `?format=json`;
            } else { //csv
                link += `?format=csv`;
                link += `&separator=${separator}`;
                link += `&header=${header}`;
            }

            let formData = new FormData();
            formData.append('metadata', JSON.stringify(this.prepareMetadataFileBeforeSendingToServer()));
            formData.append('data', JSON.stringify(this.prepareDataFileBeforeSendingToServer()));

            fetch(link, {
                method: 'PUT',
                body: formData
            }).then(response => {
                if(response.status === 200) {
                    filename =  response.headers.get('Content-Disposition').split('filename=')[1];
                    response.blob().then(result => {
                        const url = window.URL.createObjectURL(result);
                        const b = document.createElement('a');
                        b.href = url;
                        b.download = filename;
                        b.click();
                    }).catch(err => {
                    })
                } else if(response.status === 406) {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                } else if(response.status === 500) {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                } else {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                }
            }).catch(err => {
            })

        } else {
            let filename = name;

            let link = `${base}/projects/${this.props.project.id}/data/download`;
            if(header === -1) { //json
                link += `?format=json`;
            } else { //csv
                link += `?format=csv`;
                link += `&separator=${separator}`;
                link += `&header=${header}`;
            }

            fetch(link, {
                method: 'GET'
            }).then(response => {
                if(response.status === 200) {
                    filename =  response.headers.get('Content-Disposition').split('filename=')[1];
                    response.blob().then(result => {
                        const url = window.URL.createObjectURL(result);
                        const b = document.createElement('a');
                        b.href = url;
                        b.download = filename;
                        document.body.appendChild(b);
                        b.click();
                        document.body.removeChild(b);
                    }).catch(err => {
                    })
                } else if(response.status === 404) {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                } else if(response.status === 406) {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                } else {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                }
            }).catch(err => {
            })

        }
    }

    /**
     * Method responsible for saving (downloading) metadata file.
     *
     * @function
     * @memberOf Data
     * @param {string} name - Stands for the name of the file, usually server replace this name
     */
    saveMetaDataToJson = (name) => {
        const base = this.props.serverBase;
        if(this.state.dataModified) {
            let filename = name;
            let formData = new FormData();
            formData.append('metadata', JSON.stringify(this.prepareMetadataFileBeforeSendingToServer()));

            fetch(`${base}/projects/${this.props.project.id}/metadata/download`, {
                method: 'PUT',
                body: formData
            }).then(response => {
                if(response.status === 200) {
                    filename =  response.headers.get('Content-Disposition').split('filename=')[1];
                    response.blob().then(result => {
                        let url = window.URL.createObjectURL(result);
                        let link = document.createElement('a');
                        link.href = url;
                        link.download = filename;
                        link.click();
                    }).catch(err => {
                    })
                } else if(response.status === 406) {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                } else if(response.status === 500) {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                } else {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                }
            }).catch(err => {
            })
        } else {
            let filename = name;
            fetch(`${base}/projects/${this.props.project.id}/metadata/download`, {
                method: 'GET'
            }).then(response => {
                if(response.status === 200) {
                    filename =  response.headers.get('Content-Disposition').split('filename=')[1];
                    response.blob().then(result => {
                        let url = window.URL.createObjectURL(result);
                        let link = document.createElement('a');
                        link.href = url;
                        link.download = filename;
                        link.click();
                    }).catch(err => {
                    })
                } else if(response.status === 404) {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                } else if(response.status === 406) {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                } else {
                    response.json().then(result => {
                        const message = <span> {result.message} </span>
                        if(this._isMounted) {
                            this.setState({
                                isOpenedNotification: true,
                                errorMessage: message,
                                errorMessageSeverity: 'error'
                            })
                        }
                    }).catch(err => {
                    })
                }
            }).catch(err => {
            })
        }
    }

    /**
     * Method returns columns for the current history step
     *
     * @function
     * @memberOf Data
     */
    getColumns() {
        if(this.state.history[this.state.historySnapshot] !== undefined) {
            const newColumns = this.state.history[this.state.historySnapshot].columns.filter(x => x.visible !== false);
            return newColumns;
        }
        return [];
    }

    /**
     * Method responsible for remembering selected attribute type.
     *
     * @function
     * @memberOf Data
     * @param {Object} selected - It is one of [identification, description, condition, decision]
     */
    getSelectedAttributeType = (selected) => {
        this.setState({attributeTypeSelected: selected});
    }

    /**
     * Method responsible for remembering selected attribute preference type.
     *
     * @function
     * @memberOf Data
     * @param {Object} selected - It is one of [gain, cost, none]
     */
    getSelectedAttributePreferenceType = (selected) => {
        this.setState({attributePreferenceTypeSelected: selected});
    }

    /**
     * Method responsible for remembering selected attribute value type.
     *
     * @function
     * @memberOf Data
     * @param {Object} selected - It is one of [integer, real, enumeration]
     */
    getSelectedValueType = (selected) => {
        this.setState({valueTypeSelected: selected});
    }

    /**
     * Method responsible for remembering selected identifier type.
     *
     * @function
     * @memberOf Data
     * @param {Object} selected - It is one of [uuid, text]
     */
    getSelectedIdentifierType = (selected) => {
        this.setState({identifierTypeSelected: selected});
    }

    /**
     * Method responsible for remembering selected missing value type.
     *
     * @function
     * @memberOf Data
     * @param {Object} selected - It is one of [mv1.5, mv2]
     */
    getSelectedMissingValueType = (selected) => {
        this.setState({missingValueTypeSelected: selected});
    }

    /**
     * Method responsible for closing notification.
     *
     * @function
     * @memberOf Data
     * @param {Object} reason - Reason of closing notification
     * @param {Object} event - Represents an event that takes place in DOM
     */
    closeOpenedNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenedNotification: false,
        })
    }

    /**
     * Method responsible for closing right click header menu.
     *
     * @function
     * @memberOf Data
     * @param {string} selected - It is one of [Delete attribute, Edit attribute, Mark attribute as: active, Mark attribute as: inactive]
     */
    closeOpenedColumnHeaderMenu = (selected) => {
        if(selected !== undefined) {
            let history = [...this.state.history];
            let cols = [...history[this.state.historySnapshot].columns];
            for(let i=0; i<cols.length; i++) {
                if(cols[i].key === this.state.columnKeyOfHeaderMenuOpened) {
                    if(selected === "Edit attribute") {
                        this.setState({
                            isOpenedEditAttributes: true,
                            editAttributeSelected: cols[i].name,
                            isColumnHeaderMenuOpened: null,
                            columnKeyOfHeaderMenuOpened: -1,
                        })
                    } else if(cols[i].type === "decision" && cols[i].active === false && selected === "Mark attribute as: active" && this.activeDecisionAttributeAlreadyExists(i)) {
                        const message = <span>
                                            There is already active decision attribute. <br/>
                                            Deactivate the other decision attribute in order to use this one. 
                                        </span>;
                        this.setState({
                            isOpenedNotification: true,
                            errorMessage: message,
                            errorMessageSeverity: 'error',
                            isColumnHeaderMenuOpened: null,
                            columnKeyOfHeaderMenuOpened: -1,
                        })
                    } else if(cols[i].identifierType !== undefined && cols[i].active === false && selected === "Mark attribute as: active" && this.activeIdentificationAttributeAlreadyExists(i)) {
                        const message = <span>
                                            There is already active identification attribute. <br/>
                                            Deactivate the other identification attribute in order to use this one. 
                                        </span>;
                        this.setState({
                            isOpenedNotification: true,
                            errorMessage: message,
                            errorMessageSeverity: 'error',
                            isColumnHeaderMenuOpened: null,
                            columnKeyOfHeaderMenuOpened: -1,
                        })
                    } else {
                        let col = {...cols[i]};
                        let removedColumn = false;
                        if(selected === "Mark attribute as: inactive" || selected === "Mark attribute as: active") {
                            col.active = !col.active;
                            cols[i] = col;
                        } else if(selected === "Delete attribute") {
                            if(this.ctrlPlusC) this.turnOffCellCopyPaste();
                            removedColumn = cols.splice(i,1);
                        }

                        const tmpHistory = history.slice(0, this.state.historySnapshot+1);
                        tmpHistory.push({rows: history[this.state.historySnapshot].rows, columns: cols, historyActionSubject: 'column'});
                        if(tmpHistory.length - 1 > maxNoOfHistorySteps) tmpHistory.shift();
                        this.setState({
                            dataModified: true,
                            isColumnHeaderMenuOpened: null,
                            columnKeyOfHeaderMenuOpened: -1,
                            history: tmpHistory,
                            historySnapshot: tmpHistory.length-1
                        },() => {
                            if(typeof removedColumn === "boolean") {
                                this.setHeaderColorAndStyle(cols[i],i,false);
                                this.checkIfUpdateOfAttributesNeeded({...col}, true);
                            }
                            else this.checkIfUpdateOfAttributesNeeded({...removedColumn[0]}, false);
                            this.updateProject();
                        });

                        break;
                    }
                }
            }
        } else {
            this.setState({
                isColumnHeaderMenuOpened: null,
                columnKeyOfHeaderMenuOpened: -1,
            })
        }
    }

    /**
     * Method responsible for checking if any attribute with the same name already exists.
     * It is used in the Add attribute dialog
     *
     * @function
     * @memberOf Data
     * @param {string} name - It is the name of the new attribute
     */
    attributeAlreadyExists = (name) => {
        for(let i in this.state.history[this.state.historySnapshot].columns) {
            if(this.state.history[this.state.historySnapshot].columns[i].name === name) {
                return true;
            }
        }
        return false;
    }

    /**
     * Method responsible for checking if any attribute with the same name already exists.
     * It is used in the Edit attributes dialog
     *
     * @function
     * @memberOf Data
     * @param {string} name - It is the name of the new attribute
     * @param {integer} coldIdx - It is the index of the edited column
     */
    attributeAlreadyExistAndIsDifferentThanSelected(name, colIdx) {
        for(let i=0; i<this.state.history[this.state.historySnapshot].columns.length; i++) {
            if(this.state.history[this.state.historySnapshot].columns[i].name === name && i !== colIdx) {
                return true;
            }
        }
        return false;
    }

    /**
     * Method responsible for checking if any identification attribute exists and is active.
     *
     * @function
     * @memberOf Data
     * @param {string} isAddMethodElseIndex - If it is -1 it means adding new column, else it is index of the old column which has been edited.
     */
    activeIdentificationAttributeAlreadyExists(isAddMethodElseIndex) {
        if(isAddMethodElseIndex === -1) {
            for(let i=0; i<this.state.history[this.state.historySnapshot].columns.length; i++) {
                if(this.state.history[this.state.historySnapshot].columns[i].identifierType !== undefined
                    && this.state.history[this.state.historySnapshot].columns[i].active === true) {
                    return true;
                }
            }
        } else {
            for(let i=0; i<this.state.history[this.state.historySnapshot].columns.length; i++) {
                if(this.state.history[this.state.historySnapshot].columns[i].identifierType !== undefined
                    && this.state.history[this.state.historySnapshot].columns[i].active === true
                    && i !== isAddMethodElseIndex) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Method responsible for checking if any decision attribute exists and is active.
     *
     * @function
     * @memberOf Data
     * @param {string} isAddMethodElseIndex - If it is -1 it means adding new column, else it is index of the old column which has been edited.
     */
    activeDecisionAttributeAlreadyExists(isAddMethodElseIndex) {
        if(isAddMethodElseIndex === -1) {
            for(let i=this.state.history[this.state.historySnapshot].columns.length-1; i>=0; i--) {
                if(this.state.history[this.state.historySnapshot].columns[i].type === "decision"
                    && this.state.history[this.state.historySnapshot].columns[i].active === true) {
                    return true;
                }
            }
        } else {
            for(let i=this.state.history[this.state.historySnapshot].columns.length-1; i>=0; i--) {
                if(this.state.history[this.state.historySnapshot].columns[i].type === "decision"
                    && this.state.history[this.state.historySnapshot].columns[i].active === true
                    && i !== isAddMethodElseIndex) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Method responsible for remembering domain elements of the enumeration attribute.
     *
     * @function
     * @memberOf Data
     * @param {Array} array - It is the array containing domain elements
     */
    setDomainElements = (array) => {
        this.setState({
            attributesDomainElements: array,
        })
    }

    /**
     * Method responsible for validating new attribute or validating edited attribute.
     *
     * @function
     * @memberOf Data
     * @param {integer} isAddMethodElseIndex - If it is -1 it means adding new column, else it is index of the old column which has been edited.
     * @param {boolean} active - It is true if the attribute is active, else false
     * @param {string} name - It is the name of the new / edited attribute
     * @param {string} type - It is one of [identification, decision, condition, description]
     * @param {string} mvType - It is one of [mv1.5, mv2]
     * @param {string} identifierType - It is one of [uuid, text]
     * @param {string} preferenceType - It is one of [gain, cost, none]
     * @param {string} valueType - It is one of [integer, real, enumeration]
     * @param {Array} domain - It is the array containing domain elements for the enumeration value type
     * @returns {Boolean}
     */
    validateOnAddAndEditAttribute = (isAddMethodElseIndex, active, name, type, mvType, identifierType, preferenceType, valueType, domain) => {

        let error = ''

        //name validation (restricted + already exist)
        if(name === "uniqueLP" || name === "key" || name === "uniqueLP2") error = <span> You have chosen restricted name for the attribute! Please choose other name.</span>;

        if(isAddMethodElseIndex === -1) { //add new column
            if(this.attributeAlreadyExists(name)) error = <span> The attribute with the same name ({name}) already exists! Please choose other name.</span>;
        } else { //change existing column
            if(this.attributeAlreadyExistAndIsDifferentThanSelected(name, isAddMethodElseIndex)) error = <span> The attribute with the same name ({name}) already exists! Please choose other name.</span>;
        }

        //type validation
        if(type === '') error = <span> You didn't select any attribute type! Please select any.</span>;

        else if(type !== "identification") {
            //only one active decision attribute
            if(type === "decision") {
                if(isAddMethodElseIndex === -1 && active) { //when adding new attribute
                    if(this.activeDecisionAttributeAlreadyExists(-1)) error = <span> There is already active decision attribute. <br/>
                        Deactivate the other decision attribute in order to use this one. <br/> 
                        Or set this one to inactive, apply and then do the change described above. </span>
                } else if(isAddMethodElseIndex !== -1 && active) { //when editing existing attribute
                    if(this.activeDecisionAttributeAlreadyExists(isAddMethodElseIndex)) error = <span> There is already active decision attribute. <br/>
                        Deactivate the other decision attribute in order to use this one. <br/> 
                        Or set this one to inactive, apply and then do the change described above. </span>
                }
            }

            //preference type validation
            else if(preferenceType === '') error = <span> You didn't select any attribute preference type! Please select any.</span>;

            //value type validation
            else if(valueType === '') error = <span> You didn't select any value type! Please select any.</span>;

            //enumeration validation
            else if(valueType === "enumeration") {
                if(domain.length === 0) error = <span> You have chosen enumeration type, but didn't provide any domain! <br/> Please add the domain to your enumeration value type. </span>;

                for(let i=0; i<domain.length; i++) {
                    if(domain[i].text === "") {
                        error = <span> At least one attribute has empty domain! Please fill in the data.</span>;
                        break;
                    }

                    if(error === '' && domain[i].text === "?") {
                        error = <span> You cannot choose '?' for the domain name! Please rename the domain element.</span>;
                        break;
                    }

                    if(error === '') {
                        const domainTmp = domain.map(x => x.text.trim());
                        if(new Set(domainTmp).size !== domainTmp.length) {
                            error = <span> There are at least 2 attributes, which have the same domain name! <br/> The domain name must be unique, so please rename them. </span>;
                            break;
                        }
                    }
                }
            }
        } else {
            if(error === '') {
                //there can be only one active identification attribute
                if(isAddMethodElseIndex === -1 && active) { //when adding new attribute
                    if(this.activeIdentificationAttributeAlreadyExists(-1)) error = <span> There is already active identification attribute. <br/>
                        Deactivate the other identification attribute in order to use this one. <br/> 
                        Or set this one to inactive, apply and then do the change described above. </span>
                } else if(isAddMethodElseIndex !== -1 && active) { //when editing existing attribute
                    if(this.activeIdentificationAttributeAlreadyExists(isAddMethodElseIndex)) error = <span> There is already active identification attribute. <br/>
                        Deactivate the other identification attribute in order to use this one. <br/> 
                        Or set this one to inactive, apply and then do the change described above. </span>
                }

                //identifier type validation
                if(identifierType === '') error = "You didn't select any identifier type! Please select any.";
            }
        }

        this.setState({
            errorMessage: error,
            errorMessageSeverity: 'warning'
        });

        //everything was fine
        if(error === '') return true;

        //there are some errors
        return false;

    }

    /**
     * Method responsible for creating new column (new attribute).
     * It runs only when [validation]{@link DisplayData#validateOnAddAndEditAttribute} gives positive result.
     *
     * @function
     * @memberOf Data
     * @param {string} name - It is the name of the new attribute
     * @param {boolean} active - It is true if the attribute is active, else false
     * @param {string} type - It is one of [identification, decision, condition, description]
     * @param {string} mvType - It is one of [mv1.5, mv2]
     * @param {string} identifierType - It is one of [uuid, text]
     * @param {string} preferenceType - It is one of [gain, cost, none]
     * @param {string} valueType - It is one of [integer, real, enumeration]
     * @param {Array} domain - It is the array containing domain elements for the enumeration value type
     * @returns {Object}
     */
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

    /**
     * Method responsible for setting column header color and its bottom text (e.g. condition, active).
     *
     * @function
     * @memberOf Data
     * @param {Object} column - It is the column object (attribute) on which changes will be made
     * @param {Integer} idx - It is the index of the column in DOM tree
     * @param {boolean} changeWidth - If it is true the width of the column will be set
     */
    setHeaderColorAndStyle = (column, idx, changeWidth) => {
        if(document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes !== undefined) {
            const tmp = document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes;
            if((column.type !== undefined || column.identifierType !== undefined) && !(/<\/?[a-z][\s\S]*>/i.test(column.type))) { //make sure attribute type doesn't contain html tags
                if(tmp.length === 2) {
                    if(column.identifierType !== undefined) {
                        if(column.active) {
                            document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(identification,active)");
                        } else {
                            document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(identification,inactive)");
                        }
                    } else if(column.active) {
                        document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(" + column.type + ",active)");
                    } else {
                        document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].insertAdjacentHTML("beforeend", "<br/>(" + column.type + ",inactive)");
                    }
                } else if(tmp.length > 2) {
                    if(column.identifierType !== undefined) {
                        if(column.active) {
                            document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes[3].textContent = "(identification,active)";
                        } else {
                            document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes[3].textContent = "(identification,inactive)";
                        }
                    } else if(column.active) {
                        document.getElementsByClassName("react-grid-HeaderCell-sortable")[idx].childNodes[3].textContent = "(" + column.type + ",active)";
                    } else {
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

    /**
     * Method responsible for setting right click column header menu.
     *
     * @function
     * @memberOf Data
     * @param {Object} column - It is the column object (attribute) on which changes will be made
     * @param {Integer} idx - It is the index of the column in DOM tree
     */
    setHeaderRightClick = (column, idx) => {
        //right-click
        document.getElementsByClassName("react-grid-HeaderCell")[idx].oncontextmenu = (e) => {
            e.preventDefault();
            var isRightMB;
            e = e || window.event;
            if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                isRightMB = e.which === 3;
            else if ("button" in e)  // IE, Opera 
                isRightMB = e.button === 2;

            if(isRightMB) {
                this.setState({
                    isColumnHeaderMenuOpened: e,
                    columnKeyOfHeaderMenuOpened: column.key,
                })
                return(false);
            }
        }
    }

    /**
     * Auxiliary method responsible for preparing columns headers.
     *
     * @function
     * @memberOf Data
     * @param {Object} column - It is the column object (attribute) on which changes will be made
     * @param {Integer} idx - It is the index of the column in DOM tree
     * @param {boolean} changeWidth - If it is true the width of the column will be set
     */
    setHeaderColorAndStyleAndRightClick = (column, idx, changeWidth) => {
        this.setHeaderColorAndStyle(column, idx, changeWidth);
        this.setHeaderRightClick(column, idx);
    }

    /**
     * Method responsible for renaming key in an object.
     *
     * @function
     * @memberOf Data
     * @param {string} oldName - It is the old key name (the key which will be renamed)
     * @param {string} newName - It is the new key name
     * @param {Object} object - It is the object in which one key is replaced
     */
    renameKeyInObject = (oldName, newName, {[oldName]: old, ...others}) => ({
        [newName]: old,
        ...others
    })

    /**
     * Additionally to the [method]{@link DisplayData#setHeaderColorAndStyleAndRightClick} it also changes rows
     * (e.g. during the change of attribute value type, or fills all rows with missing value sign "?" if it is new attribute)
     *
     * @function
     * @memberOf Data
     * @param {Object} column - It is the old column (before any changes)
     * @param {Integer} idx - It is the index of the column in DOM tree
     * @param {Object} ifIsNewColumnElseOldColumn - It is the column object having changes after its edition, it is boolean if new attribute was added.
     */
    setRowsAndHeaderColorAndStyleAndRightClick = (column, idx, ifIsNewColumnElseOldColumn) => {
        let nextRows = JSON.parse(JSON.stringify(this.state.history[this.state.historySnapshot].rows));
        if(typeof ifIsNewColumnElseOldColumn === "boolean") { //new column fill with "?"
            for(let i in nextRows) {
                nextRows[i][column.key] = "?";
            }
        } else { //editing column

            //name changed
            if(ifIsNewColumnElseOldColumn.name !== column.name) {
                for(let i in nextRows) {
                    nextRows[i] = this.renameKeyInObject(ifIsNewColumnElseOldColumn.key, column.key, nextRows[i]);
                }
            }

            //value type changed
            if(ifIsNewColumnElseOldColumn.valueType !== column.valueType) {
                //old attribute type is identification or new attribute type is identification 
                if(ifIsNewColumnElseOldColumn.valueType === undefined || column.valueType === undefined) {
                    for(let i in nextRows) {
                        nextRows[i][column.key] = "?";
                    }
                    //change from integer to real
                } else if(ifIsNewColumnElseOldColumn.valueType === "integer" && column.valueType === "real") {
                    //do nothing
                    //change from integer to enumeration
                } else if(ifIsNewColumnElseOldColumn.valueType === "integer" && column.valueType === "enumeration") {
                    for(let i in nextRows) {
                        if(!column.domain.includes(nextRows[i][column.key].toString())) nextRows[i][column.key] = "?";
                    }
                    //change from real to integer
                } else if(ifIsNewColumnElseOldColumn.valueType === "real" && column.valueType === "integer") {
                    for(let i in nextRows) {
                        if(nextRows[i][column.key] !== "?") nextRows[i][column.key] = Math.round(nextRows[i][column.key]).toString();
                    }
                    //change from real to enumeration
                } else if(ifIsNewColumnElseOldColumn.valueType === "real" && column.valueType === "enumeration") {
                    for(let i in nextRows) {
                        if(!column.domain.includes(nextRows[i][column.key])) nextRows[i][column.key] = "?";
                    }
                    //change from enumeration to integer
                } else if(ifIsNewColumnElseOldColumn.valueType === "enumeration" && column.valueType === "integer") {
                    for(let i in nextRows) {
                        if(nextRows[i][column.key] !== "?") nextRows[i][column.key] = (ifIsNewColumnElseOldColumn.domain.indexOf(nextRows[i][column.key]) + 1).toString();
                    }
                    //change from enumeration to real
                } else if(ifIsNewColumnElseOldColumn.valueType === "enumeration" && column.valueType === "real") {
                    for(let i in nextRows) {
                        if(nextRows[i][column.key] !== "?") nextRows[i][column.key] = (ifIsNewColumnElseOldColumn.domain.indexOf(nextRows[i][column.key]) + 1.0).toString();
                    }
                }
                //just domain changed
            } else if(ifIsNewColumnElseOldColumn.valueType === "enumeration") {
                for(let i in nextRows) {
                    if(!column.domain.includes(nextRows[i][column.key])) nextRows[i][column.key] = "?";
                }
            }
        }

        let history = [...this.state.history];
        let newHistory = {...history[this.state.historySnapshot]};
        newHistory.rows = nextRows;

        let tmpCols = [...newHistory.columns];
        let tmpCol = {...tmpCols[idx]};
        if(tmpCol.type !== undefined) tmpCol.width = Math.max(120, 20 + 10*tmpCol.name.length, 20+10*(tmpCol.type.length + 9));
        else if(tmpCol.identifierType !== undefined) tmpCol.width = Math.max(120, 20 + 10*tmpCol.name.length, 20+10*(tmpCol.identifierType.length + 9));
        else tmpCol.width = 120;
        tmpCols[idx] = tmpCol;

        newHistory.columns = tmpCols;
        history[this.state.historySnapshot] = newHistory;

        this.setState({
            history: history,
        }, () => {
            this.setHeaderColorAndStyleAndRightClick(column, idx, false);
            this.updateProject();
            if(typeof ifIsNewColumnElseOldColumn !== "boolean") this.checkIfUpdateOfAttributesNeeded({...ifIsNewColumnElseOldColumn}, {...column});
            else if(column.type === "description" || column.identifierType !== undefined) this.updateChangedIdentifOrDescriptAttribute();
        })

    }

    /**
     * Method runs after clicking Apply in the Add Attribute dialog
     *
     * @function
     * @memberOf Data
     */
    applyOnAddAttribute = (e) => {
        e.preventDefault();
        const validationOk = this.validateOnAddAndEditAttribute(-1, e.target.attributeIsActive.checked, e.target.attributeName.value.trim(), this.state.attributeTypeSelected, this.state.missingValueTypeSelected,
            this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements)
        if(validationOk) {
            const newColumn = this.createColumn(e.target.attributeName.value.trim(), e.target.attributeIsActive.checked, this.state.attributeTypeSelected,
                this.state.missingValueTypeSelected, this.state.identifierTypeSelected, this.state.attributePreferenceTypeSelected, this.state.valueTypeSelected, this.state.attributesDomainElements);

            this.setState( (prevState) => {
                let tmpHistory = prevState.history.slice(0, prevState.historySnapshot+1);
                let cols = [...tmpHistory[prevState.historySnapshot].columns];

                tmpHistory.push({rows: tmpHistory[prevState.historySnapshot].rows, columns: [...cols, newColumn], historyActionSubject: 'column'});
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
            },() => {
                this.setRowsAndHeaderColorAndStyleAndRightClick(
                    this.state.history[this.state.historySnapshot].columns[this.state.history[this.state.historySnapshot].columns.length-1],
                    this.state.history[this.state.historySnapshot].columns.length-1, true);
            });
        } else {
            this.setState({
                isOpenedNotification: true,
            });
        }
    }

    /**
     * Method prepares array of html elements which will be displayed through the [render]{@link DisplayData#render} method.
     * These are fields of the Add attribute dialog.
     *
     * @function
     * @memberOf Data
     * @returns {Array}
     */
    displayAddAttributeFields = () => {
        const tmpWrapper = [];
        const tmp = [];
        tmp.push(<FormControlLabel
            control={<StyledCheckbox defaultChecked={true} name="attributeIsActive"/>}
            label="Active"
            labelPlacement="start"
            key="attributeIsActive"
            style={{justifyContent: "flex-end",  margin: "0"}}
        />)
        tmp.push(<StyledCustomTextField autoComplete={"off"} label="Name" size="small" fullWidth required variant="outlined" id="attributeName" key="attributeName" defaultValue="" />)
        tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributeType} name={"attributeType"} key="attributeType" displayName={"Type"} items={["identification","description","condition","decision"]}/>)

        if(this.state.attributeTypeSelected !== "identification") {
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedMissingValueType} name={"missingValueType"} key="missingValueType" displayName={"Missing value type"} missingVal={true} defaultValue="mv2" items={["1.5","2"]}/>)
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedAttributePreferenceType} name={"attributePreferenceType"} key="attributePreferenceType" displayName={"Preference type"} items={["none","cost","gain"]}/>)
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedValueType} name={"valueType"} displayName={"Value type"} key="valueType" items={["integer","real","enumeration"]}/>)
            if(this.state.valueTypeSelected === "enumeration")
            {
                tmpWrapper.push(<div className="addAttributeDomain" key="addAttributeDomain"> <AttributeDomain setDomainElements={this.setDomainElements}/> </div>)
            }
        } else if(this.state.attributeTypeSelected === "identification") {
            tmp.push(<DropDownForAttributes getSelected={this.getSelectedIdentifierType} name={"identifierType"} displayName={"Identifier type"} key="identifierType" items={["uuid","text"]}/>)
        }

        tmpWrapper.unshift(<div key="addAttributeFields" className="addAttributeFields"> {tmp} </div>)

        if(tmpWrapper.length !== 0) return tmpWrapper;
        return ;
    }

    /**
     * Method prepares array of html elements which will be displayed through the [render]{@link DisplayData#render} method.
     * These are fields of the Edit attribute dialog
     *
     * @function
     * @memberOf Data
     * @returns {Array}
     */
    displayEditAttributeFields = () => {
        let attribute = {};
        for(let i=0; i<this.state.history[this.state.historySnapshot].columns.length; i++) {
            if(this.state.editAttributeSelected === this.state.history[this.state.historySnapshot].columns[i].name) {
                attribute = {...this.state.history[this.state.historySnapshot].columns[i]};
                break;
            }
        }

        const tmpWrapper = [];
        const tmp = [];

        tmp.push(<FormControlLabel
            control={<StyledCheckbox defaultChecked={attribute.active} name="attributeIsActive"/>}
            label="Active"
            labelPlacement="start"
            key={"attributeIsActive"+attribute.name}
            style={{justifyContent: "flex-end",  margin: "0"}}
        />)

        //display attribute name
        tmp.push(<StyledCustomTextField autoComplete={"off"} label="Name" fullWidth required variant="outlined" id="attributeName" key={"attributeName"+attribute.name} defaultValue={attribute.name} />)

        //display attribute type - identification
        if(this.state.attributeTypeSelected === "identification" || (this.state.attributeTypeSelected === '' && attribute.valueType === undefined)) {
            tmp.push(<DropDownForAttributes key={"attributeType"+attribute.name} name={"attributeType"} getSelected={this.getSelectedAttributeType} displayName={"Type"} defaultValue={"identification"} items={["identification","description","condition","decision"]}/>)

            //display identifier type
            if(attribute.identifierType === 'uuid' || attribute.identifierType === 'text') {
                tmp.push(<DropDownForAttributes key={"identifierType"+attribute.name} name={"identifierType"} getSelected={this.getSelectedIdentifierType} displayName={"Identifier type"} defaultValue={attribute.identifierType} items={["uuid","text"]}/>)
            } else {
                tmp.push(<DropDownForAttributes key={"identifierType"+attribute.name} name={"identifierType"} getSelected={this.getSelectedIdentifierType} displayName={"Identifier type"} items={["uuid","text"]}/>)
            }

        } else if(this.state.attributeTypeSelected === attribute.type || (this.state.attributeTypeSelected === '' && attribute.type !== undefined)) { //display attribute type - other than identification and the same as before editing 
            tmp.push(<DropDownForAttributes key={"attributeType"+attribute.name} name={"attributeType"} getSelected={this.getSelectedAttributeType} displayName={"Type"} defaultValue={attribute.type} items={["identification","description","condition","decision"]}/>)
        } else { //display attribute type - other than identification and other than before editing
            tmp.push(<DropDownForAttributes key={"attributeType"+attribute.name} name={"attributeType"} getSelected={this.getSelectedAttributeType} displayName={"Type"} items={["identification","description","condition","decision"]}/>)
        }

        //it's not identification attribute
        if((attribute.valueType !== undefined && this.state.attributeTypeSelected === '') || (this.state.attributeTypeSelected !== "identification")) {

            //display missing value type
            if(attribute.missingValueType !== undefined)
                tmp.push(<DropDownForAttributes key={"missingValueType"+attribute.name} name={"missingValueType"} getSelected={this.getSelectedMissingValueType} displayName={"Missing value type"} missingVal={true} defaultValue={attribute.missingValueType} items={["1.5","2"]}/>)
            else
                tmp.push(<DropDownForAttributes key={"missingValueType"+attribute.name} name={"missingValueType"} getSelected={this.getSelectedMissingValueType} displayName={"Missing value type"} missingVal={true} defaultValue="mv2" items={["1.5","2"]}/>)

            //display preference type
            if(attribute.preferenceType !== undefined)
                tmp.push(<DropDownForAttributes key={"attributePreferenceType"+attribute.name} name={"attributePreferenceType"} getSelected={this.getSelectedAttributePreferenceType} displayName={"Preference type"} defaultValue={attribute.preferenceType} items={["none","cost","gain"]}/>)
            else
                tmp.push(<DropDownForAttributes key={"attributePreferenceType"+attribute.name} name={"attributePreferenceType"} getSelected={this.getSelectedAttributePreferenceType} displayName={"Preference type"} items={["none","cost","gain"]}/>)

            //display value type
            if(attribute.valueType !== undefined)
                tmp.push(<DropDownForAttributes key={"valueType"+attribute.name} name={"valueType"} getSelected={this.getSelectedValueType} displayName={"Value type"} defaultValue={attribute.valueType} items={["integer","real","enumeration"]}/>)
            else
                tmp.push(<DropDownForAttributes key={"valueType"+attribute.name} name={"valueType"} getSelected={this.getSelectedValueType} displayName={"Value type"} items={["integer","real","enumeration"]}/>)

            tmpWrapper.push(<div key="editAttributeFields" className="editAttributeFields"> {tmp} </div>)
            //display domain for enumeration value type
            if(attribute.valueType === "enumeration" && (this.state.valueTypeSelected === '' || this.state.valueTypeSelected === "enumeration"))
            {
                const domain = [];
                attribute.domain.forEach( (x, index) => {
                    if(x !== "?") domain.push({id: index, text: x});
                })
                tmpWrapper.push(<div className="editAttributeDomain" key={"editAttributeDomain"+attribute.name}> <AttributeDomain setDomainElements={this.setDomainElements} defaultValue={domain}/> </div>)
            } else if(this.state.valueTypeSelected === "enumeration") {
                tmpWrapper.push(<div className="editAttributeDomain" key={"editAttributeDomain"+attribute.name}> <AttributeDomain setDomainElements={this.setDomainElements}/> </div>)
            }

        }

        if(tmpWrapper.length === 0)
            tmpWrapper.push(<div key="editAttributeFields" className="editAttributeFields"> {tmp} </div>)

        return tmpWrapper;
    }

    /**
     * Method responsible for remembering selected attribute from the list in the Edit attributes dialog.
     *
     * @function
     * @memberOf Data
     * @param {Object} col - It is the column (attribute) selected from the list
     */
    handleListItemClick = (col) => {
        const selectedItem = col.name; //e.currentTarget.dataset.value;
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

    /**
     * Method runs after clicking Apply in the Edit attributes dialog
     *
     * @function
     * @memberOf Data
     */
    applyOnEditAttributes = (e) => {
        e.preventDefault();
        let history = [...this.state.history];
        let cols = [...history[this.state.historySnapshot].columns];
        let i=0;
        for(i=0; i<cols.length; i++) {
            if(cols[i].name === this.state.editAttributeSelected) break;
        }
        let col = {editable:true, sortable:true, resizable:true, filterable:true, draggable: true, visible: true}

        const validationOk = this.validateOnAddAndEditAttribute(i, e.target.attributeIsActive.checked, e.target.attributeName.value.trim(), this.state.attributeTypeSelected, this.state.missingValueTypeSelected,
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
            tmpHistory.push({rows: this.state.history[this.state.historySnapshot].rows, columns: cols, historyActionSubject: 'column'});
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
            },() => {
                this.setRowsAndHeaderColorAndStyleAndRightClick(this.state.history[this.state.historySnapshot].columns[i], i, oldColumn);
            });
        } else {
            this.setState({
                isOpenedNotification: true,
            });
        }
    }

    /**
     * Method returns columns which can be selected and then modified in the Edit attributes dialog.
     *
     * @function
     * @memberOf Data
     * @returns {Array}
     */
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

    /**
     * Method prepares array of html elements which will be displayed through the [render]{@link DisplayData#render} method.
     * These are options available through right click on the column header.
     *
     * @function
     * @memberOf Data
     * @param {Object} col - It is the column (attribute) selected from the list
     */
    displayColumnHeaderMenu = () => {
        if(this.state.isColumnHeaderMenuOpened && this.state.columnKeyOfHeaderMenuOpened !== "uniqueLP") { //don't touch No. column
            const tmp = [];
            for(let i=0; i<this.state.history[this.state.historySnapshot].columns.length; i++) {
                if(this.state.history[this.state.historySnapshot].columns[i].key === this.state.columnKeyOfHeaderMenuOpened) {
                    if(this.state.history[this.state.historySnapshot].columns[i].active)
                        tmp.push("Mark attribute as: inactive");
                    else if(this.state.history[this.state.historySnapshot].columns[i].active === false)
                        tmp.push("Mark attribute as: active");

                    break;
                }
            }

            tmp.push("Edit attribute");
            tmp.push("Delete attribute");

            return <ColumnHeaderMenu items={tmp} handleClose={this.closeOpenedColumnHeaderMenu} event={this.state.isColumnHeaderMenuOpened} />
        }
        return null;
    }

    /**
     * Method responsible for remembering if binarize nominal attributes with 3+ values is selected.
     * This option is available in the impose preference order dialog through the Transform button.
     *
     * @function
     * @memberOf Data
     * @param {Object} e - Represents an event that takes place in DOM tree.
     */
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

    /**
     * Method responsible for changing order of columns via drag and drop.
     *
     * @function
     * @memberOf Data
     * @param {Object} source - It is the key of the source column (dragged-from column)
     * @param {Object} target - It is the key of the target column (dropped-on column)
     */
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
        }, () => {
            this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,false));
            this.updateProject();
        })
    };

    /**
     * Method responsible for catching key up keyboard event,
     * more specifically to catch if the CTRL or Escape was released
     *
     * @function
     * @memberOf Data
     * @param {Object} e - Represents an event that takes place in DOM tree.
     */
    onGridKeyUp = (e) => {
        if(e.keyCode === 27) {
            this.ctrlPlusC = false;
        }
        else if(e.keyCode === this.ctrlKeyDown) {
            this.ctrlKeyDown = -1;
        }
    }

    /**
     * Method responsible for catching key down keyboard event,
     * more specifically to catch if the CTRL or CTRL + C was pressed
     *
     * @function
     * @memberOf Data
     * @param {Object} e - Represents an event that takes place in DOM tree.
     */
    onGridKeyDown = (e) => {
        if(e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) {
            this.ctrlPlusC = true;
        }
        else if(e.ctrlKey === true || e.metaKey === true) {
            this.ctrlKeyDown = e.keyCode;
        }
    }

    /**
     * Method responsible for turning off the copy paste mode (same behaviour as pressing Escape)
     *
     * @function
     * @memberOf Data
     */
    turnOffCellCopyPaste = () => {
        this.ctrlPlusC = false;
        if(this.grid) this.grid.base.viewport.canvas.interactionMasks.onPressEscape();
    }

    /**
     * Method responsible for displaying previous history step
     *
     * @function
     * @memberOf Data
     */
    onBack = () => {
        this.setState( prevState => {
            if(prevState.historySnapshot > 0) {
                return {
                    historySnapshot: prevState.historySnapshot-1,
                    dataModified: true,
                }
            }
        },() => {
            this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,false));
            this.updateProject();
            if(this.state.history[this.state.historySnapshot+1].historyActionSubject === "both" || this.state.history[this.state.historySnapshot+1].historyActionSubject === "column") this.updateChangedIdentifOrDescriptAttribute();
        })
    }

    /**
     * Method responsible for displaying next history step
     *
     * @function
     * @memberOf Data
     */
    onRedo = () => {
        this.setState( prevState => {
            if(prevState.historySnapshot < prevState.history.length-1) {
                return {
                    historySnapshot: prevState.historySnapshot+1,
                    dataModified: true,
                }
            }
        },() => {
            this.state.history[this.state.historySnapshot].columns.forEach( (col,idx) => this.setHeaderColorAndStyleAndRightClick(col,idx,false));
            this.updateProject();
            if(this.state.history[this.state.historySnapshot].historyActionSubject === "both" || this.state.history[this.state.historySnapshot].historyActionSubject === "column") this.updateChangedIdentifOrDescriptAttribute();
        })
    }

    /**
     * Method responsible for adjusting width to the resized column
     *
     * @function
     * @memberOf Data
     * @param {Integer} columnIdx - Index of the column
     * @param {Number} newWidth - New width of the column
     */
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

    render() {
        const classes = this.props.classes;
        return (
            <div style={{flexGrow: 1}} className={classes.root}>
                <DraggableContainer onHeaderDrop={this.onColumnHeaderDragDrop}>
                    <ReactDataGrid
                        ref={(node) => this.grid = node}
                        columns={this.getColumns()}
                        rowGetter={i => this.filteredRows()[i]}
                        rowsCount={this.filteredRows().length}
                        rowKey={"uniqueLP"}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        onGridSort = {this.onGridSort}
                        onGridKeyUp={this.onGridKeyUp}
                        onGridKeyDown={this.onGridKeyDown}
                        enableCellSelect={true}
                        enableRowSelect={null}
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
                        rowScrollTimeout={null}
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
                    />
                </DraggableContainer>

                <SimpleDialog open={this.state.isOpenedAddAttribute} fullWidth={true} maxWidth={"sm"} onClose={this.closeOnAddAttribute} aria-labelledby="add-attribute-dialog">
                    <DialogTitle id="add-attribute-dialog">{"Add new attribute"}</DialogTitle>
                    <form onSubmit={this.applyOnAddAttribute}>
                        <DialogContent>
                            <div className={"editAndAddAttributesWrapper"}>
                                {this.displayAddAttributeFields()}
                            </div>
                            {
                                this.state.errorMessage !== '' ? <Notification open={this.state.isOpenedNotification}
                                                                               closeOpenedNotification={this.closeOpenedNotification} message={this.state.errorMessage} variant={this.state.errorMessageSeverity} /> : null
                            }
                        </DialogContent>
                        <DialogActions>
                            <StyledButton color={"secondary"} onClick={this.closeOnAddAttribute} variant={"outlined"}> Cancel </StyledButton>
                            <StyledButton color={"primary"} disabled={false} type="submit" variant={"outlined"}> Apply </StyledButton>
                        </DialogActions>
                    </form>
                </SimpleDialog>

                <SimpleDialog open={this.state.isOpenedEditAttributes} fullWidth={true} maxWidth={"md"} onClose={this.closeOnEditAttributes} aria-labelledby="edit-attributes-dialog">
                    <DialogTitle id="edit-attributes-dialog">{"Edit attributes"}</DialogTitle>
                    <form onSubmit={this.applyOnEditAttributes}>
                        <DialogContent>
                            {
                                this.state.history[this.state.historySnapshot].columns !== undefined && this.state.history[this.state.historySnapshot].columns.length === 1 ?
                                    <span> There are no attributes to edit! </span>
                                    :
                                    <Fragment>
                                        <span> Choose attribute to edit. <br/> Please note that you can apply changes only to the selected attribute. </span>
                                        <div className="editAndAddAttributesWrapper">
                                            <div className="editAttributesVirtualizedList">
                                                <AttributesVirtualizedTable
                                                    headerText={"Attributes"}
                                                    onItemInTableSelected={this.handleListItemClick}
                                                    table={this.displayListOfAttributesForModification()}
                                                    clicked={this.state.editAttributeSelected}
                                                />
                                            </div>
                                            {this.state.editAttributeSelected !== '' ? this.displayEditAttributeFields() : null}
                                        </div>
                                    </Fragment>
                            }
                            {
                                this.state.errorMessage !== '' ? <Notification open={this.state.isOpenedNotification}
                                                                               closeOpenedNotification={this.closeOpenedNotification} message={this.state.errorMessage} variant={this.state.errorMessageSeverity} /> : null
                            }
                        </DialogContent>
                        <DialogActions>
                            <StyledButton color={"secondary"} onClick={this.closeOnEditAttributes} variant={"outlined"}> Cancel </StyledButton>
                            <StyledButton color={"primary"}  disabled={this.state.editAttributeSelected === ''} type="submit" variant={"outlined"}> Apply </StyledButton>
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
                                                  control={<StyledCheckbox name="metadata"
                                                                           onChange={this.handleChangeSaveToFileMetaData}/>}
                                                  label="JSON"
                                                  labelPlacement="end"
                                />
                            </div>

                            <StyledDivider orientation="vertical" color="secondary" />

                            <div style={{flex: "1"}}>
                                <span style={{display: "flex", justifyContent: "center"}}>Data</span>
                                <div style={{display: "flex", justifyContent: "center" }}>
                                    <RadioGroup row={true} aria-label="file" name="file" value={this.state.saveToFileData}
                                                onChange={this.handleChangeSaveToFileData}>
                                        <FormControlLabel value="json" control={<StyledRadio />} label="JSON" />
                                        <FormControlLabel value="csv" control={<StyledRadio />} label="CSV" />
                                    </RadioGroup>
                                </div>
                                {
                                    this.state.saveToFileData === "csv" && <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                        <CustomTooltip disableGpu={true} title="Save data with header row">
                                            <FormControlLabel
                                                control={<StyledCheckbox name="csvHeader"
                                                                         onChange={this.handleChangeSaveToFileCsvHeader}/>}
                                                label="Header"
                                                labelPlacement="end"
                                            />
                                        </CustomTooltip>
                                        <DropDownForAttributes getSelected={this.getSelectedSaveToFileCsvSeparator}
                                                               name={"saveToFileSeparator"} key="saveToFileSeparator" displayName={"Separator"}
                                                               items={["comma","semicolon","space","tab"]} defaultValue="comma" defaultWidth="80%"
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <StyledButton color={"secondary"} onClick={this.closeOnSaveToFile} variant={"outlined"}> Cancel </StyledButton>
                        <StyledButton color={"primary"} onClick={this.saveToFile} variant={"outlined"} autoFocus
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
                        <CustomTooltip disableGpu={true} title="Binarize nominal attributes with 3+ values?">
                            <FormControlLabel
                                control={<StyledCheckbox defaultChecked={false} name="binarize" onChange={this.handleChangeBinarize}/>}
                                label="Binarize"
                                labelPlacement="start"
                                key="Binarize"
                            />
                        </CustomTooltip>

                    </DialogContent>
                    <DialogActions>

                        <StyledButton color={"secondary"} onClick={this.closeOnTransform} variant={"outlined"}> Cancel </StyledButton>
                        <StyledButton color={"primary"} onClick={this.onTransformAttributes} variant={"outlined"} > Submit </StyledButton>

                    </DialogActions>
                </SimpleDialog>

                {
                    this.state.errorMessage !== '' ? <Notification open={this.state.isOpenedNotification}
                                                                   closeOpenedNotification={this.closeOpenedNotification} message={this.state.errorMessage} variant={this.state.errorMessageSeverity} /> : null
                }

                {(this.state.isLoading || this.props.loading) ? <CustomLoadingIcon color="primary" /> : null }

            </div>
        )
    }
}

DisplayData.propTypes = {
    informationTable: PropTypes.oneOfType([() => null, PropTypes.any.isRequired]),
    project: PropTypes.any.isRequired,
    onDataChange: PropTypes.func.isRequired,
    updateProject: PropTypes.func.isRequired
};

export default withStyles(StyledReactDataGrid)(DisplayData);
