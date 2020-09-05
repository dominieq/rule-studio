import { handleResponse } from "./utilFunctions";

/**
 * Performs an API call with a body and a specified method on all projects.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} base - The name of the host.
 * @param {string} method - A HTTP method such as GET, PUT or POST.
 * @param {Object} data - The body of a message.
 * @returns {Promise<Object>}
 */
async function fetchProjects(base, method, data) {
    const response = await fetch(`${base}/projects`, {
        method: method,
        body: data
    }).catch(() => null);

    return await handleResponse(response);
}

export default fetchProjects;