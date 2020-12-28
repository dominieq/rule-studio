import { AlertError } from "../../../Classes";

/**
 * <h3>Overview</h3>
 * Determines the severity of a thrown {@link AlertError}.
 * <br>
 * <br>
 * 4** - corresponds to 'error' severity,
 * <br>
 * 5** - corresponds to 'warning' severity,
 * <br>
 * any other will be marked as 'info'.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} response - A response from server with status different than 2**.
 * @throws AlertError
 * @returns {Promise<Object>}
 */
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
