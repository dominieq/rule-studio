import React, {Component} from "react";
import PropTypes from "prop-types";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterNoResults from "../Utils/Filtering/FilterNoResults";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Calculations/CalculateButton";
import MeasureSelector from "../Utils/Calculations/MeasureSelector";
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
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiCloseThick, mdiCog} from "@mdi/js";

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
            measure: "epsilon",
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

                            this.setState({
                                loading: false,
                                displayedItems: items,
                                threshold: this.props.project.threshold,
                                measure: this.props.project.measure,
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
                                threshold: this.props.project.threshold,
                                measure: this.props.project.measure,
                            });
                        }
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "error " + result.status + ": " + result.message;
                            let alertProps = {hasTitle: true, title: "Something went wrong! Please don't panic :)"};
                            let snackbarProps = {alertProps: alertProps, open: true, message: msg, variant: "info"};
                            this.setState({
                                loading: false,
                                threshold: this.props.project.threshold,
                                measure: this.props.project.measure,
                                snackbarProps: result.status !== 404 ? snackbarProps : undefined
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) {
                            this.setState({
                                loading: false,
                                threshold: this.props.project.threshold,
                                measure: this.props.project.measure,
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
                        threshold: this.props.project.threshold,
                        measure: this.props.project.measure,
                        snackbarProps: {open: true, message: msg, variant: "error"},
                    });
                }
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
            project.measure = this.state.measure;
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

    onThresholdChange = (threshold) => {
        this.setState({
            changes: Boolean(threshold),
            threshold: threshold,
        });
    };

    onMeasureChange = (event) => {
        this.setState({
            changes: event.target.value !== "epsilon",
            measure: event.target.value,
        });
    };

    onCountUnionsClick = () => {
        let project = {...this.props.project};
        const threshold = this.state.threshold;

        this.setState({
            loading: true,
        }, () => {
            let link = `http://localhost:8080/projects/${project.result.id}/unions`;
            if (project.dataUpToDate) link = link + `?consistencyThreshold=${threshold}`;

            let data = new FormData();
            data.append("threshold", threshold);
            data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
            data.append("data", JSON.stringify(project.result.informationTable.objects));

            let msg = "";
            fetch(link, {
                method: project.dataUpToDate ? "PUT" : "POST",
                body: project.dataUpToDate ? null : data
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
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
                            project.result.unionsWithSingleLimitingDecision = result;
                            project.result.calculatedUnionsWithSingleLimitingDecision = true;
                            this.props.onTabChange(project, this.props.value, true);
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "error " + result.status + ": " + result.message;
                            let alertProps = {hasTitle: true, title: "Something went wrong! Please don't panic :)"};
                            this.setState({
                                loading: false,
                                snackbarProps: {alertProps: alertProps, open: true, message: msg, variant: "info"},
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        if (this._isMounted) this.setState({loading: false});
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
            selectedItem: this.state.displayedItems[index],
            openDetails: true
        });
    };

    onDetailsClose = () => {
        this.setState({
            selectedItem: null,
            openDetails: false,
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
                    const id = i.toString();
                    const name = data[type][i].unionType.replace("_", " ").toLowerCase();
                    const traits = {
                        accuracyOfApproximation: data[type][i].accuracyOfApproximation,
                        qualityOfApproximation: data[type][i].qualityOfApproximation,
                    };
                    const tables = {
                        objects: data[type][i].objects,
                        lowerApproximation: data[type][i].lowerApproximation,
                        upperApproximation: data[type][i].upperApproximation,
                        boundary: data[type][i].boundary,
                        positiveRegion: data[type][i].positiveRegion,
                        negativeRegion: data[type][i].negativeRegion,
                        boundaryRegion: data[type][i].boundaryRegion,
                    };

                    const item = new Item(id, name, traits, null, tables);

                    items = [...items, item];
                }
            }
        }
        return items;
    };

    render() {
        const {loading, displayedItems, threshold, measure, selectedItem, openDetails,
            openSettings, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-unions"} styleVariant={"tab"}>
                <StyledPaper id={"unions-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"unions-settings-button"}
                        onClick={this.onSettingsClick}
                        title={"Click to choose consistency & measure"}
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
                    <RuleWorkSmallBox id={"unions-measure-selector"}>
                        <MeasureSelector
                            onChange={this.onMeasureChange}
                            value={measure}
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

Unions.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    value: PropTypes.number,
};

export default Unions;