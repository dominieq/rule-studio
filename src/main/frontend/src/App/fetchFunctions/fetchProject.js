import { handleResponse } from "./utilFunctions";

async function fetchProject(projectId, method, data) {
    const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
        method: method,
        body: data
    }).catch(() => null);

    return await handleResponse(response);
}

export default fetchProject;