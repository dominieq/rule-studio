import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * Performs an API call with body and a specified method on cones.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} projectId - The identifier of a selected project.
 * @param {"GET"|"PUT"} method - The HTTP method of an API call.
 * @param {FormData} body - The body of an API call.
 * @param {string} [base = http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchCones(projectId, method, body, base = "http://localhost:8080") {
    if (!(projectId != null && projectId !== "")) {
        throw new InvalidPathParamsException("Path params should be defined when fetching cones.", { projectId });
    }

    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Body should be a valid FormData object.", body)
    }

    const url = new URL(`/projects/${projectId}/cones`, base);

    const response = await fetch(url, { method, body }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchCones;
