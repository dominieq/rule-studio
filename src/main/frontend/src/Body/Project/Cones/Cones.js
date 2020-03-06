import React, {Component, Suspense} from 'react';
import PropTypes from "prop-types";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkTextField from "../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";
import DominanceSelector from "./inputs/DominanceSelector";
import ObjectComparison from "./data-display/ObjectComparison";
import DominanceObject from "./api/DominanceObject";
import DominanceComparison from "./api/DominanceComparison";
import Divider from "@material-ui/core/Divider";
import "./Cones.css";
import dominanceCones from "./resources/demo-files/DominanceCones";
import exampleComparison from "./resources/demo-files/ExampleComparison";



const ObjectPanel = React.lazy(() => import("./data-display/ObjectPanel")) ;

class Cones extends Component {
    constructor(props) {
        super(props);
        this.objects = this.getObjects();

        this.state = {
            loading: false,
            data: "",
            objects: this.objects,
            snackbarProps: {
                open: false,
                message: "",
                variant: "info",
            },
        };

        this.objectsComparison = React.createRef();
        this.conesBar = React.createRef();
        this.objectPanels = [];
    }

    componentDidMount() {
        const project = this.props.project;
        if (project.calculatedDominanceCones) {
            fetch(`http://localhost:8080/projects/${project.result.id}/cones`, {
                method: "GET"
            }).then(response => {
                return response.json();
            }).then(result => {
                this.setState({
                    data: result,
                });
            }).catch(error => {
                this.setState({
                    snackbarProps: {
                        open: true,
                        message: "Server error. Couldn't load cones!",
                        variant: "error",
                    },
                }, () => {
                    console.log(error);
                });
            });
        }
    }

    onCalculateClick = () => {
        const project = this.props.project;

        this.setState({
            loading: true,
        }, () => {
            fetch(`http://localhost:8080/projects/${project.result.id}/cones`, {
                method: "GET",
            }).then(response => {
                return response.json();
            }).then(result => {
                this.setState({
                    loading: false,
                    data: result,
                });
            }).catch(error => {
                this.setState({
                    loading: false,
                    snackbarProps: {
                        open: true,
                        message: "Server error. Couldn't calculate cones!",
                        variant: "error",
                    },
                }, () => {
                    console.log(error);
                });
            });
        });
    };

    onGlobalDominanceChange = (dominanceSelected) => {
        const {dominance, where} = dominanceSelected;

        switch (where) {
            case "bar": {

                for (let i = 0; i < this.objectPanels.length; i++) {
                    this.objectPanels[i].onDominanceUpdate(dominance)
                }
                return;
            }
            case "panel": {
                this.conesBar.current.onDominanceUpdate("All");
                return;
            }
            default: {
                return;
            }
        }
    };

    onComparisonChange = (comparison) => {
        if (comparison) {
            let objectMain = exampleComparison[0];
            objectMain.id = comparison.objectMain;
            let objectOptional = exampleComparison[1];
            objectOptional.id = comparison.objectOptional;

            const newComparison = new DominanceComparison(objectMain, objectOptional, comparison.relation);
            this.objectsComparison.current.updateComparison(false, newComparison);
        } else {
            this.objectsComparison.current.updateComparison(true,  null);
        }

    };

    conesPerObject = (index) => {
        const positives = dominanceCones.positiveDCones[index];
        const negatives = dominanceCones.negativeDCones[index];
        const positivesInv = dominanceCones.positiveInvDCones[index];
        const negativesInv = dominanceCones.negativeInvDCones[index];
        return new DominanceObject(index,"", positives, negatives, positivesInv, negativesInv);
    };

    getObjects = () => {
        let objects = [];
        for (let i =0; i < dominanceCones.numberOfObjects; i++) {
            objects = [...objects, this.conesPerObject(i)];
        }
        return objects;
    };

    onFilterChange = (event) => {
        const filterText = event.target.value.toString();

        if (filterText === "") {
            this.setState({
                objects: this.objects,
            });
            return;
        }

        let objects = [];

        for (let i = 0; i < this.objects.length; i++) {
            const object = this.objects[i];

            if (object.id.toString().includes(filterText)) {
                objects = [...objects, object];
            }
        }

        if (objects.length > 0) {
            this.setState({
                objects: objects,
            });
        }
    };

    render() {
        const {loading, data, objects, snackbarProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-cones"} styleVariant={"tab"}>
                <StyledPaper id={"cones-bar"} styleVariant={"bar"} square={true} variant={"outlined"}>
                    <DominanceSelector
                        ref={this.conesBar}
                        onDominanceChange={this.onGlobalDominanceChange}
                    />
                    <Divider flexItem={true} orientation={"vertical"} />
                    <RuleWorkTextField
                        type={"search"}
                        onChange={this.onFilterChange}
                    >
                        Filter objects
                    </RuleWorkTextField>
                    <span style={{flexGrow: 1}}/>
                    <StyledButton
                        buttonVariant={"contained"}
                        onClick={this.onCalculateClick}
                        styleVariant={"green"}
                    >
                        Calculate
                    </StyledButton>
                </StyledPaper>
                <RuleWorkBox id={"cones-list"} styleVariant={"tab-body2"}>
                    <RuleWorkBox id={"objects-list"} styleVariant={"tab-column"}>
                        <Suspense fallback={<StyledCircularProgress disableShrink/>}>
                            <section>
                                {objects.map((object, index) => (
                                    <ObjectPanel
                                        key={index}
                                        ref={(ref) => {this.objectPanels[index] = ref}}
                                        object={object}
                                        onDominanceChange={(d) => this.onGlobalDominanceChange(d)}
                                        onItemClick={(c) => this.onComparisonChange(c)}
                                        onItemBlur={() => this.onComparisonChange(null)}
                                    />
                                ))}
                            </section>
                        </Suspense>
                    </RuleWorkBox>
                    <RuleWorkBox id={"objects-description"} styleVariant={"tab-column"}>
                        <ObjectComparison ref={this.objectsComparison} />
                    </RuleWorkBox>
                </RuleWorkBox>
            </RuleWorkBox>
        );
    }
}

Cones.propTypes = {
    changed: PropTypes.array,
    project: PropTypes.object.isRequired,
    updateProject: PropTypes.func,
    value: PropTypes.number,
};

export default Cones;