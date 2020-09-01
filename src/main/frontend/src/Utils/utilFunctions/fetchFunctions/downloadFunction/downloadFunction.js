import { responseBlob } from "../parseResponse";
import { AlertError } from "../../../Classes";

/**
 * Downloads data from provided link.
 *
 * @category Utils
 * @subcategory Functions
 * @param {string} link - The link to download data from.
 * @throws AlertError
 */
async function downloadFunction(link) {
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

export default downloadFunction;
