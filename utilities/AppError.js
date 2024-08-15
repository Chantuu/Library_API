/**
 * This error class is used for
 * representing any validation errors
 * coming from express-validator.
 */
class ValidationError {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     * @param {Array} innerValidationErrors Array of any additional errors (optional)
     */
    constructor(message, innerValidationErrors = []) {
        this.message = message;
        this.innerValidationErrors = innerValidationErrors;
    }
}

module.exports.ValidationError = ValidationError;
