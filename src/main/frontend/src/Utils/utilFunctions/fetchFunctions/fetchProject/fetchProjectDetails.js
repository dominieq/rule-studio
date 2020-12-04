import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET method on <code>/projects/{projectId}/details</code>.
 *
 * <h3>Goal</h3>
 * The goal of this functions is to retrieve concise details about selected project.
 *
 * <h3>Example response</h3>
 * <pre><code>
 *      {
 *          "metadataFileName": "students_metadata.json",
 *          "dataFileName": "students_data.csv",
 *          "rulesFileName": "students_rules.xml",
 *          "externalDataFileName": "students_2_data.csv"
 *      }
 * </code></pre>
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} [base = http://localhost:8080] - The host and port in the url of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchProjectDetails(pathParams, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when fetching project details.", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/details`, base);

    const response = await fetch(url, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    })

    return await responseJson(response);
}

export default fetchProjectDetails;
