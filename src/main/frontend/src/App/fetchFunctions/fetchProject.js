import { handleResponse } from "./utilFunctions";

async function fetchProject(base, projectId, method, data) {
    const response = await fetch(`${base}/projects/${projectId}`, {
        method: method,
        body: data
    }).catch(() => null);

    return await handleResponse(response);
}

export default fetchProject;