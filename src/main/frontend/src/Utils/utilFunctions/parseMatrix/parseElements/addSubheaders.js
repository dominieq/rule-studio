/**
 * Adds subheaders to the first row and column of a provided matrix.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string[]|number[]} subheaders - Additional information added to first row and column of a matrix.
 * @param {number[][]} matrix - Data set that is going to have subheaders added to it.
 * @returns {Array[]} - The matrix with added subheaders.
 */
function addSubheaders(subheaders, matrix) {
    let matrixWithSubheaders = [];

    if (Array.isArray(subheaders) && Array.isArray(matrix)) {
        let names = [ ...subheaders ];
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
