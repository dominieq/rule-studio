import { responseJson } from "./utilFunctions";

async function fetchCones( projectId, method, data ) {
    const response = await fetch(`http://localhost:8080/projects/${projectId}/cones`, {
        method: method,
        body: data,
    }).catch(() => {
        throw { message: "Server not responding", open: true, severity: "error" };
    });

    return await responseJson(response);
}

export default fetchCones;

