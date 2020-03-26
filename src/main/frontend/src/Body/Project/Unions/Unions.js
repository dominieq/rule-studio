import React, {Component} from "react";
import PropTypes from "prop-types";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterNoResults from "../Utils/Filtering/FilterNoResults";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Calculations/CalculateButton";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import SettingsButton from "../Utils/Settings/SettingsButton";
import SettingsFooter from "../Utils/Settings/SettingsFooter";
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
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

class Unions extends Component {
    constructor(props) {
        super(props);

        this._data = [];
        this._items = [];

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            displayedItems: [],
            threshold: 0,
            typeOfUnions: "monotonic",
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
            fetch(`http://localhost:8080/projects/${project.result.id}/unions`, {
                method: "GET",
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this._data = result;
                            this._items = items;
                            this.setState({
                                displayedItems: items
                                displayedItems: items,
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            let alertProps = {title: "Something went wrong! Couldn't load unions :("};
                            let snackbarProps = {alertProps: alertProps, open: true, message: msg, variant: "warning"};
                            this.setState({
                                loading: false,
                                snackbarProps: result.status !== 404 ? snackbarProps : undefined
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't load unions :(";
                            let alertProps = {title: "ERROR " + response.status};
                            let snackbarProps = {alertProps: alertProps, open: true, message: msg, variant: "error"};
                            this.setState({
                                loading: false,
                                snackbarProps: response.status !== 404 ? snackbarProps : undefined
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load unions :(";
                    this.setState({
                        loading: false,
                        snackbarProps: {open: true, message: msg, variant: "error"},
                    });
                }
            }).finally(() => {
                this.setState({
                    loading: false,
                    threshold: this.props.project.threshold,
                    typeOfUnions: this.props.project.typeOfUnions
                });
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this.state.changes) {
            let project = {...this.props.project};
            if (Object.keys(this._data).length) {
                project.result.unionsWithSingleLimitingDecision = this._data;
                project.result.calculatedUnionsWithSingleLimitingDecision = true;
            }
            project.threshold = this.state.threshold;
            project.typeOfUnions = this.state.typeOfUnions;

            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = this.state.updated;

            this.props.onTabChange(project, this.state.updated, tabsUpToDate);
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

    onThresholdChange = (threshold) => {
        this.setState({
            changes: Boolean(threshold),
            updated: this.props.project.dataUpToDate,
            threshold: threshold,
        });
    };

    onUnionTypeChange = (event) => {
        this.setState({
            changes: event.target.value !== "epsilon",
            updated: this.props.project.dataUpToDate,
            typeOfUnions: event.target.value,
        });
    };

    onCountUnionsClick = () => {
        let project = {...this.props.project};
        const threshold = this.state.threshold;
        const typeOfUnions = this.state.typeOfUnions;

        this.setState({
            loading: true,
        }, () => {
            let link = `http://localhost:8080/projects/${project.result.id}/unions`;
            if (project.dataUpToDate) link = link + `?typeOfUnions=${typeOfUnions}&consistencyThreshold=${threshold}`;

            let data = new FormData();
            data.append("typeOfUnions", typeOfUnions);
            data.append("consistencyThreshold", threshold);
            data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
            data.append("data", JSON.stringify(project.result.informationTable.objects));

            let msg = "";
            fetch(link, {
                method: project.dataUpToDate ? "PUT" : "POST",
                body: project.dataUpToDate ? null : data
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        const updated = true;

                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this._data = result;
                            this._items = items;
                            this.setState({
                                changes: true,
                                updated: updated,
                                loading: false,
                                displayedItems: items,
                            });
                        } else {
                            project.result.unionsWithSingleLimitingDecision = result;
                            project.result.calculatedUnionsWithSingleLimitingDecision = updated;

                            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
                            tabsUpToDate[this.props.value] = updated;

                            this.props.onTabChange(project, updated, tabsUpToDate);
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            let alertProps = {title: "Something went wrong! Couldn't calculate unions :("};
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "warning"}
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate unions :(";
                            let alertProps = {title: "ERROR " + response.status};
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "error"}
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate unions :(";
                    this.setState({
                        loading: false,
                        snackbarProps: {open: true, message: msg, variant: "error"},
                    });
                }
            });
        });
    };

    onFilterChange = (event) => {
        const filteredItems = filterFunction(event.target.value.toString(), this._items.slice(0));
        this.setState({displayedItems: filteredItems});
    };

    onDetailsOpen = (index) => {
        this.setState({
            openDetails: true,
            selectedItem: {...this._items[index]},
        });
    };

    onDetailsClose = () => {
        this.setState({
            openDetails: false,
            selectedItem: null,
        });
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState({snackbarProps: undefined})
        }
    };

    getItems = (data) => {
        let items = [];
        if (data) {
            for (let type of ["downwardUnions", "upwardUnions"]) {
                for (let i = 0; i < data[type].length; i++) {
                    const id = i;
                    const name = data[type][i].unionType.replace("_", " ").toLowerCase()
                        + " " + data[type][i].limitingDecision;
                    const traits = {
                        accuracyOfApproximation: data[type][i].accuracyOfApproximation,
                        qualityOfApproximation: data[type][i].qualityOfApproximation,
                    };
                    const tables = {
                        objects: data[type][i].objects.slice(),
                        lowerApproximation: data[type][i].lowerApproximation.slice(),
                        upperApproximation: data[type][i].upperApproximation.slice(),
                        boundary: data[type][i].boundary.slice(),
                        positiveRegion: data[type][i].positiveRegion.slice(),
                        negativeRegion: data[type][i].negativeRegion.slice(),
                        boundaryRegion: data[type][i].boundaryRegion.slice(),
                    };

                    const item = new Item(id, name, traits, null, tables);
                    items.push(item);
                }
            }
        }
        return items;
    };

    getListItems = (items) => {
        let listItems = [];
        if (this._data) {
            for (let i = 0; i < items.length; i++) {
                const listItem = {
                    id: items[i].id,
                    header: items[i].name,
                    subheader: undefined,
                    content: undefined,
                    multiContent: [
                        {
                            title: "Accuracy of approximation:",
                            subtitle: items[i].traits.accuracyOfApproximation,
                        },
                        {
                            title: "Quality of approximation: ",
                            subtitle: items[i].traits.qualityOfApproximation,
                        }
                    ],
                };
                listItems.push(listItem);
            }
        }
        return listItems;
    };

    render() {
        const {loading, displayedItems, threshold, typeOfUnions, selectedItem, openDetails,
            openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-unions"} styleVariant={"tab"}>
                <StyledPaper id={"unions-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"unions-settings-button"}
                        onClick={this.onSettingsClick}
                        title={"Click to choose consistency & type of unions"}
                    />
                    <StyledDivider />
                    <RuleWorkTooltip title={`Calculate with threshold ${threshold}`}>
                        <CalculateButton
                            aria-label={"unions-calculate-button"}
                            disabled={!this.props.project || loading}
                            onClick={this.onCountUnionsClick}
                        />
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange}/>
                </StyledPaper>
                <RuleWorkDrawer
                    height={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                    id={"unions-settings-drawer"}
                    open={openSettings}
                >
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"unions-union-type-selector"}>
                        <TypeOfUnionsSelector
                            onChange={this.onUnionTypeChange}
                            value={typeOfUnions}
                        />
                    </RuleWorkSmallBox>
                    <StyledDivider orientation={"horizontal"} styleVariant={"panel"} />
                    <RuleWorkSmallBox id={"unions-threshold-selector"}>
                        <ThresholdSelector
                            onChange={this.onThresholdChange}
                            value={threshold}
                        />
                    </RuleWorkSmallBox>
                    <SettingsFooter
                        id={"unions-settings-footer"}
                        onClose={this.onSettingsClose}
                    />
                </RuleWorkDrawer>
                <RuleWorkBox id={"unions-list"} styleVariant={"tab-body"}>
                {loading ?
                    <StyledCircularProgress/>
                    :
                    displayedItems ?
                        <RuleWorkList onItemSelected={this.onDetailsOpen}>
                            {this.getListItems(displayedItems)}
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

Unions.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    value: PropTypes.number,
};

export default Unions;