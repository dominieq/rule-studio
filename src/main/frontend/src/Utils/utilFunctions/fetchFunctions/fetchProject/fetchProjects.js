import { AlertError, InvalidPathParamsException } from "../../../Classes";
import { responseJson } from "../parseResponse";

/**
 * <h3>Overview</h3>
 * Performs an API call with GET or POST method and specified body on <code>/projects</code>
 *
 * <h3>Goal</h3>
 * The goal of this functions is to retrieve all project from server or create another one.
 *
 * <h3>Examples</h3>
 * When method is set to GET
 * <br/>
 * <br/>
 * <pre><code>
 *     [
 *          {
 *              "id": "2bd9663c-725b-41aa-bb99-d41a43cf1f66",
 *              "name": "students"
 *          },
 *          {
 *              "id": "bcde2e1c-e76a-433b-862d-469e5bf16a93",
 *              "name": "students 2"
 *          }
 *     ]
 * </code></pre>
 * When method is set to POST
 * <br/>
 * <br/>
 * <pre><code>
 *     {
 *         "id": "2bd9663c-725b-41aa-bb99-d41a43cf1f66",
 *         "name": "students"
 *     }
 * </code></pre>
 *
 * <h3>Usage</h3>
 * In order to create project with three files: metadata, data and rules,
 * create <code>FormData</code> object and append mentioned files to the object using <code>append</code> method.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} method - The HTTP method of an API call.
 * @param {FormData} body - The body in the message of an API call.
 * @param {string} [base = http://localhost:8080] - The host and port in the URL of an API call.
 * @throws AlertError
 * @throws InvalidPathParamsException
 * @returns {Promise<Object>}
 */
async function fetchProjects(method, body, base = "http://localhost:8080") {
    if (body != null && !body instanceof FormData) {
        throw new InvalidPathParamsException("Invalid body when fetching projects.", body);
    }

    const url = new URL("/projects", base);

    const response = await fetch(url, { method, body }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchProjects;
