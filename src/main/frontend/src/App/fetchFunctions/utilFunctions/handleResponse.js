async function handleResponse(response) {
    let httpStatus = Math.trunc(response.status / 100);

    if (httpStatus === 2) {
        return response.json().catch(() => null);
    } else {
        const result = await response.json().catch(() => null);

        if (result) {
            let severity;

            switch (httpStatus) {
                case 4: {
                    severity = "error"
                    break;
                }
                case 5: {
                    severity = "warning"
                    break;
                }
                default: severity = "info";
            }

            throw { message: result.message, open: true, severity: severity }
        }
    }
}

export default handleResponse;