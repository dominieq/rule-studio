import { AlertError, InvalidPathParamsException } from "../../Classes";
import { responseJson } from "./parseResponse";

/**
 * Performs an API call on selected resource to retrieve attributes from information table
 * or change default visible object names.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} resource - The name of the selected resource.
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The id of the selected project.
 * @param {Object} queryParams - The query parameters in the URL of an API call.
 * @param {string} [queryParams.objectVisibleName] - New type of name that will used to describe objects.
 * @param {"GET"|"POST"} method - The HTTP method of an API call.
 * @param {string} [base = http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchDescriptiveAttributes(resource, pathParams, queryParams, method, base = "http://localhost:8080") {
    if (!(resource != null && resource !== "")) {
        throw new InvalidPathParamsException("Resource should be defined when fetching descriptive attributes", { resource });
    }

    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching descriptive attributes", pathParams);
    }

    if (!(queryParams != null && queryParams.hasOwnProperty("objectVisibleName"))) {
        throw new InvalidPathParamsException("Query params should be defined when fetching descriptive attributes", queryParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/${resource}/descriptiveAttributes`, base);

    if (queryParams.objectVisibleName !== undefined) {
        url.searchParams.append("objectVisibleName", queryParams.objectVisibleName)
    }

    const response = await fetch(url, { method}).catch(() => {
        throw new AlertError("Server is not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchDescriptiveAttributes;
