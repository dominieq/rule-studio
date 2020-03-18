import React, {Component} from "react";
import PropTypes from "prop-types";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterNoResults from "../Utils/Filtering/FilterNoResults";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import RuleWorkSmallBox from "../../../RuleWorkComponents/Containers/RuleWorkSmallBox";
import RuleWorkList from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import RuleWorkDialog from "../../../RuleWorkComponents/Feedback/RuleWorkDialog/RuleWorkDialog"
import RuleWorkSnackbar from "../../../RuleWorkComponents/Feedback/RuleWorkSnackbar";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import RuleWorkButtonGroup from "../../../RuleWorkComponents/Inputs/RuleWorkButtonGroup";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import RuleWorkUpload from "../../../RuleWorkComponents/Inputs/RuleWorkUpload";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCloseThick, mdiCog} from "@mdi/js"

class Classification extends Component {
    constructor(props) {
        super(props);

        this._data = {};
        this._items = [];

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            displayedItems: [],
            ruleType: "certain",
            selectedItem: null,
            openDetails: false,
            openSettings: false,
            snackbarProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        const project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            let msg = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/classification`, {
                method: "GET"
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        console.log(result);
                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this.setState({
                                loading: false,
                                displayedItems: items,
                                ruleType: this.props.project.ruleType,
                            }, () => {
                                this._data = result;
                                this._items = items;
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) {
                            this.setState({
                                loading: false,
                                ruleType: this.props.project.ruleType,
                            })
                        }
                    });
                } else {
                    response.json().then(result => {
                        msg = "error " + result.status + ": " + result.message;
                        let alertProps = {hasTitle: true, title: "Something went wrong! Please don't panick :)"};
                        let snackbarProps = {alertProps: alertProps, open: true, message: msg, variant: "info"};
                        if (this._isMounted) {
                            this.setState({
                                loading: false,
                                ruleType: this.props.project.ruleType,
                                snackbarProps: result.status !== 404 ? snackbarProps : undefined
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) {
                            this.setState({
                                loading: true,
                                ruleType: this.props.project.ruleType,
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load classification :(";
                    this.setState({
                        loading: false,
                        ruleType: this.props.project.ruleType,
                        snackbarProps: {open: true, message: msg, variant: "error"}
                    });
                }
            });
        });
    }

    componentWillUnmount() {
        if (this.state.changes) {
            let project = {...this.props.project};
            if (Object.keys(this._data).length) {
                project.result.classification = this._data;
            }
            project.ruleType = this.state.ruleType;
            this.props.onTabChange(project, this.props.value, this.state.updated);
        }
    }

    onSettingsClick = () => {
        this.setState(prevState => ({
            openSettings: !prevState.openSettings,
        }));
    };

    onSettingsClose = () => {
        this.setState({
            openSettings: false,
        });
    };

    onCalculateClick = (event) => {
        event.persist();
        const project = {...this.props.project};

        let data = new FormData();
        if (event.target.files) data.append("data", event.target.files[0]);

        this.setState({
            loading: true,
        }, () => {
            let msg = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/classification`, {
                method: "PUT",
                body: event.target.files ? data : null,
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        console.log(result);
                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this.setState({
                                changes: true,
                                updated: true,
                                loading: false,
                                displayedItems: items,
                            }, () => {
                                this._data = result;
                                this._items = items;
                            });
                        } else {
                            project.result.classification = result;
                            this.props.onTabChange(project, this.props.value, true);
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            let alert = {hasTitle: true, title: "Something went wrong! Please don't panick :)"};
                            msg = "error " + result.status + ": " + result.message;
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alert, open: true, message: msg, variant: "info"}
                            })
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    })
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate classification :(";
                    this.setState({
                        loading: false,
                        snackbarProps: {open: true, message: msg, variant: "error"}
                    });
                }
            })
        });
    };

    onRuleTypeChange = (event) => {
        this.setState({
            changes: event.target.value !== "certain",
            ruleType: event.target.value,
        });
    };

    onFilterChange = (event) => {
        const filteredItems = filterFunction(event.target.value.toString(), this._items.slice(0));
        this.setState({displayedItems: filteredItems});
    };

    onDetailsOpen = (index) => {
        this.setState({
            selectedItem: this.state.displayedItems[index],
            openDetails: true,
        });
    };

    onDetailsClose = () => {
        this.setState({
            selectedItem: null,
            openDetails: false,
        })
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState({snackbarProps: undefined});
        }
    };

    getItems = (data) => {
        let items = [];
        if (Object.keys(data).length) {
            for (let i = 0; i < data.simpleClassificationResults.length; i++) {
                const id = i.toString();
                const name = "Object " + (i + 1);
                const traits = {
                    attributes: data.informationTable.attributes,
                    value: data.informationTable.objects[i]
                };
                const tables = {
                    indicesOfCoveringRules: data.indiciesOfCoveringRules[i]
                };
                const item = new Item(id, name, traits, null, tables);
                items = [...items, item];
            }
        }
        return items;
    };

    render() {
        const {loading, displayedItems, ruleType, selectedItem, openDetails,
            openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-classification"} styleVariant={"tab"}>
                <StyledPaper
                    id={"classification-bar"}
                    paperRef={this.upperBar}
                    styleVariant={"bar"}
                    square={true}
                    variant={"outlined"}
                >
                    <RuleWorkTooltip title={"Click to choose rule type"}>
                        <StyledButton
                            isIcon={true}
                            onClick={this.onSettingsClick}
                        >
                            <SvgIcon><path d={mdiCog}/></SvgIcon>
                        </StyledButton>
                    </RuleWorkTooltip>
                    <StyledDivider />
                    <RuleWorkButtonGroup
                        id={"classification-button-group"}
                        options={["Classify current data", "Choose new data & classify"]}
                    >
                        <StyledButton
                            aria-label={"classify-current-file"}
                            disableElevation={true}
                            onClick={this.onCalculateClick}
                            themeVariant={"primary"}
                            variant={"contained"}
                        >
                            Classify current data
                        </StyledButton>
                        <RuleWorkUpload
                            accept={".json,.csv"}
                            id={"classify-new-file"}
                            onChange={this.onCalculateClick}
                        >
                            <StyledButton
                                aria-label={"classify-new-file"}
                                disableElevation={true}
                                component={"span"}
                                themeVariant={"primary"}
                                variant={"contained"}
                            >
                                Choose new data & classify
                            </StyledButton>
                        </RuleWorkUpload>
                    </RuleWorkButtonGroup>
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange} />
                </StyledPaper>
                <RuleWorkDrawer
                    height={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                    id={"classification-settings-drawer"}
                    open={openSettings}
                >
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"rule-type-selector"}>
                        <RuleWorkTextField
                            disabledChildren={["possible"]}
                            hasOutsideLabel={true}
                            onChange={this.onRuleTypeChange}
                            outsideLabel={"Choose rule type"}
                            select={true}
                            value={ruleType}
                        >
                            {["certain", "possible"]}
                        </RuleWorkTextField>
                    </RuleWorkSmallBox>
                    <RuleWorkSmallBox id={"classification-settings-footer"} styleVariant={"footer"}>
                        <StyledButton
                            isIcon={true}
                            onClick={this.onSettingsClose}
                            themeVariant={"secondary"}
                        >
                            <SvgIcon><path d={mdiCloseThick} /></SvgIcon>
                        </StyledButton>
                    </RuleWorkSmallBox>
                </RuleWorkDrawer>
                <RuleWorkBox id={"classification-body"} styleVariant={"tab-body"} >
                    {loading ?
                        <StyledCircularProgress />
                        :
                        displayedItems ?
                            <RuleWorkList onItemSelected={this.onDetailsOpen}>
                                {displayedItems}
                            </RuleWorkList>
                            :
                            <FilterNoResults />
                    }
                </RuleWorkBox>
                {selectedItem &&
                    <RuleWorkDialog
                        item={selectedItem}
                        onClose={this.onDetailsClose}
                        open={openDetails}
                        projectResult={this.props.project.result}
                    />
                }
                <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        )
    }
}

Classification.propTypes = {
    dataUpToDate: PropTypes.bool,
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    upToDate: PropTypes.bool,
    value: PropTypes.number,
};

export default Classification;