class ValidationError {
    constructor(message, statusCode, innerValidationErrors) {
        this.message = message;
        this.statusCode = statusCode;
        this.innerValidationErrors = innerValidationErrors;
    }
}

module.exports = ValidationError;
