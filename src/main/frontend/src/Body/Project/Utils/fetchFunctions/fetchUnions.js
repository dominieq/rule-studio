import { responseJson } from "./utilFunctions";
import { AlertError } from "../../../../Utils/Classes";

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
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchUnions;
