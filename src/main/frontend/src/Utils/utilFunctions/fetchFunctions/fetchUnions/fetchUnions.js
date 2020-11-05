import { responseJson } from "../parseResponse";
import { AlertError, InvalidPathParamsException } from "../../../Classes";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET or PUT method on <code>/projects/{projectId}/unions</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve or calculate class unions for a selected project.
 *
 * <h3>Example response</h3>
 * <pre><code>
 *     {
 *         "qualityOfApproximation": 1,
 *         "Unions": [
 *             {
 *                  "unionType": "AT_MOST",
                    "limitingDecision": "good",
                    "accuracyOfApproximation": 1,
                    "qualityOfApproximation": 1
 *             }
 *         ],
 *         "isCurrentData": true,
 *         "parameters": {
 *             "typeOfUnions": MONOTONIC,
 *             "consistencyThreshold": 0.0
 *         }
 *     }
 * </pre></code>
 *
 * <h3>Usage</h3>
 * In order to calculate monotonic class unions with consistency threshold equal to 0.3
 * specify <code>queryParams</code> accordingly: <code>{ typeOfUnions: "monotonic", consistencyThreshold: 0.3 }</code>.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {Object} queryParams - The query parameters in the URL of an API call.
 * @param {string} [queryParams.typeOfUnions] - The value of the type of unions from {@link Unions} tab.
 * @param {number} [queryParams.consistencyThreshold] - The value of consistency threshold from {@link Unions} tab.
 * @param {"GET"|"PUT"} method - The HTTP method of an API call.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchUnions(pathParams, queryParams, method, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Invalid path params when fetching unions", pathParams);
    }

    if (!(queryParams != null && queryParams.hasOwnProperty("typeOfUnions")
        && queryParams.hasOwnProperty("consistencyThreshold"))) {

        throw new InvalidPathParamsException("Query params should be defined when fetching unions", queryParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/unions`, base);
    if (queryParams.consistencyThreshold !== undefined && queryParams.typeOfUnions !== undefined) {
        url.searchParams.append("typeOfUnions", queryParams.typeOfUnions);
        url.searchParams.append("consistencyThreshold", "" + queryParams.consistencyThreshold);
    }

    const response = await fetch(url,{ method }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchUnions;
