import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { fetchDescriptiveAttributes, fetchObjectNames } from "../../utilFunctions/fetchFunctions";
import { CustomControlLabel, CustomFormLabel } from "../../Inputs/SortMenu";
import StyledRadioButton from "../../Inputs/StyledRadioButton";
import Menu from "@material-ui/core/Menu";
import RadioGroup from "@material-ui/core/RadioGroup";
import Zoom from "@material-ui/core/Zoom";
import { AutoSizer, List } from "react-virtualized";
import Check from "@material-ui/icons/Check";
import {MuiMenuPropTypes} from "../MuiMenu";


const CustomMenu = withStyles( theme => ({
    paper: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1
    }
}), {name: "AttributesMenu"})(props => <Menu {...props} />);

/**
 *
 * @class
 * @category Utils
 * @subcategory Feedback
 * @param {Object} props
 * @param {Object} props.ListProps - Props applied to the List element from react-virtualized.
 * @param {string} props.MuiMenuProps - Props applied to the Menu element from Material-UI.
 * @param {string} props.objectGlobalName - The global visible object name used by all tabs as reference.
 * @param {function} props.onObjectNamesChange - Callback fired when object names have been changed.
 * @param {function} props.onSnackbarOpen - Callback fired when the component requests to display an error.
 * @param {string} props.projectId - The identifier of a selected project.
 * @param {string} props.resource - The name of a selected resource.
 * @param {string} props.serverBase - The host in the URL of an API call.
 * @param {Object} props.queryParams - The query parameters in the URL of an API call.
 * @param {number} props.queryParams.subject - The index of a subject that contains object names.
 * @param {string} props.queryParams.set - The name of the set that narrows down object names.
 * @returns {React.Component}
 */
class AttributesMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: {
                attributes: false,
                objectVisibleName: false,
                objectNames: false
            },
            attributes: ["Default"],
            objectVisibleName: "Default",
            paddingRight: 0,
        }

        this._attributes = ["Default"];
    }

    componentDidMount() {
        this._isMounted = true;

        this.getAttributes();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const shallowComparison = this.props !== nextProps || this.state !== nextState;
        const deepComparison = this.props.projectId !== nextProps.projectId;

        return shallowComparison || deepComparison;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.projectId !== this.props.projectId) {
            this.getAttributes();
            return;
        }

        if (prevProps.objectGlobalName !== this.props.objectGlobalName) {
            this.getAttributes(this.getObjectNames);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    defaultRowRenderer = ({key, index, style}) => {
        const { attributes } = this.state;

        return (
            <CustomControlLabel
                control={
                    <StyledRadioButton
                        checkedIcon={<Check />}
                        icon={<span style={{ display: "none" }} />}
                        inputProps={{ style: { display: "none" }}}
                        style={{ padding: 0 }}
                    />
                }
                key={key}
                label={attributes[index]}
                style={style}
                value={attributes[index]}
            />
        )
    }

    processDescriptiveAttributes = (result) => {
        if (this._isMounted && result != null
            && result.hasOwnProperty("available") && result.hasOwnProperty("actual")) {

            this.setState({
                attributes: [...this._attributes, ...result.available],
                objectVisibleName: result.actual === null ? "Default" : result.actual
            });
        }
    }

    getAttributes = (finallyCallback) => {
        this.setState(({loading}) => ({
            loading: { ...loading, attributes: true }
        }), () => {
            const { projectId, resource, serverBase } = this.props;
            const pathParams = { projectId };
            const queryParams = { objectVisibleName: undefined };
            const method = "GET";

            fetchDescriptiveAttributes(
                resource, pathParams, queryParams, method, serverBase
            ).then(result => {
                this.processDescriptiveAttributes(result);
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, attributes: false }
                    }), () => {
                        if (typeof finallyCallback === "function") finallyCallback();
                    });
                }
            });
        });
    }

    saveSelection = (event) => {
        const objectVisibleName = event.target.value === "Default" ? undefined : event.target.value;

        this.setState(({loading}) => ({
            loading: { ...loading, objectVisibleName: true }
        }), () => {
            const { projectId, resource, serverBase } = this.props;
            const pathParams = { projectId };
            const queryParams = { objectVisibleName };
            const method = "POST";

            fetchDescriptiveAttributes(
                resource, pathParams, queryParams, method, serverBase
            ).then(result => {
                this.processDescriptiveAttributes(result);
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, objectVisibleName: false }
                    }), () => this.getObjectNames());
                }
            });
        });
    }

    getObjectNames = (finallyCallback) => {
        this.setState(({loading}) => ({
            loading: { ...loading, objectNames: true}
        }), () => {
            const { projectId, resource, serverBase, queryParams } = this.props;
            const pathParams = { projectId };

            fetchObjectNames(
                resource, pathParams, queryParams, serverBase
            ).then(result => {
                if (this._isMounted && Array.isArray(result)) {
                    this.props.onObjectNamesChange(result);
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception)
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({loading}) => ({
                        loading: { ...loading, objectNames: false }
                    }), () => {
                        if (typeof finallyCallback === "function") finallyCallback();
                    });
                }
            });
        });
    }

    updatePaddingRight = () => {
        const { ListProps: { id }} = this.props;
        const scrollHeight = document.getElementById(id).scrollHeight;
        const clientHeight = document.getElementById(id).clientHeight;

        this.setState({
            paddingRight: scrollHeight > clientHeight ? 0 : 8
        });
    }

    render() {
        const { attributes, objectVisibleName, paddingRight } = this.state;
        const { ListProps, MuiMenuProps } = this.props;

        const rowHeight = ListProps.hasOwnProperty("rowHeight") ? ListProps.rowHeight : 28;

        return (
            <CustomMenu
                anchorEl={MuiMenuProps.anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                getContentAnchorEl={null}
                keepMounted={true}
                onEntering={this.updatePaddingRight}
                open={Boolean(MuiMenuProps.anchorEl)}
                MenuListProps={{
                    style: {
                        paddingLeft: 16,
                        paddingRight: paddingRight,
                        width: "auto"
                    }
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                TransitionComponent={Zoom}
                {...MuiMenuProps}
            >
                <CustomFormLabel style={{outline: 0}}>
                    Choose visible object name:
                </CustomFormLabel>
                <RadioGroup
                    onChange={this.saveSelection}
                    value={objectVisibleName}
                    style={{
                        height: rowHeight * attributes.length,
                        maxHeight: rowHeight * 4,
                        width: "15rem"
                    }}
                >
                    <AutoSizer>
                        {({height, width}) => (
                            <List
                                height={height}
                                rowCount={attributes.length}
                                rowHeight={28}
                                rowRenderer={this.defaultRowRenderer}
                                style={{outline: 0}}
                                width={width}
                                {...ListProps}
                            />
                        )}
                    </AutoSizer>
                </RadioGroup>
            </CustomMenu>
        );
    }
}

AttributesMenu.propTypes = {
    ListProps: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    MuiMenuProps: PropTypes.shape({ ...MuiMenuPropTypes }),
    objectGlobalName: PropTypes.string,
    onObjectNamesChange: PropTypes.func,
    onSnackbarOpen: PropTypes.func,
    projectId: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    serverBase: PropTypes.string,
    queryParams: PropTypes.shape({
        subject: PropTypes.number,
        set: PropTypes.string
    })
}

export default AttributesMenu;
