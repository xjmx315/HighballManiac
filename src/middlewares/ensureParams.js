//ensureParams.js

import CommonResponse from "../prototype/commonResponse";

function _checkObj(obj, arr) {
    for (const element of arr) { 
        if (!(element in obj)) {
            return element; 
        }
    }
    return false;
};

function _isNumber(value) {
    if (value == null || value === '') return false;
    return !isNaN(Number(value));
};

function ensureParams () {
    const required = {
        query: [],
        body: [],
        params: [],
        shouldNumberList: []
    };

    const middleware = {
        onQuery(checkList) {
            required.query = checkList;
            return this;
        },
        onBody(checkList) {
            required.body = checkList;
            return this;
        },
        onParam(checkList) {
            required.params = checkList;
            return this;
        },
        shouldNumber(checkList) {
            required.shouldNumberList = checkList;
            return this;
        },
        build() {
            return (req, res, next) => {
                console.log('ensureParams build! with', required);
                //쿼리 검사
                const missingQuery = _checkObj(req.query, required.query);
                if (missingQuery) {
                    return res.status(400).json(new CommonResponse(false, 400, `필수 쿼리가 누락되었습니다. (${missingQuery})`));
                }

                //body 필드 검사
                const missingField = _checkObj(req.body, required.body);
                if (missingField) {
                    return res.status(400).json(new CommonResponse(false, 400, `필수 필드가 누락되었습니다. (${missingField})`));
                }

                //param 필드 검사
                const missingParam = _checkObj(req.params, required.params);
                if (missingParam) {
                    return res.status(400).json(new CommonResponse(false, 400, `필수 파라미터가 누락되었습니다. (${missingParam})`));
                }
                
                //숫자 자료형 검사
                for (const element of required.shouldNumberList) {
                    if (element in req.query && !_isNumber(req.query[element])) {
                        return res.status(400).json(new CommonResponse(false, 400, `쿼리 형식이 잘못되었습니다. (${element})`));
                    }
                    if (element in req.body && !_isNumber(req.body[element])) {
                        return res.status(400).json(new CommonResponse(false, 400, `필드 형식이 잘못되었습니다. (${element})`));
                    }
                    if (element in req.params && !_isNumber(req.params[element])) {
                        return res.status(400).json(new CommonResponse(false, 400, `파라미터 형식이 잘못되었습니다. (${element})`));
                    }
                };

                next();
            };
        }
    };

    return middleware;
};

export default ensureParams;