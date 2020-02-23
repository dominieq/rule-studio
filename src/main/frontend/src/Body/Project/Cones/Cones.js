import React, {Component, Suspense} from 'react';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import ConesBar from "./ConesBar";
import {DominanceSelector} from "./DominanceSelector";
import {ObjectListItemHeader} from "./ObjectListItemHeader";
import {ObjectListItemContent, ObjectListItemArray} from "./ObjectListItemContent";
import ObjectComparison from "./ObjectComparison";
import DominanceObject from "./api/DominanceObject";
import DominanceComparison from "./api/DominanceComparison";
import {getDominanceTypes} from "./api/DominanceTypes";
import "./Cones.css";
import dominanceCones from "./resources/demo/DominanceCones";
import exampleComparison from "./resources/demo/ExampleComparison";


const ObjectListItem = React.lazy(() => import("./ObjectListItem")) ;

class Cones extends Component {
    constructor(props) {
        super(props);

        this.objectsComparison = React.createRef();
        this.objects = this.getObjects();

        this.state = {
            objects: this.objects,
            dominance: "All",
        };
    }

    setDominance = (event) => {
        this.setState({
            dominance: event.target.value.toString(),
        });
    };

    setDisplayedComparison = (comparison) => {
        if (comparison !== null) {
            const newComparison = new DominanceComparison(
                exampleComparison[0],
                exampleComparison[1],
                comparison.relation
            );
            this.objectsComparison.current.updateComparison(newComparison);
        } else {
            this.objectsComparison.current.updateComparison(comparison);
        }

    };

    conesPerObject = (index) => {
        const positives = dominanceCones.positiveDCones[index];
        const negatives = dominanceCones.negativeDCones[index];
        const positivesInv = dominanceCones.positiveInvDCones[index];
        const negativesInv = dominanceCones.negativeInvDCones[index];
        return new DominanceObject(index, positives, negatives, positivesInv, negativesInv);
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
        const {objects, dominance} = this.state;
        const dominanceTypes = getDominanceTypes();

        return (
            <div className={"cones"}>
                <ConesBar>
                    <Typography color={"primary"} variant={"h6"} component={"div"}>
                        Choose dominance cones:
                    </Typography>
                    <DominanceSelector
                        dominance={dominance}
                        setDominance={(e) => this.setDominance(e)}
                    />
                    <span />
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
                                {objects.map((object) => (
                                    <ObjectListItem key={object.id} name={object.id}>
                                        <ObjectListItemHeader
                                            dominance={dominance}
                                            name={object.id}
                                            onDominanceChange={(event) => this.setDominance(event)}
                                        />
                                        <ObjectListItemContent dominance={dominance}>
                                            <ObjectListItemArray
                                                name={dominanceTypes[0]}
                                                items={object.positives}
                                                onItemClick={(c) => this.setDisplayedComparison(c)}
                                                onItemBlur={() => this.setDisplayedComparison(null)}
                                            />
                                            <ObjectListItemArray
                                                name={dominanceTypes[1]}
                                                items={object.negatives}
                                                onItemClick={(c) => this.setDisplayedComparison(c)}
                                                onItemBlur={() => this.setDisplayedComparison(null)}
                                            />
                                            <ObjectListItemArray
                                                name={dominanceTypes[2]}
                                                items={object.positivesInv}
                                                onItemClick={(c) => this.setDisplayedComparison(c)}
                                                onItemBlur={() => this.setDisplayedComparison(null)}
                                            />
                                            <ObjectListItemArray
                                                name={dominanceTypes[3]}
                                                items={object.negativesInv}
                                                onItemClick={(c) => this.setDisplayedComparison(c)}
                                                onItemBlur={() => this.setDisplayedComparison(null)}
                                            />
                                        </ObjectListItemContent>
                                    </ObjectListItem>
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