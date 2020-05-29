import { responseBlob } from "./index";
import { AlertError } from "../../../../../Utils/Classes";

async function download(link) {
    const response = await fetch(link, {
        method: "GET"
    }).catch(() => {
        throw new AlertError("Server not responding", true, "error");
    });

    const result = await responseBlob(response);
    const fileName = response.headers.get('Content-Disposition').split('filename=')[1];

    if (result) {
        let url = window.URL.createObjectURL(result);
        let link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
    }
}

export default download;
