import { AlertError, InvalidPathParamsException } from "../../Classes";
import { responseJson } from "./parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET method on <code>/projects/{projectId}/{resource}/object</code>
 * where <code>projectId</code> is the identifier of a selected project
 * and <code>resource</code> is the name of a selected resource such as:
 * <i>cones</i>, <i>unions</i>, <i>rules</i>, <i>classification</i>, <i>classification/rules</i> or <i>crossValidation</i>.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve an object with a specified index from the information table.
 *
 * <h3>Example</h3>
 * When <code>isAttributes</code> is set to <code>true</code>
 * <br>
 * <br>
 * <pre><code>
 *      {
 *          "value": { },
 *          "attributes": [ ]
 *      }
 * </code></pre>
 * <h3>Usage</h3>
 * In order to retrieve information about object with index 0 and receive attributes as well
 * specify <code>queryParams</code> accordingly: <code>{ objectIndex: 0, isAttributes: true }</code>.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} resource - The name of a selected resource.
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {Object} queryParams - The query parameters in the URL of an API call.
 * @param {string} queryParams.objectIndex - The index of a selected object from information table.
 * @param {boolean} queryParams.isAttributes - If <code>true</code> server will include attributes in response.
 * @param {string} [base=http://localhost:8080] - The host and port in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchObject(resource, pathParams, queryParams, base = "http://localhost:8080") {
    if (!(resource != null && resource !== "")) {
        throw new InvalidPathParamsException("Resource should be defined when fetching object.", { resource });
    }

    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching object", pathParams);
    }

    if (!(queryParams != null && queryParams.hasOwnProperty("objectIndex")
        && queryParams.hasOwnProperty("isAttributes"))) {

        throw new InvalidPathParamsException("Query params should be defined when fetching object", queryParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/${resource}/object`, base);

    url.searchParams.append("objectIndex", queryParams.objectIndex);
    url.searchParams.append("isAttributes", queryParams.isAttributes.toString());

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchObject;
