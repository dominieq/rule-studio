/**
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

        this.message = message;
        this.pathParams = pathParams;

        Object.setPrototypeOf(this, InvalidPathParamsException);
    }
}

export default InvalidPathParamsException;
