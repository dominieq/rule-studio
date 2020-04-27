import { responseJson } from "./utilFunctions";

async function uploadRules(projectId, data) {
    const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
        method: "POST",
        body: data
    }).catch(() => {
        throw { message: "Server not responding", open: true, severity: "error" };
    });

    return await responseJson(response);
}

export default uploadRules;