import { responseJson } from "./utilFunctions";

async function fetchData(serverBase, projectId, data) {
    const response = await fetch(`${serverBase}/projects/${projectId}/data`, {
        method: "POST",
        body:  data
    }).catch(error => console.log(error));

    return await responseJson(response);
}

export default fetchData;