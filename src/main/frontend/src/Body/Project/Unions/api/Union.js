class Union {
    constructor(id, name, union) {
        this.id = id;
        this.name = name;
        this.lowerApproximation = union.lowerApproximation;
        this.upperApproximation = union.upperApproximation;
        this.boundary = union.boundary;
        this.positiveRegion = union.positiveRegion;
        this.negativeRegion = union.negativeRegion;
        this.boundaryRegion = union.boundaryRegion;
        this.objects = union.objects;
        this.unionType = union.unionType;
        this.accuracyOfApproximation = union.accuracyOfApproximation;
        this.qualityOfApproximation = union.qualityOfApproximation;
    }
}

export default Union;