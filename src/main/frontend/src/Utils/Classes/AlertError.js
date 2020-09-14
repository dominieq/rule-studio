/**
 * AlertError is and object that represents propTypes for StyledAlert.
 * It is thrown when an error occurs inside fetch functions.
 *
 * @name Alert Error
 * @constructor
 * @category Utils
 * @subcategory Classes
 * @param {React.ReactNode} message A text that is going to be displayed inside of a StyledAlert.
 * @param {boolean} open A condition used to determine whether a StyledAlert should be displayed.
 * @param {string} severity One of values: info, success, warning, error.
 */
class AlertError {
    constructor(message, open, severity) {
        this.message = message;
        this.open = open;
        this.severity = severity;
    };
}

export default AlertError;
