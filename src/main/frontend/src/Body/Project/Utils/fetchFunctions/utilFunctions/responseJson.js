import handleNotOk from "./handleNotOk";

async function responseJson(response) {
    if (response.status === 200) {
        return response.json().catch(() => null);
    } else {
        return await handleNotOk(response);
    }
}

export default responseJson