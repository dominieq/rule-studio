import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * Performs an API call with a body and a specified method on all projects.
 *
 * @category Utils
 * @subcategory Functions
 * @param {"GET"|"POST"} method - The HTTP method of an API call.
 * @param {Object} body - The body of an API call.
 * @param {string} base - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchProjects(method, body, base = "http://localhost:8080") {
    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Invalid body when fetching projects.", { body });
    }

    const url = new URL("/projects", base);

    const response = await fetch(url, { method, body }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchProjects;
