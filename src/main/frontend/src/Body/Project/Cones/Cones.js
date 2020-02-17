import React, {Component} from 'react';
import UpperPanel from "./UpperPanel";
import Variant from "./Variant";
import dominanceCones from "./resources/DominanceCones";

class Cones extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cones: dominanceCones,
            selectedIndex: 0,
        };

        this.setSelectedIndex = this.setSelectedIndex.bind(this);
    }

    setSelectedIndex(index) {
        this.setState({
            selectedIndex: index,
        });
    }

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
        const variants = this.getVariants();
        return (
            <div>
                <UpperPanel
                    variants={variants}
                    setSelectedIndex={(i) => this.setSelectedIndex(i)}
                />
            </div>
        );
    }
}

export default Cones;