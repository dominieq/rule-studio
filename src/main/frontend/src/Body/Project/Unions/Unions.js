import React, {Component} from "react";
import PropTypes from "prop-types";
import { parseUnionsItems, parseUnionsListItems } from "../Utils/parseData";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import { UnionsDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog";
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

class Unions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            data: null,
            items: null,
            displayedItems: [],
            parameters: {
                consistencyThreshold: 0,
                typeOfUnions: "monotonic"
            },
            selectedItem: null,
            open: {
                details: false,
                settings: false
            },
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        const project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            let msg, title = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/unions`, {
                method: "GET",
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = parseUnionsItems(result);

                            this.setState({
                                data: result,
                                items: items,
                                displayedItems: items,
                                parameters: {
                                    consistencyThreshold: result.consistencyThreshold,
                                    typeOfUnions: result.typeOfUnions.toLowerCase()
                                }
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            title = "Something went wrong! Couldn't load unions :(";
                            let alertProps = {message: msg, open: true, title: title, severity: "warning"};
                            this.setState({
                                alertProps: result.status !== 404 ? alertProps : undefined
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't load unions :(";
                            title = "ERROR " + response.status;
                            let alertProps = {message: msg, open: true, title: title, severity: "error"};
                            this.setState({
                                alertProps: response.status !== 404 ? alertProps : undefined
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load unions :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"},
                    });
                }
            }).finally(() => {
                if (this._isMounted) this.setState({loading: false});
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;

        const {
            changes,
            updated,
            data,
            parameters: { consistencyThreshold, typeOfUnions }
        } = this.state;

        if (changes) {
            let project = {...this.props.project};

            project.result.unionsWithSingleLimitingDecision = data;
            project.threshold = consistencyThreshold;
            project.typeOfUnions = typeOfUnions;

            let tabsUpToDate = project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = updated;

            this.props.onTabChange(project, updated, tabsUpToDate);
        }
    }

    onCountUnionsClick = () => {
        let project = {...this.props.project};
        const { parameters: { consistencyThreshold, typeOfUnions } } = this.state;

        this.setState({
            loading: true,
        }, () => {
            let link = `http://localhost:8080/projects/${project.result.id}/unions`;
            if (project.dataUpToDate) link = link + `?typeOfUnions=${typeOfUnions}&consistencyThreshold=${consistencyThreshold}`;

            let data = new FormData();
            data.append("typeOfUnions", typeOfUnions);
            data.append("consistencyThreshold", consistencyThreshold);
            data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
            data.append("data", JSON.stringify(project.result.informationTable.objects));

            let msg, title = "";
            fetch(link, {
                method: project.dataUpToDate ? "PUT" : "POST",
                body: project.dataUpToDate ? null : data
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        const updated = true;

                        if (this._isMounted) {
                            const items = parseUnionsItems(result);

                            this.setState({
                                changes: true,
                                updated: updated,
                                data: result,
                                items: items,
                                displayedItems: items,
                                parameters: {
                                    consistencyThreshold: result.consistencyThreshold,
                                    typeOfUnions: result.typeOfUnions.toLowerCase()
                                }
                            });
                        } else {
                            project.result.unionsWithSingleLimitingDecision = result;

                            let tabsUpToDate = project.tabsUpToDate.slice();
                            tabsUpToDate[this.props.value] = updated;

                            this.props.onTabChange(project, updated, tabsUpToDate);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            title = "Something went wrong! Couldn't calculate unions :(";
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "warning"}
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate unions :(";
                            title = "ERROR " + response.status;
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "error"}
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate unions :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"}
                    });
                }
            }).finally(() => {
                if (this._isMounted) this.setState({loading: false});
            });
        });
    };

    toggleOpen = (name) => {
        this.setState(({open}) => ({
            open: {...open, [name]: !open[name]}
        }));
    };

    onDetailsOpen = (index) => {
        const { items } = this.state;

        this.setState(({open}) => ({
            open: {...open, details: true, settings: false},
            selectedItem: items[index],
        }));
    };

    onConsistencyThresholdChange = (threshold) => {
        this.setState(({parameters}) => ({
            changes: Boolean(threshold),
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, consistencyThreshold: threshold},
        }));
    };

    onTypeOfUnionsChange = (event) => {
        this.setState(({parameters}) => ({
            changes: event.target.value !== "epsilon",
            updated: this.props.project.dataUpToDate,
            parameters: {...parameters, typeOfUnions: event.target.value},
        }));
    };

    onFilterChange = (event) => {
        const { items } = this.state;
        const filteredItems = filterFunction(event.target.value.toString(), items.slice());

        this.setState({
            items: items,
            displayedItems: filteredItems
        });
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    render() {
        const {
            loading,
            data,
            displayedItems,
            parameters: { consistencyThreshold, typeOfUnions },
            selectedItem,
            open,
            alertProps
        } = this.state;

        return (
            <RuleWorkBox id={"rule-work-unions"} styleVariant={"tab"}>
                <StyledPaper id={"unions-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"unions-settings-button"}
                        onClick={() => this.toggleOpen("settings")}
                        title={"Click to choose consistency & type of unions"}
                    />
                    <StyledDivider />
                    <RuleWorkTooltip
                        title={`Calculate with threshold ${consistencyThreshold} & ${typeOfUnions} unions`}
                    >
                        <CalculateButton
                            aria-label={"unions-calculate-button"}
                            disabled={loading}
                            onClick={this.onCountUnionsClick}
                        />
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange}/>
                </StyledPaper>
                <RuleWorkDrawer
                    id={"unions-settings"}
                    onClose={() => this.toggleOpen("settings")}
                    open={open.settings}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfUnionsSelector
                        id={"unions-union-type-selector"}
                        onChange={this.onTypeOfUnionsChange}
                        value={typeOfUnions}
                    />
                    <ThresholdSelector
                        id={"unions-threshold-selector"}
                        onChange={this.onConsistencyThresholdChange}
                        value={consistencyThreshold}
                    />
                </RuleWorkDrawer>
                <TabBody
                    content={parseUnionsListItems(displayedItems)}
                    id={"unions-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onDetailsOpen
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Number of unions:",
                            value: displayedItems ? displayedItems.length : undefined
                        },
                        {
                            label: "Quality of classification:",
                            value: data ? data.qualityOfApproximation : undefined
                        }
                    ]}
                />
                {selectedItem &&
                    <UnionsDialog
                        item={selectedItem}
                        onClose={() => this.toggleOpen("details")}
                        open={open.details}
                        projectResult={this.props.project.result}
                    />
                }
                <RuleWorkAlert {...alertProps} onClose={this.onSnackbarClose} />
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