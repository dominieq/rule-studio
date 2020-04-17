function addSubheaders(subheaders, matrix) {
    let matrixWithSubheaders = [];

    if (subheaders && Array.isArray(matrix)) {
        let numbers = Array.from(Array(subheaders.length + 1).keys());

        matrixWithSubheaders = [
            ...matrixWithSubheaders,
            numbers,
            ...matrix.map(array => { return [...array]; })
        ];

        for (let i = 1; i < matrixWithSubheaders.length; i++) {
            matrixWithSubheaders[i].unshift(numbers[i]);
        }
    }

    return matrixWithSubheaders;
}

export default addSubheaders;