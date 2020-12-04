import { InvalidPathParamsException } from "../../../Classes";
import { downloadFunction } from "../downloadFunction";

/**
 * <h3>Overview</h3>
 * Utilizes {@link downloadFunction} to download project from <code>/project/{projectId}/export</code>
 * where <code>projectId</code> is the identifier of a selected project.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} pathParams - The path parameters in the URL of an API call.
 * @param {string} pathParams.projectId - The identifier of a selected project.
 * @param {string} [base=http://localhost:8080] - The host and port in the URL of an API call.
 * @throws InvalidPathParamsException
 * @returns {Promise<void>}
 */
async function exportProject(pathParams, base = "http://localhost:8080") {
    if (!(pathParams != null && pathParams.hasOwnProperty("projectId"))) {
        throw new InvalidPathParamsException("Path params should be defined when exporting project.", pathParams);
    }

    const url = new URL(`/projects/${pathParams.projectId}/export`, base);

    await downloadFunction(url);
}

export default exportProject;
