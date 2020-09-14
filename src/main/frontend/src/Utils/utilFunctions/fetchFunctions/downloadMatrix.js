import { downloadFunction } from "./downloadFunction";

/**
 * Downloads misclassification matrix from given fold and of specified type.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} base - The name of the host.
 * @param {string} projectId - The id of current project.
 * @param {Object} data - The parameters in URL.
 */
async function downloadMatrix(base, projectId, data ) {
    let link = `${base}/projects/${projectId}/misclassificationMatrix/download`;

    if (data) {
        if (Object.keys(data).includes("typeOfMatrix")) {
            link = link + `?typeOfMatrix=${data.typeOfMatrix}`;
        }
        if (Object.keys(data).includes("numberOfFold")) {
            link = link + `&numberOfFold=${data.numberOfFold}`;
        }
    }

    await downloadFunction(link);
}

export default downloadMatrix;
