//CommonError.js

class CommonError extends Error {
    constructor(message, status, code, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
};

//400~
class ValidationError extends CommonError {
    constructor(message, details) {
        super(message, 400, 'VALIDATION_ERROR', details);
    };
};
  
class ConflictError extends CommonError {
    constructor(message, details) {
        super(message, 409, 'CONFLICT', details);
    };
};


//500~
class ServiceError extends CommonError {
    constructor(message, details) {
        super(message, 500, 'SERVICE_ERROR', details);
    };
};

export {
    CommonError,
    ValidationError,
    ConflictError,
    ServiceError
}