import { AlertError } from "../../../Classes";

async function handleNotOk(response) {
    const result = await response.json().catch(() => null);

    if (result) {
        if (result.status === 404) {
            throw new AlertError(result.message, true, "info");
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

            throw new AlertError(result.message, true, severity);
        }
    } else {
        return null;
    }
}

export default handleNotOk;
