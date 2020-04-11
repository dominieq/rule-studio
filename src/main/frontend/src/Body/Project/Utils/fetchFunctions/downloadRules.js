import { responseBlob } from "./utilFunctions";

async function downloadRules(projectId) {
    const response = await fetch(`http://localhost:8080/projects/${projectId}/rules/download`, {
        method: "GET"
    }).catch(error => {
        console.log(error);
        return null;
    });
    const fileName = response.headers.get('Content-Disposition').split('filename=')[1];
    const result = await responseBlob(response, []);

    if (result) {
        let url = window.URL.createObjectURL(result);
        let link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
    }

}

export default downloadRules;