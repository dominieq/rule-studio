/**
 * AlertError is and object that represents propTypes for StyledAlert.
 * Thrown when an error occurs inside fetch functions.
 *
 * @constructor
 * @category Utils
 * @subcategory Classes
 * @param {React.ReactNode} message - The content of the {@link StyledAlert} element.
 * @param {boolean} open - If <code>true</code> the {@link StyledAlert} element will be open.
 * @param {"info"|"success"|"warning"|"error"} severity - The severity of the {@link StyledAlert} element.
 */
class AlertError extends Error {
    constructor(message, open, severity) {
        super();

        this.message = message;
        this.open = open;
        this.severity = severity;

        Object.setPrototypeOf(this, AlertError);
    };
}

export default AlertError;
