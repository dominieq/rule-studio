import { responseJson } from "../parseResponse";
import { AlertError } from "../../../Classes";

/**
 * Performs an API call with body and a specified method on cones.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} projectId - The id of the selected project project.
 * @param {"GET"|"PUT"} method - The HTTP method of an API call.
 * @param {FormData} data - The body of an API call.
 * @param {string} [host = http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @returns {Promise<Object>}
 */
async function fetchCones(projectId, method, data, host = "http://localhost:8080") {
    const response = await fetch(`${host}/projects/${projectId}/cones`, {
        method: method,
        body: data,
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchCones;
