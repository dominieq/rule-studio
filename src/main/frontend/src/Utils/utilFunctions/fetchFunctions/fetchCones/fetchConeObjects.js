import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * Performs an API call with GET method on cones to retrieve elements of a selected dominance cone.
 *
 * @param {Object} pathParams - Path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The id of the selected project.
 * @param {number} pathParams.objectIndex - The index of the selected object from information table.
 * @param {"positive"|"negative"|"positive_inverted"|"negative_inverted"} pathParams.coneType - The type of a selected object.
 * @param {string} [host = https://localhost:8080] - The host in in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchConeObjects(pathParams, host = "https://localhost:8080" ) {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId")
        && pathParams.hasOwnProperty("objectIndex") && pathParams.hasOwnProperty("coneType"))) {

        throw new InvalidPathParamsException("Invalid path params when fetching objects from cone", pathParams);
    }

    const URL = `${host}/projects/${pathParams.projectId}/cones/${pathParams.objectIndex}/${pathParams.coneType}`;
    const response = await fetch(URL, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchConeObjects;
