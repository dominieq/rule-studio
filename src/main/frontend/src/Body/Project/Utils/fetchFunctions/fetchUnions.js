import { responseJson } from "./utilFunctions";

async function fetchUnions(base, projectId, method, data) {
    let query = ""
    if (data && Object.keys(data).length) {
        query = `?typeOfUnions=${data.typeOfUnions}&consistencyThreshold=${data.consistencyThreshold}`;
        data = null;
    }

    const response = await fetch(`${base}/projects/${projectId}/unions` + query, {
        method: method,
        body: data,
    }).catch(() => {
        throw { message: "Server not responding", open: true, severity: "error" };
    });

    return await responseJson(response);
}

export default fetchUnions;