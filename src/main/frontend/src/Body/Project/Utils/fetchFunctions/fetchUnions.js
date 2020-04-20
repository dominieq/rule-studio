import { responseJson } from "./utilFunctions";

async function fetchUnions(projectId, method, data) {
    let query = ""
    if (data && !(data instanceof FormData)) {
        query = `?typeOfUnions=${data.typeOfUnions}&consistencyThreshold=${data.consistencyThreshold}`;
        data = null;
    }

    const response = await fetch(`http://localhost:8080/projects/${projectId}/unions` + query, {
        method: method,
        body: data,
    }).catch(() => {
        throw { message: "Server not responding", open: true, severity: "error" };
    });

    return await responseJson(response);
}

export default fetchUnions;