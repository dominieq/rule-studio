import { AlertError, InvalidPathParamsException } from "../../Classes";
import { responseJson } from "./parseResponse";

/**
 * Performs an API call with GET method on selected resource to retrieve visible object names.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} resource - The name of the selected resource.
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The id of the selected project project.
 * @param {string} [base = http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchObjectNames(resource, pathParams, base = "http://localhost:8080") {
    if (!(resource != null && resource !== "")) {
        throw new InvalidPathParamsException("Resource should be defined when fetching object names.", { resource });
    }

    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching object names.", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/${resource}/objectNames`, base);

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server is not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchObjectNames;
