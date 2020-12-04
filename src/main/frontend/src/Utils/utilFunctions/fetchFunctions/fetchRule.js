import { AlertError, InvalidPathParamsException } from "../../Classes";
import { responseJson } from "./parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET method on <code>/projects/{projectId}/{resource}/{ruleIndex}</code>
 * where <code>projectId</code> is the identifier of a selected project,
 * <code>ruleIndex</code> is the index of a selected rule
 * and <code>resource</code> is the name of a selected resource such as:
 * <i>rules</i>, <i>classification</i> or <i>cross-validation/{foldIndex}</i>.
 *
 * <h3>Goal</h3>
 * The goal of this functions is to retrieve information about selected rule from specified project.
 *
 * <h3>Examples</h3>
 * When resource equals to <i>rules</i>
 * and <i>classification</i> or <i>cross-validation/{foldIndex}</i>
 * but with <code>isCoveringObjects</code> set to <code>true</code>
 * <br>
 * <br>
 * <pre><code>
 *      {
 *          "objectNames": [
 *              "Object 1"
 *              "Object 2"
 *          ],
 *          "indicesOfCoveredObjects": [
 *              0,
 *              1
 *          ],
 *          "isSupportingObject": [
 *              true,
 *              true
 *          ]
 *      }
 * </pre></code>
 * When resource equals to <i>classification</i> or <i>cross-validation</i>
 * <br>
 * <br>
 * <pre><code>
 *     {
 *          "ruleCharacteristics": { },
 *          "rule": { }
 *     }
 * </pre></code>
 *
 * <h3>Usage</h3>
 * If <code>isCoveringObjects</code> is set to <code>true</code> function will perform an API call on
 * <code>/projects/{projectId}/{resource}/{ruleIndex}/coveringObjects</code>.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} resource - The name of a selected resource.
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} pathParams.ruleIndex - The index of a selected rule.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @param {boolean} [isCoveringObjects = false] - If <code>true</code> function will add <code>/coveringObjects</code> to pathname.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchRule(resource, pathParams, base = "http://localhost:8080", isCoveringObjects = false) {
    if (!(resource != null && resource !== "")) {
        throw new InvalidPathParamsException("Resource should be defined when fetching rule.", { resource });
    }

    if (!(pathParams != null && pathParams.hasOwnProperty("projectId")
        && pathParams.hasOwnProperty("ruleIndex"))) {

        throw new InvalidPathParamsException("Path params should be defined when fetching rule.", pathParams);
    }

    const url = new URL(`projects/${pathParams.projectId}/${resource}/${pathParams.ruleIndex}`, base);
    if (isCoveringObjects) url.pathname += "/coveringObjects";

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return responseJson(response);
}

export default fetchRule;
