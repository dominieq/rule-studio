import { downloadFunction } from "./downloadFunction";

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
