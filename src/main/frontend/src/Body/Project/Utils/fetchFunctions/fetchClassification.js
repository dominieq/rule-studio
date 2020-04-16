import { responseJson } from "./utilFunctions";

async function fetchClassification(projectId, method, data) {
    const response = await fetch(`http://localhost:8080/projects/${projectId}/classification`, {
        method: method,
        body: data
    }).catch(() => {
        throw { message: "Server not responding", open: true, severity: "error" };
    });

    return await responseJson(response);
}

export default fetchClassification;