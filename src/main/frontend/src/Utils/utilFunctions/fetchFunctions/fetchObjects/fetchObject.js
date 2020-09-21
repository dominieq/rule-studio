import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * Performs an API call with GET method on object from project's information table.
 *
 * @param {Object} pathParams - Path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The id of the selected project.
 * @param {string} pathParams.objectIndex - The index of the selected object from information table.
 * @param {string} [host = https://localhost:8080] - The host of in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchObject(pathParams, host = "https://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId")
        && pathParams.hasOwnProperty("objectIndex"))) {

        throw new InvalidPathParamsException("Invalid path params when fetching object", pathParams);
    }

    const URL = `${host}/projects/${pathParams.projectId}/data/${pathParams.objectIndex}`;
    const response = await fetch(URL, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchObject;