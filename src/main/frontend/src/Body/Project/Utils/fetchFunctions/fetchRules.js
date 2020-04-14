import { responseJson } from "./utilFunctions";

async function fetchRules(projectId, method, data, ignoreStatus) {
    const response = await fetch(`http://localhost:8080/projects/${projectId}/rules`, {
        method: method,
        body: data,
    }).catch(error => {
        console.log(error);
        return null;
    });

    return await responseJson(response, ignoreStatus);
}

export default fetchRules;