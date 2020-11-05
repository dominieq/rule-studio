import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET method and specified body on <code>/projects/import</code>.
 *
 * <h3>Goal</h3>
 * The goal of this function is to import project from ZIP file.
 *
 * <h3>Example response</h3>
 * <pre><code>
 *     {
 *         "id": "2bd9663c-725b-41aa-bb99-d41a43cf1f66",
 *         "name": "students"
 *     }
 * </code></pre>
 *
 * <h3>Usage</h3>
 * In order to import project from ZIP file, create <code>FormData</code> object
 * and append mentioned file with <code>importFile</code> key.
 *
 * @category Utils
 * @subcategory Functions
 * @param {FormData} body - The body in the message of an API call.
 * @param {string} [base=http://localhost:8080] - The host and port in the URL of an API call.
 * @returns {Promise<Object>}
 */
async function importProject(body, base = "http://localhost:8080") {
    if (!(body instanceof FormData && body.has("importFile"))) {
        throw new InvalidPathParamsException("Body should be defined when importing project.", body);
    }

    const url = new URL("/projects/import", base);

    const response = await fetch(url, {
        method: "POST",
        body: body
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default importProject;
