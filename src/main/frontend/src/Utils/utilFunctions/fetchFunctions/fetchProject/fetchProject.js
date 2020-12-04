import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET, PATCH or DELETE method and specified body on <code>/projects/{projectId}</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve concise information about project, change it's name or delete it.
 *
 * <h3>Examples</h3>
 * When method is set to PATCH
 * <br/>
 * <br/>
 * <pre><code>
 *     {
 *         "id": "2bd9663c-725b-41aa-bb99-d41a43cf1f66",
 *         "name": "students"
 *     }
 * </code></pre>
 * When method is set to GET
 * <br/>
 * <br/>
 * <pre><code>
 *     {
 *          "dominanceCones": {
 *              "isCurrentData": true
 *          },
 *          "unions": {
 *              "isCurrentData": true
 *          },
 *          "rules": {
 *              "externalRules": false,
 *              "isCurrentData": true
 *          },
 *          "classification": {
 *              "externalData": false,
 *              "isCurrentData": true
 *          },
 *          "crossValidation": {
 *              "isCurrentData": true
 *          }
 *      }
 * </code></pre>
 *
 * <h3>Usage</h3>
 * In order to change project's name to "students 2", create a <code>FormData</code> object
 * and append your name with <code>name</code> key.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} method - The HTTP method of an API call.
 * @param {FormData} body - The body in the message of an API call.
 * @param {string} [base=http://localhost:8080] - The host and port in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchProject(pathParams, method, body, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching project.", pathParams);
    }

    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Body should be a valid FormData object.", body);
    }

    const url = new URL(`/projects/${pathParams.projectId}`, base);

    const response = await fetch(url, { method, body }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchProject;
