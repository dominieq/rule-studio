import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * Performs an API call with GET method on cones to retrieve elements of a selected dominance cone.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - Path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {number} pathParams.objectIndex - The index of a selected object from information table.
 * @param {"positive"|"negative"|"positive_inverted"|"negative_inverted"} pathParams.coneType - The type of a selected cone.
 * @param {string} [base = http://localhost:8080] - The host in in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchConeObjects(pathParams, base = "http://localhost:8080" ) {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId")
        && pathParams.hasOwnProperty("objectIndex") && pathParams.hasOwnProperty("coneType"))) {

        throw new InvalidPathParamsException("Path params should be defined when fetching cone objects", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/cones/${pathParams.objectIndex}/${pathParams.coneType}`, base);

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchConeObjects;
