import handleNotOk from "./handleNotOk";

async function responseBlob(response, ignore) {
    if (response.status === 200) {
        return response.blob().catch(error => {
            console.log(error);
            return null;
        });
    } else {
        return await handleNotOk(response, ignore);
    }
}

export default responseBlob;