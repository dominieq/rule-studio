import { handleResponse } from "./utilFunctions";

async function fetchCones( projectId, method, data, ignoreStatus ) {
    const response = await fetch(`http://localhost:8080/projects/${projectId}/cones`, {
        method: method,
        body: data,
    }).catch(error => {
        console.log(error);
        return null
    });

    return await handleResponse(response, ignoreStatus);
}

export default fetchCones;

