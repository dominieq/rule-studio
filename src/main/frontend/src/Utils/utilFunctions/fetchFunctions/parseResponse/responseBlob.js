import handleNotOk from "./handleNotOk";

/**
 * Returns response from a server parsed to BLOB format.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} response - A response from a server that can be converted to BLOB format.
 * @returns {Promise<Object>}
 */
async function responseBlob(response) {
    if (response.status === 200) {
        return response.blob().catch(() => null);
    } else {
        return await handleNotOk(response);
    }
}

export default responseBlob;
