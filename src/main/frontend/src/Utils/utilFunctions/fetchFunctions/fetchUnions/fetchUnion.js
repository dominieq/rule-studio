import {AlertError, InvalidPathParamsException} from "../../../Classes";
import {responseJson} from "../parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET method on <code>/projects/{projectId}/unions/{unionIndex}</code>
 * or <code>/projects/{projectId}/unions/{unionIndex}/{arrayPropertyType}</code>
 * where <code>projectId</code> is the identifier of a selected project,
 * <code>unionIndex</code> is the index of a selected union
 * and <code>arrayPropertyType</code> is the name of a selected union's property such as:
 * <i>objects</i>, <i>upperApproximation</i> or <i>lowerApproximation</i>.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve properties that belong to a specified union
 * or elements from a selected union's property.
 *
 * <h3>Example response</h3>
 * When fetching union:
 * <br/>
 * <br/>
 * <pre><code>
 *      {
 *          "Objects": 237,
 *          "Lower approximation": 78,
 *          "Upper approximation": 251,
 *          "Boundary": 173,
 *          "Positive region": 78,
 *          "Negative region": 2753,
 *          "Boundary region": 168
 *     }
 * </code></pre>
 * When fetching union's property:
 * <pre><code>
 *     {
 *         "objectNames": [
 *             "Object 1",
 *             "Object 2"
 *         ],
 *         "value": [
 *             0,
 *             1
 *         ]
 *     }
 * </pre></code>
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {number} pathParams.unionIndex - The index of a selected union.
 * @param {string} [pathParams.arrayPropertyType] - The name of a selected union property.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchUnion(pathParams, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId") && pathParams.hasOwnProperty("unionIndex")
        && pathParams.hasOwnProperty("arrayPropertyType"))) {

        throw new InvalidPathParamsException("Invalid path params when fetching union", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/unions/${pathParams.unionIndex}`, base) ;
    if (pathParams.arrayPropertyType != null) {
        url.pathname += `/${pathParams.arrayPropertyType}`;
    }

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return responseJson(response);
}

export default fetchUnion;
