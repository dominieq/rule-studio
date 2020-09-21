class InvalidPathParamsException {
    constructor(message, pathParams) {
        this.message = message;
        this.pathParams = pathParams;
    }
}

export default InvalidPathParamsException;