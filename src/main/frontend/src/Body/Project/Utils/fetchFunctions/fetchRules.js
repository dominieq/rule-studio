import { responseJson } from "./utilFunctions";

async function fetchRules(projectId, method, data) {
    const response = await fetch(`http://localhost:8080/projects/${projectId}/rules`, {
        method: method,
        body: data,
    }).catch(() => {
        throw { message: "Server not responding", open: true, severity: "error" };
    });

    return await responseJson(response);
}

export default fetchRules;