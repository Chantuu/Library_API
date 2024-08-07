class ValidationError extends Error {
    constructor(message, statusCode, innerValidationErrors) {
        super(message);
        this.statusCode = statusCode;
        this.innerValidationErrors = innerValidationErrors;
    }
}

module.exports = ValidationError;
