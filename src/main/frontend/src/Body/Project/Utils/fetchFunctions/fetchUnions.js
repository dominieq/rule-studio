import { responseJson } from "./utilFunctions";

async function fetchUnions(projectId, method, data, ignoreStatus) {
    let query = ""
    if (data && !(data instanceof FormData)) {
        query = `?typeOfUnions=${data.typeOfUnions}&consistencyThreshold=${data.consistencyThreshold}`;
        data = null;
    }

    const response = await fetch(`http://localhost:8080/projects/${projectId}/unions` + query, {
        method: method,
        body: data,
    }).catch(error => {
        console.log(error);
        return null;
    });

    return await responseJson(response, ignoreStatus);
}

export default fetchUnions;