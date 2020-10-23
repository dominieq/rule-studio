import { AlertError, InvalidPathParamsException } from "../../Classes";
import { responseJson } from "./parseResponse";

/**
 * Performs an API call with GET method on selected resource
 * to retrieve an object with specified index from information table.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} resource - The name of a selected resource.
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {Object} queryParams - The query parameters in the URL of an API call.
 * @param {string} queryParams.objectIndex - The index of a selected object from information table.
 * @param {boolean} queryParams.isAttributes - If <code>true</code> server will include attributes in response.
 * @param {string} [base=http://localhost:8080] - The base in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchObject(resource, pathParams, queryParams, base = "http://localhost:8080") {
    if (!(resource != null && resource !== "")) {
        throw new InvalidPathParamsException("Resource should be defined when fetching object.", { resource });
    }

    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching object", pathParams);
    }

    if (!(queryParams != null && queryParams.hasOwnProperty("objectIndex")
        && queryParams.hasOwnProperty("isAttributes"))) {

        throw new InvalidPathParamsException("Query params should be defined when fetching object", queryParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/${resource}/object`, base);

    url.searchParams.append("objectIndex", queryParams.objectIndex);
    url.searchParams.append("isAttributes", queryParams.isAttributes.toString());

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchObject;
