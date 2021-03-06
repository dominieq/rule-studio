/**
 * <h3>Overview</h3>
 * Thrown when invalid path parameters are forwarded to fetch functions.
 *
 * @constructor
 * @category Utils
 * @subcategory Classes
 * @param {string} message - The cause of an error.
 * @param {object} pathParams - Invalid object that was the cause of this error.
 */
class InvalidPathParamsException extends Error {
    constructor(message, pathParams) {
        super();

        this.type = "InvalidPathParamsException";
        this.message = message;
        this.pathParams = pathParams;
    }
}

export default InvalidPathParamsException;
