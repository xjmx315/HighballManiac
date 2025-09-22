//errorHandler.js

import CommonResponse from "../prototype/commonResponse.js";
import { CommonError } from "../errors/CommonError.js";

function errorHandler (err, req, res, next) {
    const httpStatus = err.status || 500;
    const errorMessage = err.message || 'unexpected error has occurred';
    if (httpStatus === 500) {
        console.log(err);
    }

    if (err instanceof CommonError) {
        return res.status(httpStatus).json(
            new CommonResponse(false, httpStatus, errorMessage, err.code )
        );
    }

    return res.status(httpStatus).json(
        new CommonResponse(false, httpStatus, errorMessage, {err})
    );
};

export default errorHandler;