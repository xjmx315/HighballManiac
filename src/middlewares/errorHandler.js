//errorHandler.js

import CommonResponse from "../prototype/commonResponse.js";

function errorHandler (err, req, res, next) {
    const httpStatus = err.status || 500;
    const errorMessage = err.message || '예기치 않은 에러가 발생했습니다. ';
    if (httpStatus === 500) {
        console.log(err);
    }
    return res.status(httpStatus).json(new CommonResponse(false, httpStatus, errorMessage, {err}));
};

export default errorHandler;