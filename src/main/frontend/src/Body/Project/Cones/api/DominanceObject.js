class DominanceObject {
    constructor(id, name, positives, negatives, positivesInv, negativesInv) {
        this.id = id;
        this.name = name === "" ? "Object " + (id + 1) : name;
        this.positives = positives;
        this.negatives = negatives;
        this.positivesInv = positivesInv;
        this.negativesInv = negativesInv;
    }
}

export default DominanceObject;