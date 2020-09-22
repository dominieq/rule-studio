import { AlertError, InvalidPathParamsException } from "../../../Classes";
import {responseJson} from "../parseResponse";

/**
 * Performs an API call with GET method on objects comparison from project's information table.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - Path parameters from the URL of an API call.
 * @param {string} pathParams.projectId - The id of the selected project.
 * @param {string} pathParams.firstObjectIndex - The index of first selected object from information table.
 * @param {string} pathParams.secondObjectIndex - The index of second selected object from information table.
 * @param {string} [host = http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchObjectsComparison(pathParams, host = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId")
        && pathParams.hasOwnProperty("firstObjectIndex") && pathParams.hasOwnProperty("secondObjectIndex"))) {

        throw new InvalidPathParamsException("Invalid path params when fetching objects comparison", pathParams);
    }

    const URL = `${host}/project/${pathParams.projectId}/data/${pathParams.firstObjectIndex}/${pathParams.secondObjectIndex}`;
    const response = fetch(URL, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    })

    return await responseJson(response);
}

export default fetchObjectsComparison;