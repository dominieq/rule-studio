import { download } from "./utilFunctions";

async function downloadRules(projectId, data) {
    let link = `http://localhost:8080/projects/${projectId}/rules/download`;
    if (data) {
        if (Object.keys(data).includes("format")) {
            link = link + `?format=${data.format}`;
        }
    }

    await download(link);
}

export default downloadRules;