import { InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";


/**
 * <h3>Overview</h3>
 * Performs an API call with GET or PUT method on <code>/projects/{projectId}/data</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve or update information table from specified project.
 *
 * <h3>Examples</h3>
 * When method is set to GET
 * <br/>
 * <br/>
 * <pre><code>
 *     {
 *         "attributes": [ ],
 *         "objects": [ ]
 *     }
 * </code></pre>
 * When method is set to POST
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
 *              "isCurrentLearningData": true,
 *              "isCurrentRuleSet": true
 *          },
 *          "crossValidation": {
 *              "isCurrentData": true
 *          }
 *      }
 * </code></pre>
 *
 * <h3>Usage</h3>
 * In order to update information table, create a <code>FormData</code> object and append
 * attributes and objects to the body using <code>append</code> method
 * with keys <code>metadata</code> and <code>data</code>.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} method - The HTTP method of an API call.
 * @param {FormData} body - The body in the message of an API call.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @returns {Promise<Object>}
 */
async function fetchData(pathParams, method, body, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching project", pathParams);
    }

    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Body should be a valid FormData object", body);
    }

    const url = new URL(`/projects/${pathParams.projectId}/data`, base);
    const response = await fetch(url, { method, body }).catch(error => console.log(error));
    return await responseJson(response);
}

export default fetchData;
