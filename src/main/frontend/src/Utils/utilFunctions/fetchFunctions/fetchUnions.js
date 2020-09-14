import { responseJson } from "./parseResponse";
import { AlertError } from "../../Classes";

/**
 * Performs an API call with body or path parameters and a specified method on unions.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} base - The name of the host.
 * @param {string} projectId - The id of current project.
 * @param {string} method - A HTTP method such as GET, PUT or POST.
 * @param {Object} data - The body of a message or path parameters.
 * @throws AlertError
 * @returns {Promise<Object>}
 */
async function fetchUnions(base, projectId, method, data) {
    let query = ""
    if (data && Object.keys(data).length) {
        query = `?typeOfUnions=${data.typeOfUnions}&consistencyThreshold=${data.consistencyThreshold}`;
        data = null;
    }

    const response = await fetch(`${base}/projects/${projectId}/unions` + query, {
        method: method,
        body: data,
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchUnions;
