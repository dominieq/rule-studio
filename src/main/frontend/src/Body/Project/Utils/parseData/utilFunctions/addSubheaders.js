function addSubheaders(subheaders, matrix) {
    let matrixWithSubheaders = [];

    if (subheaders && Array.isArray(matrix)) {
        let names = subheaders.map(domain => domain.evaluation.element);
        names.unshift(0);

        matrixWithSubheaders = [
            ...matrixWithSubheaders,
            names,
            ...matrix.map(array => { return [...array]; })
        ];

        for (let i = 1; i < matrixWithSubheaders.length; i++) {
            matrixWithSubheaders[i].unshift(names[i]);
        }
    }

    return matrixWithSubheaders;
}

export default addSubheaders;