import handleNotOk from "./handleNotOk";

async function responseJson(response, ignore) {
    if (response.status === 200) {
        return response.json().catch(error => {
            console.log(error);
            return null;
        });
    } else {
        return await handleNotOk(response, ignore);
    }
}

export default responseJson