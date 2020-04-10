async function handleResponse(response, ignore) {
    if (response.status === 200) {
        return response.json().catch(error => {
            console.log(error);
            return null;
        });
    } else {
        const result = await response.json().catch(error => {
            console.log(error);
            return null;
        });

        let msg = result.message;
        if (Array.isArray(ignore) && ignore.length) {
            if (!ignore.includes(result.status)) {
                throw {message: msg, open: true, severity: "warning"};
            }
        } else if (typeof ignore === 'number') {
            if (ignore !== result.status) {
                throw {message: msg, open: true, severity: "warning"};
            }
        }
    }
}

export default handleResponse