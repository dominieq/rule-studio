import React, {Component, Suspense} from 'react';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import ConesBar from "./ConesBar";
import DominanceSelector from "./DominanceSelector";
import ObjectComparison from "./ObjectComparison";
import ObjectDS from "./api/ObjectDS";
import Comparison from "./api/Comparison";
import "./Cones.css";
import dominanceCones from "./resources/demo/DominanceCones";
import exampleComparison from "./resources/demo/ExampleComparison";

const VariantListItem = React.lazy(() => import("./ObjectListItem")) ;

class Cones extends Component {
    constructor(props) {
        super(props);

        this.objects = this.getObjects();
        this.exampleComparison = new Comparison(
            exampleComparison[0],
            exampleComparison[1],
            "relation"
        );

        this.state = {
            objects: this.objects,
            dominance: "All",
            comparison: "",
        };
    }

    setDominance = (event) => {
        this.setState({
            dominance: event.target.value.toString(),
        });
    };

    setDisplayedComparison = (comparison) => {
        this.setState({
            comparison: comparison,
        });
    };

    conesPerObject = (index) => {
        const positives = dominanceCones.positiveDCones[index];
        const negatives = dominanceCones.negativeDCones[index];
        const positivesInv = dominanceCones.positiveInvDCones[index];
        const negativesInv = dominanceCones.negativeInvDCones[index];
        return new ObjectDS(index, positives, negatives, positivesInv, negativesInv);
    };

    getObjects = () => {
        let variants = [];
        for (let i =0; i < dominanceCones.numberOfObjects; i++) {
            variants = [...variants, this.conesPerObject(i)];
        }
        return variants;
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
        const {objects, dominance, comparison} = this.state;

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
                        id={"variant-search"}
                        label={"Search variant"}
                        type={"search"}
                        variant={"outlined"}
                        onChange={this.onFilterChange}
                    />
                </ConesBar>
                <div className={"variants-display"}>
                    <div className={"variants-list"}>
                        <Suspense fallback={<CircularProgress disableShrink/>}>
                            <section>
                                {objects.map((object) => (
                                    <VariantListItem
                                        key={object.id}
                                        variant={object}
                                        dominance={dominance}
                                        cancelDominance={() => this.setDominance("")}
                                        setComparison={(o) => this.setDisplayedComparison(o)}
                                    />
                                ))}
                            </section>
                        </Suspense>
                    </div>
                    <div hidden={comparison === ""} className={"variants-description"}>
                        <ObjectComparison comparison={this.exampleComparison} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Cones;