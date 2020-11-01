import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * Performs an API call with body and a specified method on cross-validation.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} method - The HTTP method of an API call.
 * @param {Object} body - The body of an API call.
 * @param {string} [base=http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchCrossValidation(pathParams, method, body, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching cross-validation", pathParams);
    }

    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Body should be a valid FormData object.", body);
    }

    const url = new URL(`/projects/${pathParams.projectId}/crossValidation`, base)

    const response = await fetch(url, { method, body }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

   return await responseJson(response);
}

export default fetchCrossValidation;
