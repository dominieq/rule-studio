import { downloadFunction } from "../downloadFunction";
import { InvalidPathParamsException } from "../../../Classes";

/**
 * Downloads rules in specified format.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {Object} queryParams - The query parameters in the URL of an API call.
 * @param {"txt"|"xml"} queryParams.format - The format in which rules should downloaded.
 * @param {string} base - The host in the URL of an API call.
 * @throws InvalidPathParamsException
 */
async function downloadRules(pathParams, queryParams, base) {
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
