import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET or PUT method and a specified body on <code>/projects/{projectId}/classification</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve or calculate classification for a selected project.
 *
 * <h3>Example response</h3>
 * <pre><code>
 *     {
 *         "objectNames": [
 *             "Object 1",
 *             "Object 2"
 *         ],
 *         "externalData": false,
 *         "Objects": [
 *             {
 *                 "originalDecision": "medium",
 *                 "suggestedDecision": "medium",
 *                 "certainty": 1.0,
 *                 "numberOfCoveringRules": 2
 *             },
 *             {
 *                 "originalDecision": "medium",
 *                 "suggestedDecision": "medium",
 *                 "certainty": 1.0,
 *                 "numberOfCoveringRules": 3
 *             }
 *         ],
 *         "isCurrentData": true
 *         "parameters": {
 *             "classifierType": "SIMPLE_RULE_CLASSIFIER",
 *             "defaultClassificationResultType": "MAJORITY_DECISION_CLASS"
 *         }
 *     }
 * </code></pre>
 *
 * <h3>Usage</h3>
 * In order to calculate with the following parameters:
 * <ul>
 *     <li>classifier type - simple rule classifier</li>
 *     <li>default classification result type - majority decision class</li>
 * </ul>
 * create a <code>FormData</code> object and append mentioned parameters to the body using <code>append</code> method.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} method - The HTTP method of an API call.
 * @param {Object} body - The body in the message of an API call.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchClassification(pathParams, method, body, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching classification.", pathParams);
    }

    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Body should be a valid FormData object.", body);
    }

    const url = new URL(`/projects/${pathParams.projectId}/classification`, base);

    const response = await fetch(url, { method, body }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchClassification;
