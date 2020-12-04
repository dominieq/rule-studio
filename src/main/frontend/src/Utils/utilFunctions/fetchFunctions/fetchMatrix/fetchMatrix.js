import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET method on <code>/projects/{projectId}/classification/misclassificationMatrix</code>
 * or <code>/projects/{projectId}/crossValidation/{foldIndex}/misclassificationMatrix</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve information about misclassification matrix from a selected project.
 *
 * <h3>Example response</h3>
 * <pre><code>
 *     {
 *         "decisionsDomain": [
 *              "bad",
 *              "medium",
 *              "good"
 *         ],
 *         "traits": {
 *             "Accuracy": 0.9476492164054684,
               "Deviation of accuracy": 0.012053299287963505,
               "mae": 0.052350783594531505,
               "rmse": 0.22880293615802116,
               "gmean": 0.7313837893935226,
               "Number of correct assignments": 284.2,
               "Deviation of number of correct assignments": 3.6147844564602556,
               "Number of incorrect assignments": 15.7,
               "Deviation of number of incorrect assignments": 4.854551129266914,
               "Number of objects with assigned decision": 299.90000000000003,
               "Deviation of number objects with assigned decision": 2.8460498941515415,
               "Number of unknown original decisions": 0.0,
               "Deviation of number of unknown original decisions": 0.0,
               "Number of unknown assignments": 0.0,
               "Deviation of number of unknown assignments": 0.0,
               "Number of unknown assigned decisions for unknown original decisions": 0.0,
               "Deviation of number of unknown assigned decisions for unknown original decisions": 0.0
 *          },
 *         "value": [
 *             [101.60000000000001, 1.4000000000000001, 0]
 *             [0, 173.20000000000002, 0],
 *             [0, 14.3, 9.399999999999999]
 *         ],
 *         "Deviation of value": [
 *             [1.1737877907772674, 1.1737877907772674, 0],
 *             [0, 0.6324555320336759, 0],
 *             [0, 4.738729318662921, 3.5023801430836525]
 *          ]
 *     }
 * </code></pre>
 *
 * <h3>Usage</h3>
 * In order to retrieve matrix from second fold from cross-validation
 * specify <code>queryParams</code> accordingly: <code>{ typeOfMatrix: crossValidationFold, foldIndex: 1 }</code>.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} resource -  The name of a selected resource.
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {Object} [queryParams] - The query parameters in the URL of an API call.
 * @param {string} queryParams.typeOfMatrix - The type of a matrix to fetch.
 * @param {string} [queryParams.numberOfFold] - The index of a selected fold.
 * @param {string} [base=http://localhost:8080] - The host and port in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchMatrix(resource, pathParams, queryParams, base = "http://localhost:8080") {
    if (!(resource != null && resource !== "")) {
        throw new InvalidPathParamsException("Resource should be defined when fetching matrix.", { resource });
    }

    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching matrix.", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/${resource}/misclassificationMatrix`, base);

    if (queryParams != null) {
        if (queryParams.hasOwnProperty("typeOfMatrix")) {
            url.searchParams.append("typeOfMatrix", queryParams.typeOfMatrix);
        }
        if (queryParams.hasOwnProperty("numberOfFold")) {
            url.searchParams.append("numberOfFold", queryParams.numberOfFold);
        }
    }

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchMatrix;
