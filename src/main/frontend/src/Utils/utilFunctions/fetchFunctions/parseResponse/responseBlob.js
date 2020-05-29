import handleNotOk from "./handleNotOk";

async function responseBlob(response) {
    if (response.status === 200) {
        return response.blob().catch(() => null);
    } else {
        return await handleNotOk(response);
    }
}

export default responseBlob;
