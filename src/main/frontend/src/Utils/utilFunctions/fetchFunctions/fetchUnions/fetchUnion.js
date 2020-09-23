import {AlertError, InvalidPathParamsException} from "../../../Classes";
import {responseJson} from "../parseResponse";

/**
 * Performs an API call with GET method on unions to retrieve properties that belong to a specified union
 * or elements of a specified union's property.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - Path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The id of the selected project project.
 * @param {number} pathParams.unionIndex - The id of the selected union.
 * @param {string} [pathParams.arrayPropertyType] - The name of the selected union property.
 * @param {string} [host = http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchUnion(pathParams, host = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId") && pathParams.hasOwnProperty("unionIndex")
        && pathParams.hasOwnProperty("arrayPropertyType"))) {

        throw new InvalidPathParamsException("Invalid path params when fetching union", pathParams);
    }

    let URL = `${host}/projects/${pathParams.projectId}/unions/${pathParams.unionIndex}`;
    if (pathParams.arrayPropertyType !== undefined) {
        URL += `/${pathParams.arrayPropertyType}`;
    }

    const response = await fetch(URL, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return responseJson(response);
}

export default fetchUnion;