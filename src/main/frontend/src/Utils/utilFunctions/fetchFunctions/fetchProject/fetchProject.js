import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * Performs an API call with a body and a given method on a specified project.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} projectId - The id of the selected project.
 * @param {"DELETE"|"PATCH"} method - The HTTP method of an API call.
 * @param {Object} body - The body of an API call.
 * @param {string} [base=http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchProject(projectId, method, body, base = "http://localhost:8080") {
    if (projectId == null) {
        throw new InvalidPathParamsException("Invalid project identifier when fetching project.", { projectId });
    }

    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Invalid body when fetching project.", { body });
    }

    const url = new URL(`/projects/${projectId}`, base);

    const response = await fetch(url, { method, body }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchProject;
