import { responseJson } from "./utilFunctions";

async function uploadRules(base, projectId, data) {
    const response = await fetch(`${base}/projects/${projectId}`, {
        method: "POST",
        body: data
    }).catch(() => {
        throw { message: "Server not responding", open: true, severity: "error" };
    });

    return await responseJson(response);
}

export default uploadRules;