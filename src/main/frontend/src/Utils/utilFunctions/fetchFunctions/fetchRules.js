import { responseJson } from "./parseResponse";
import { AlertError } from "../../Classes";

async function fetchRules(base, projectId, method, data) {
    const response = await fetch(`${base}/projects/${projectId}/rules`, {
        method: method,
        body: data,
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default fetchRules;
