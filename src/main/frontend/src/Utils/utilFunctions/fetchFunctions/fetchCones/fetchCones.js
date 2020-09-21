import { responseJson } from "../parseResponse";
import { AlertError } from "../../../Classes";

/**
 * Performs an API call with body and a specified method on cones.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} base - The name of the host.
 * @param {string} projectId - The id of current project.
 * @param {string} method - A HTTP method such as GET, PUT or POST.
 * @param {Object} data - The body of a message.
 * @throws AlertError
 * @returns {Promise<Object>}
 */
async function fetchCones(base, projectId, method, data) {
    const response = await fetch(`${base}/projects/${projectId}/cones`, {
        method: method,
        body: data,
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchCones;
