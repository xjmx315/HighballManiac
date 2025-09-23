//asyncHandler.js
import { CommonError, ServerError } from "../errors/CommonError";

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(error => {
        if (error instanceof CommonError) {
            return next(error);
        }
        const wrappedError = new ServerError('An unexpected server error occurred.', error);
        return next(wrappedError);
    });
};

export default asyncHandler;