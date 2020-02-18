import React, {Component} from 'react';
import ConesBar from "./ConesBar";
import VariantList from "./VariantList";
import Variant from "./Variant";
import "./Cones.css";
import dominanceCones from "./resources/DominanceCones";

class Cones extends Component {
    constructor(props) {
        super(props);

        this.allVariants = [];

        this.state = {
            cones: dominanceCones,
            displayedVariants: [],
            displayedDominance: "",
            displayedComparison: "",
        };
    }

    componentDidMount() {
        this.allVariants = this.getVariants();
        this.setState({
            displayedVariants: this.allVariants,
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
        const positives = this.state.cones.positiveDCones[index];
        const negatives = this.state.cones.negativeDCones[index];
        const positivesInv = this.state.cones.positiveInvDCones[index];
        const negativesInv = this.state.cones.negativeInvDCones[index];
        return new Variant("variant-" + index, positives, negatives, positivesInv, negativesInv);
    };

    getVariants = () => {
        let variants = [];
        for (let i =0; i < this.state.cones.numberOfObjects; i++) {
            variants = [...variants, this.conesPerVariant(i)];
        }
        return variants;
    };

    render() {

        return (
            <div>
                <ConesBar
                    variants={this.allVariants}
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