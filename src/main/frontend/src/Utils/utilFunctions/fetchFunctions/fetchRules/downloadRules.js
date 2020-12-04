import { downloadFunction } from "../downloadFunction";
import { InvalidPathParamsException } from "../../../Classes";

/**
 * <h3>Overview</h3>
 * Utilizes {@link downloadFunction} to download rules from <code>/projects/{projectId}/rules/download</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * <h3>Usage</h3>
 * In order to download rules in XML format specify <code>queryParams</code> accordingly:
 * <code>{ format: "xml" }</code>.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {Object} queryParams - The query parameters in the URL of an API call.
 * @param {"txt"|"xml"} queryParams.format - The format in which rules should be downloaded.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @throws InvalidPathParamsException
 */
async function downloadRules(pathParams, queryParams, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when downloading rules", pathParams);
    }

    if (!(queryParams != null && queryParams.hasOwnProperty("format"))) {
        throw new InvalidPathParamsException("Query params should be defined when downloading rules.", queryParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/rules/download`, base);
    url.searchParams.append("format", queryParams.format);

    await downloadFunction(url);
}

export default downloadRules;
