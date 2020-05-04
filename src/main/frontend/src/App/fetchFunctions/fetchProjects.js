import { handleResponse } from "./utilFunctions";

async function fetchProjects(base, method, data) {
    const response = await fetch(`${base}/projects`, {
        method: method,
        body: data
    }).catch(() => null);

    return await handleResponse(response);
}

export default fetchProjects;