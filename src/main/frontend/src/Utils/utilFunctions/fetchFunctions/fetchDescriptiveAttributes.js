import { AlertError, InvalidPathParamsException } from "../../Classes";
import { responseJson } from "./parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET or POST method on <code>/projects/{projectId}/{resource}/descriptiveAttributes</code>
 * where <code>projectId</code> is the identifier of a selected project
 * and <code>resource</code> is the name of a selected resource such as:
 * <i>cones</i>, <i>unions</i>, <i>rules</i>, <i>classification</i>, <i>classification/rules</i> and <i>crossValidation</i>.
 *
 * <h3>Goal</h3>
 * The goal of this function is to retrieve the name of descriptive attributes from information table
 * or change default visible object name which is the value of a descriptive attribute for a certain object.
 *
 * <h3>Example response</h3>
 * <pre><code>
 *     {
 *         "available": [
 *             "Name",
 *             "LastName"
 *         ],
 *         "actual": null
 *     }
 * </code></pre>
 *
 * <h3>Usage</h3>
 * In order to set default object names to represent values of an attribute "Name"
 * specify <code>queryParams</code> accordingly: <code>{ objectVisibleName: "Name" }</code> and set method to POST.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} resource - The name of a selected resource.
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {Object} queryParams - The query parameters in the URL of an API call.
 * @param {string} [queryParams.objectVisibleName] - The new type of a name that will be used to describe objects.
 * @param {string} method - The HTTP method of an API call.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchDescriptiveAttributes(resource, pathParams, queryParams, method, base = "http://localhost:8080") {
    if (!(resource != null && resource !== "")) {
        throw new InvalidPathParamsException("Resource should be defined when fetching descriptive attributes", { resource });
    }

    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching descriptive attributes", pathParams);
    }

    if (!(queryParams != null && queryParams.hasOwnProperty("objectVisibleName"))) {
        throw new InvalidPathParamsException("Query params should be defined when fetching descriptive attributes", queryParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/${resource}/descriptiveAttributes`, base);

    if (queryParams.objectVisibleName !== undefined) {
        url.searchParams.append("objectVisibleName", queryParams.objectVisibleName)
    }

    const response = await fetch(url, { method}).catch(() => {
        throw new AlertError("Server is not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchDescriptiveAttributes;
