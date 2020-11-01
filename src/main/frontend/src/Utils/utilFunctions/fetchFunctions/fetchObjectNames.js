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
 * @param {Object} [queryParams] - The query parameters in the URL of an API call.
 * @param {number} [queryParams.subject] - The index of a subject that contains object names.
 * @param {string} [queryParams.set] - The name of the set that narrows down object names.
 * @param {string} [base = http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchObjectNames(resource, pathParams, queryParams, base = "http://localhost:8080") {
    if (!(resource != null && resource !== "")) {
        throw new InvalidPathParamsException("Resource should be defined when fetching object names.", { resource });
    }

    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching object names.", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/${resource}/objectNames`, base);

    if (queryParams != null) {
        if (queryParams.hasOwnProperty("subject")) {
            url.searchParams.append("subject", queryParams.subject.toString());
        }
        if (queryParams.hasOwnProperty("set")) {
            url.searchParams.append("set", queryParams.set);
        }
    }

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server is not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchObjectNames;
