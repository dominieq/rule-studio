import { downloadFunction } from "./downloadFunction";

/**
 * Downloads rules in specified format.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} base - The name of the host.
 * @param {string} projectId - The id of current project.
 * @param {Object} data - The parameters in URL.
 */
async function downloadRules(base, projectId, data) {
    let link = `${base}/projects/${projectId}/rules/download`;

    if (data) {
        if (Object.keys(data).includes("format")) {
            link = link + `?format=${data.format}`;
        }
    }

    await downloadFunction(link);
}

export default downloadRules;
