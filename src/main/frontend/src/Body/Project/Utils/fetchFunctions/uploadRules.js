import { responseJson } from "./utilFunctions";

async function uploadRules(projectId, data) {
    const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
        method: "POST",
        body: data
    }).catch(error => {
        console.log(error);
        return null;
    });

    return await responseJson(response, []);
}

export default uploadRules;