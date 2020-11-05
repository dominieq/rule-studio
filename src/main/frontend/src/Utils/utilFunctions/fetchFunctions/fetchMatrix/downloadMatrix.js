import { InvalidPathParamsException } from "../../../Classes";
import { downloadFunction } from "../downloadFunction";

/**
 * <h3>Overview</h3>
 * Utilizes {@link downloadFunction} to download matrix from
 * <code>/projects/{projectId}/misclassificationMatrix/download</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * <h3>Usage</h3>
 * In order to download matrix from second fold from cross-validation
 * specify <code>queryParams</code> accordingly: <code>{ typeOfMatrix: crossValidationFold, foldIndex: 1 }</code>.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {Object} [queryParams] - The query parameters in the URL of an API call.
 * @param {string} [queryParams.typeOfMatrix] - The type of a matrix download.
 * @param {string} [queryParams.numberOfFold] - The index of a fold from cross-validation.
 * @param {string} [base=http://localhost:8080] - The host in the URL of an API call.
 */
async function downloadMatrix(pathParams, queryParams, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when downloading matrix.", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/misclassificationMatrix/download`, base);

    if (queryParams) {
        if (queryParams.hasOwnProperty("typeOfMatrix")) {
            url.searchParams.append("typeOfMatrix", queryParams.typeOfMatrix);
        }
        if (queryParams.hasOwnProperty("numberOfFold")) {
            url.searchParams.append("numberOfFold", queryParams.numberOfFold);
        }
    }

    await downloadFunction(url);
}

export default downloadMatrix;
