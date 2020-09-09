import { responseJson } from "../parseResponse";
import { AlertError } from "../../../Classes";

async function importProject(serverBase, data) {
    const response = await fetch(`${serverBase}/projects/import`, {
        method: "POST",
        body: data
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    return await responseJson(response);
}

export default importProject;
