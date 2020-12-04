import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";


/**
 * <h3>Overview</h3>
 * Performs an API call with GET or PUT method and specified body on <code>/projects/{projectId}/rules</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve, upload or calculate decision rules from a selected project.
 *
 * <h3>Example response</h3>
 * <pre><code>
 *     {
 *         "externalRules": false,
 *         "validityRulesContainer": {
 *             "unions": {
 *                 "isCurrentData": true
 *             },
 *             "classification": {
 *                 "externalData": false,
 *                 "isCurrentData": true
 *             }
 *         },
 *         "Rules": [
 *             {
 *                 "ruleCharacteristics": { },
 *                 "rule": { }
 *             },
 *             {
 *                 "ruleCharacteristics": { },
 *                 "rule": { }
 *             }
 *         ],
 *         "parameters": {
 *             "typeOfUnions": "MONOTONIC",
 *             "consistencyThreshold": 0.0,
 *             "typeOfRules": "CERTAIN"
 *         },
 *         "isCurrentData": true
 *     }
 * </code></pre>
 *
 * <h3>Usage</h3>
 * In order to calculate rules with the following parameters:
 * <ul>
 *     <li>type of unions - monotonic</li>
 *     <li>consistency threshold - 0.0</li>
 *     <li>type of rules - certain</li>
 * </ul>
 * create a <code>FormData</code> object and append mentioned parameters to the body using <code>append</code> method.
 * <br/>
 * <br/>
 * In order to upload rules create a <code>FormData</code> object
 * and append selected file with <code>rules</code> key.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} method - The HTTP method of an API call.
 * @param {FormData} body - The body in the message of an API call.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @param {boolean} [upload = false] - If <code>true</code> function will add <code>/upload</code> to path.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchRules(pathParams, method, body, base = "http://localhost:8080", upload = false) {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching rules.", pathParams);
    }

    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Body should be a valid FormData object.", body);
    }

    const url = new URL(`/projects/${pathParams.projectId}/rules`, base);
    if (upload) url.pathname += "/upload";

    const response = await fetch(url, { method, body }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchRules;
