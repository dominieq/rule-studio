import React, {Component, Suspense} from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import ConesBar from "./ConesBar";
import VariantComparison from "./VariantComparison";
import Variant from "./api/Variant";
import Comparison from "./api/Comparison";
import "./Cones.css";
import dominanceCones from "./resources/demo/DominanceCones";
import exampleComparison from "./resources/demo/ExampleComparison";

const VariantListItem = React.lazy(() => import("./VariantListItem")) ;

class Cones extends Component {
    constructor(props) {
        super(props);

        this.variants = this.getVariants();
        this.exampleComparison = new Comparison(
            exampleComparison[0],
            exampleComparison[1],
            "relation"
        );

        this.conesBar = React.createRef();

        this.state = {
            variants: this.variants,
            dominance: "",
            comparison: "",
        };
    }

    setDisplayedDominance = (dominance) => {
        this.setState({
            dominance: dominance,
        });
    };

    setDisplayedComparison = (comparison) => {
        this.setState({
            comparison: comparison,
        });
    };

    conesPerVariant = (index) => {
        const positives = dominanceCones.positiveDCones[index];
        const negatives = dominanceCones.negativeDCones[index];
        const positivesInv = dominanceCones.positiveInvDCones[index];
        const negativesInv = dominanceCones.negativeInvDCones[index];
        return new Variant(index, positives, negatives, positivesInv, negativesInv);
    };

    getVariants = () => {
        let variants = [];
        for (let i =0; i < dominanceCones.numberOfObjects; i++) {
            variants = [...variants, this.conesPerVariant(i)];
        }
        return variants;
    };

    filterVariants = (filterText) => {
        if (filterText === "") {
            this.setState({
                variants: this.variants,
            });
            return;
        }

        let variants = [];

        for (let i = 0; i < this.variants.length; i++) {
            const variant = this.variants[i];

            if (variant.id.toString().includes(filterText)) {
                variants = [...variants, variant];
            }
        }

        this.setState({
            variants: variants,
        });
    };

    render() {
        const {variants, dominance, comparison} = this.state;

        return (
            <div>
                <ConesBar
                    ref={this.conesBar}
                    dominance={dominance}
                    filterText={(f) => this.filterVariants(f)}
                    setDominance={(d) => this.setDisplayedDominance(d)}
                />
                <div className={"variants-display"}>
                    <div className={"variants-list"}>
                        <Suspense fallback={<CircularProgress disableShrink/>}>
                            <section>
                                {variants.map((variant) => (
                                    <VariantListItem
                                        key={variant.id}
                                        variant={variant}
                                        dominance={dominance}
                                        cancelDominance={() => this.setDisplayedDominance("")}
                                        setComparison={(v) => this.setDisplayedComparison(v)}
                                    />
                                ))}
                            </section>
                        </Suspense>
                    </div>
                    <div hidden={comparison === ""} className={"variants-description"}>
                        <VariantComparison comparison={this.exampleComparison} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Cones;