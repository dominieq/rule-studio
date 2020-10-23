import { AlertError, InvalidPathParamsException } from "../../Classes";
import { responseJson } from "./parseResponse";

/**
 * Performs an API call with GET method on <code>/projects/{projectId}/rules/{ruleIndex}</code>
 * to retrieve information about selected rule from specified project.
 * <br>
 * <br>
 * If <code>isCoveringObjects</code> is set to <code>true</code> function will perform an API call on
 * <code>/projects/{projectId}/rules/{ruleIndex}/coveringObjects</code> to retrieve objects
 * that are covered by a selected rule.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} resource - The name of the selected resource.
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} pathParams.ruleIndex - The index of a selected rule.
 * @param {string} [base=http://localhost:8080] - The host in the URL of an API call.
 * @param {boolean} [isCoveringObjects=false] - If <code>true</code> function will add <code>/coveringObjects</code> to pathname.
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

    const url = new URL(`projects/${pathParams.projectId}/rules/${pathParams.ruleIndex}`, base);
    if (isCoveringObjects) url.pathname += "/coveringObjects";

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return responseJson(response);
}

export default fetchRule;
