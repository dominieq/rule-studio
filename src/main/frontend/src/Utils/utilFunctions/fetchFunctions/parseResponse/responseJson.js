import handleNotOk from "./handleNotOk";

/**
 * <h3>Overview</h3>
 * Returns response from a server parsed to JSON format.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} response - A response from a server that can be parsed to JSON format.
 * @returns {Promise<Object>}
 */
async function responseJson(response) {
    if (response.status === 200) {
        return response.json().catch(() => null);
    } else {
        return await handleNotOk(response);
    }
}

export default responseJson;
