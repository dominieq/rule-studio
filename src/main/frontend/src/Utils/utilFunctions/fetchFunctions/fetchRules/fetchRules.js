import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";


/**
 * Performs an API call with body and a specified method on rules.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} method - The HTTP method of an API call.
 * @param {Object} body - The body of an API call.
 * @param {string} [base=http://localhost:8080] - The host in the URL of an API call.
 * @param {boolean} [upload=false] - If <code>true</code> function will add <code>/upload</code> to path.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchRules(pathParams, method, body, base = "http://localhost:8080", upload = false) {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching rules.", pathParams);
    }

    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Body should be a valid FormData object.", body);
    }

    const url = new URL(`/projects/${pathParams.projectId}/rules`, base);
    if (upload) url.pathname += "/upload";

    const response = await fetch(url, { method, body }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchRules;
