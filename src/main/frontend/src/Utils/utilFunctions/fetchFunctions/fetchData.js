import { responseJson } from "./parseResponse";

/**
 * Performs an API call on data with POST method.
 *
 * @category Utils
 * @subcategory Functions
 * @param serverBase - The name of the host.
 * @param projectId - The id of current project.
 * @param data - The body of a message.
 * @returns {Promise<Object>}
 */
async function fetchData(serverBase, projectId, data) {
    const response = await fetch(`${serverBase}/projects/${projectId}/data`, {
        method: "POST",
        body:  data
    }).catch(error => console.log(error));

    return await responseJson(response);
}

export default fetchData;
