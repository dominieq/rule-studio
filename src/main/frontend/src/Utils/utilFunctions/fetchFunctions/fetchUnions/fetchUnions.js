import { responseJson } from "../parseResponse";
import { AlertError, InvalidPathParamsException } from "../../../Classes";

/**
 * Performs an API call with body or path parameters and a specified method on unions.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The id of the selected project project.
 * @param {Object} queryParams - The query parameters in the URL of an API call.
 * @param {string} [queryParams.typeOfUnions] - The value of type of unions from {@link Unions} tab.
 * @param {number} [queryParams.consistencyThreshold] - The value of consistency threshold from {@link Unions} tab.
 * @param {"GET"|"PUT"} method - The HTTP method of an API call.
 * @param {string} [base = http://localhost:8080] - The host in the URL of an API call.
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
