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

class UnauthorizedError extends CommonError {
    constructor(message, details) {
        super(message, 401, 'UNAUTHORIZED_ERROR', details);
    };
};

class ForbiddenError extends CommonError {
    constructor(message, details) {
        super(message, 403, 'FORBIDDEN_ERROR', details);
    };
};

class NotFoundError extends CommonError {
    constructor(message, details) {
        super(message, 404, 'NOT_FOUND', details);
    };
};

class ConflictError extends CommonError {
    constructor(message, details) {
        super(message, 409, 'CONFLICT', details);
    };
};

//500~
class ServerError extends CommonError {
    constructor(message, details) {
        super(message, 500, 'SERVER_ERROR', details);
    };
};

export {
    CommonError,
    ValidationError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ServerError
}