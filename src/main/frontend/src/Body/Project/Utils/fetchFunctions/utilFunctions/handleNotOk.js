async function handleNotOk(response) {
    const result = await response.json().catch(() => null);

    if (result) {
        if (result.status === 404) {
            throw { message: result.message, open: true, severity: "info" }

        } else {
            let httpStatus = Math.trunc(result.status / 100);
            let severity;

            switch (httpStatus) {
                case 4: {
                    severity = "error";
                    break;
                }
                case 5: {
                    severity = "warning";
                    break;
                }
                default: severity = "info";
            }

            throw { message: result.message, open: true, severity: severity }
        }
    } else {
        return null;
    }
}

export default handleNotOk;