import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET or POST on <code>/project/{projectId}/cones</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve or calculate dominance cones for objects from specified project.
 *
 * <h3>Example response</h3>
 * <pre><code>
 *     {
 *         "numberOfObjects": 2,
 *         "objectNames": [
 *             "Object 1",
 *             "Object 2"
 *         ],
 *         "isCurrentData": true,
 *         "positiveDominanceCones": [
 *             "Object 1"
 *         ],
 *         "negativeDominanceCones": [
 *             "Object 2"
 *         ],
 *         "positiveInvertedDominanceCones": [
 *             "Object 2"
 *         ],
 *         "negativeInvertedDominanceCones": [
 *             "Object 1"
 *         ]
 *     }
 * </code></pre>
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} method - The HTTP method of an API call.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchCones(pathParams, method, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching cones.", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/cones`, base);

    const response = await fetch(url, { method }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchCones;
