import { handleResponse } from "./utilFunctions";

/**
 * Performs an API call with a body and a given method on a specified project.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} base - The name of the host.
 * @param {string} projectId - The id of current project.
 * @param {string} method - A HTTP method such as GET, PUT or POST.
 * @param {Object} data - The body of a message.
 * @returns {Promise<Object>}
 */
async function fetchProject(base, projectId, method, data) {
    const response = await fetch(`${base}/projects/${projectId}`, {
        method: method,
        body: data
    }).catch(() => null);

    return await handleResponse(response);
}

export default fetchProject;