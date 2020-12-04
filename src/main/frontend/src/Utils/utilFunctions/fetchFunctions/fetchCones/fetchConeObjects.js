import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET method on <code>/projects/{projectId}/cones/{objectIndex}/{coneType}</code>
 * where <code>projectId</code> is the identifier of a selected project,
 * <code>objectIndex</code> is the index of an object from information table
 * and <code>coneType</code> is the type of a selected cone such as: <i>positive</i>, <i>negative</i>,
 * <i>positive_inverted</i> or <i>negative_inverted</i>.
 *
 * <h3>Goal</h3>
 * The goal of this functions is to retrieve the indices of elements from a selected dominance cone.
 *
 * <h3>Example response</h3>
 * <pre><code>
 *     [
 *          0,
 *          2,
 *          3,
 *          5
 *     ]
 * </code></pre>
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {number} pathParams.objectIndex - The index of a selected object from information table.
 * @param {string} pathParams.coneType - The type of a selected cone.
 * @param {string} [base = http://localhost:8080] - The host in in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchConeObjects(pathParams, base = "http://localhost:8080" ) {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId")
        && pathParams.hasOwnProperty("objectIndex") && pathParams.hasOwnProperty("coneType"))) {

        throw new InvalidPathParamsException("Path params should be defined when fetching cone objects", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/cones/${pathParams.objectIndex}/${pathParams.coneType}`, base);

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchConeObjects;
