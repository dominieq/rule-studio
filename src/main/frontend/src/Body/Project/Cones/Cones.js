import React, {Component} from 'react';
import ConesBar from "./ConesBar";
import VariantList from "./VariantList";
import Variant from "./Variant";
import "./Cones.css";
import dominanceCones from "./resources/DominanceCones";

class Cones extends Component {
    constructor(props) {
        super(props);

        this.variants = [];

        this.state = {
            displayedVariants: [],
            displayedDominance: "",
            displayedComparison: "",
        };
    }

    componentDidMount() {
        this.variants = this.getVariants();

        this.setState({
            displayedVariants: this.variants,
        });
    }

    setDisplayedVariants = (variants) => {
        this.setState({
            displayedVariants: variants,
        });
    };

    setDisplayedDominance = (dominance) => {
        this.setState({
            displayedDominance: dominance,
        });
    };

    setDisplayedComparison = (comparison) => {
        this.setState({
            displayedComparison: comparison,
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

    render() {

        return (
            <div>
                <ConesBar
                    variants={this.variants}
                    dominance={this.state.displayedDominance}
                    setVariants={(v) => this.setDisplayedVariants(v)}
                    setDominance={(d) => this.setDisplayedDominance(d)}
                />
                <div className={"variants-display"}>
                    <div className={"variants-list"}>
                        {this.state.displayedVariants.map((variant) => (
                            <VariantList
                                key={variant.id}
                                variant={variant}
                                setComparison={(v) => this.setDisplayedComparison(v)}
                            />
                        ))}
                    </div>
                    <div className={"variants-description"}>

                    </div>
                </div>
            </div>
        );
    }
}

export default Cones;