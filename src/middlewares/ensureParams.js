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
    const required = {};

    const middleware = {
        onQuery(checkList) {
            required.query = checkList;
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
                
                //숫자 자료형 검사
                for (const element of required.shouldNumberList) {
                    if (!_isNumber(req.query[element])) {
                        return res.status(400).json(new CommonResponse(false, 400, `쿼리 형식이 잘못되었습니다. (${element})`));
                    }
                };

                next();
            };
        }
    };

    return middleware;
};

export default ensureParams;