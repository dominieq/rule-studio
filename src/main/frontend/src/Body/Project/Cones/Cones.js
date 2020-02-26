import React, {Component, Suspense} from 'react';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import ConesBar from "./surfaces/ConesBar";
import DominanceSelector from "./inputs/DominanceSelector";
import ObjectComparison from "./data-display/ObjectComparison";
import DominanceObject from "./api/DominanceObject";
import DominanceComparison from "./api/DominanceComparison";
import "./Cones.css";
import dominanceCones from "./resources/demo-files/DominanceCones";
import exampleComparison from "./resources/demo-files/ExampleComparison";


const ObjectPanel = React.lazy(() => import("./data-display/ObjectPanel")) ;

class Cones extends Component {
    constructor(props) {
        super(props);
        this.objects = this.getObjects();

        this.state = {
            objects: this.objects,
        };

        this.objectsComparison = React.createRef();
        this.conesBar = React.createRef();
        this.objectPanels = [];
    }

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
        const objects = this.state.objects;

        return (
            <div className={"cones"}>
                <ConesBar>
                    <Typography color={"primary"} variant={"h6"} component={"div"}>
                        Choose dominance cones:
                    </Typography>
                    <DominanceSelector
                        ref={this.conesBar}
                        onDominanceChange={(d) => this.onGlobalDominanceChange(d)}
                    />
                    <span style={{flexGrow: 1}}/>
                    <TextField
                        id={"objects-filter"}
                        label={"Filter objects"}
                        type={"search"}
                        variant={"outlined"}
                        onChange={this.onFilterChange}
                    />
                </ConesBar>
                <div className={"objects-display"}>
                    <div className={"objects-list"}>
                        <Suspense fallback={<CircularProgress disableShrink/>}>
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
                    </div>
                    <div className={"objects-description"}>
                        <ObjectComparison ref={this.objectsComparison} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Cones;