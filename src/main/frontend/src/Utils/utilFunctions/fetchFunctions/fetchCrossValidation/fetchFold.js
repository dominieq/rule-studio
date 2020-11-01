import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * Performs an API call with GET method on <code>/projects/{projectId}/crossValidation/{foldIndex}</code>
 * where <code>projectId</code> is the identifier of a selected project
 * and <code>foldIndex</code> is the index of a selected fold from cross-validation.
 * <br>
 * <br>
 * Example response:
 * <pre><code>
 *      {
 *          "objectNames": [
 *              "Object 1",
 *              "Object 2"
 *          ],
 *          "numberOfTrainingObjects": 2,
 *          "numberOfRules": 1,
 *          "objects": [
 *              {
 *                  "originalDecision": "bad",
 *                  "suggestedDecision": "bad",
 *                  "certainty": 1.0,
 *                  "numberOfCoveringRules": 11
 *              },
 *              {
 *                  "originalDecision": "bad",
 *                  "suggestedDecision": "bad",
 *                  "certainty": 1.0,
 *                  "numberOfCoveringRules": 7
 *              }
 *          ]
 *      }
 * </code></pre>
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {number} pathParams.foldIndex - The index of a selected fold from cross-validation
 * @param {string} [base=http://localhost:8080] - The host and port in the URL of an API call.
 * @returns {Promise<Object>}
 */
async function fetchFold(pathParams, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId")
        && pathParams.hasOwnProperty("foldIndex"))) {

        throw new InvalidPathParamsException("Path params should be defined when fetching fold.", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/crossValidation/${pathParams.foldIndex}`, base);

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding.", true, "error");
    });

    return await responseJson(response)
}

export default fetchFold;
