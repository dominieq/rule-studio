import { handleResponse } from "./utilFunctions";

async function fetchProjects(method, data) {
    const response = await fetch(`http://localhost:8080/projects`, {
        method: method,
        body: data
    }).catch(() => null);

    return await handleResponse(response);
}

export default fetchProjects;