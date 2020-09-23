import { responseJson } from "../parseResponse";
import { AlertError, InvalidPathParamsException } from "../../../Classes";

/**
 * Performs an API call with body or path parameters and a specified method on unions.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParameters - Path parameters in the URL of an API call.
 * @param {string} pathParameters.projectId - The id of the selected project project.
 * @param {string} [pathParameters.typeOfUnions] - The value of type of unions from {@link Unions} tab.
 * @param {number} [pathParameters.consistencyThreshold] - The value of consistency threshold from {@link Unions} tab.
 * @param {"GET"|"PUT"} method - The HTTP method of an API call.
 * @param {string} [host = http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchUnions(pathParameters, method, host = "http://localhost:8080") {
    if (!(pathParameters != null && pathParameters.hasOwnProperty("projectId")
        && pathParameters.hasOwnProperty("typeOfUnions") && pathParameters.hasOwnProperty("consistencyThreshold"))) {

        throw new InvalidPathParamsException("Invalid path params when fetching unions", pathParameters);
    }

    let URL = `${host}/projects/${pathParameters.projectId}/unions`;
    if (pathParameters.consistencyThreshold !== undefined && pathParameters.typeOfUnions !== undefined) {
        URL += `?typeOfUnions=${pathParameters.typeOfUnions}&consistencyThreshold=${pathParameters.consistencyThreshold}`;
    }

    const response = await fetch(URL,{
        method: method
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchUnions;
