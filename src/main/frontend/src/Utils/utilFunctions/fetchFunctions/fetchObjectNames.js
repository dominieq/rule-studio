import { AlertError, InvalidPathParamsException } from "../../Classes";
import { responseJson } from "./parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET method on <code>/project/{projectId}/{resource}/objectNames</code>
 * where <code>projectId</code> is the identifier of a selected project
 * and <code>resource</code> is the name of a selected resource such as:
 * <i>cones</i>, <i>unions</i>, <i>rules</i>, <i>classification</i>, <i>classification/rules</i> or <i>crossValidation</i>.
 *
 * <h3>Goal</h3>
 * The goal of this functions is to retrieve visible object names.
 *
 * <h3>Example</h3>
 * <pre><code>
 *     [
 *         "Object 1",
 *         "Object 2"
 *     ]
 * </code></pre>
 *
 * <h3>Usage</h3>
 * In order to retrieve object names for the upper approximation of an union with index 0
 * specify <code>queryParams</code> accordingly: <code>{ subject: 0, set: "upperApproximation" }</code>.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} resource - The name of a selected resource.
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {Object} [queryParams] - The query parameters in the URL of an API call.
 * @param {number} [queryParams.subject] - The index of a subject that contains object names.
 * @param {string} [queryParams.set] - The name of the set that narrows down object names.
 * @param {string} [base = http://localhost:8080] - The host in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchObjectNames(resource, pathParams, queryParams, base = "http://localhost:8080") {
    if (!(resource != null && resource !== "")) {
        throw new InvalidPathParamsException("Resource should be defined when fetching object names.", { resource });
    }

    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching object names.", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/${resource}/objectNames`, base);

    if (queryParams != null) {
        if (queryParams.hasOwnProperty("subject") && queryParams.subject != null) {
            url.searchParams.append("subject", queryParams.subject.toString());
        }
        if (queryParams.hasOwnProperty("set") &&  queryParams.set != null) {
            url.searchParams.append("set", queryParams.set);
        }
    }

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server is not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchObjectNames;
