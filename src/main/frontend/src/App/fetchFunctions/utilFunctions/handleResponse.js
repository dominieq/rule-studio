import { AlertError } from "../../../Utils/Classes";

/**
 * If received status was 2**, returns response parsed to JSON.
 * Otherwise, determines the severity of a thrown {@link AlertError}:
 * - 4** - corresponds to 'error' severity,
 * - 5** - corresponds to 'warning' severity,
 * - any other will be marked as 'info'.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} response - A response from the server.
 * @throws AlertError
 * @returns {Promise<Object>}
 */
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

            throw new AlertError(result.message, true, severity);
        }
    }
}

export default handleResponse;
