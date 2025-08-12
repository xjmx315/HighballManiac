//ensureParams.test.js

/*
파라미터를 검증하는 미들웨어를 생성합니다
*/

//의존성
import CommonResponse from "../../src/prototype/commonResponse";

//테스트 대상
import ensureParams from "../../src/middlewares/ensureParams";

describe("ensureParams 쿼리 파라미터 검증", () => {
    const requiredQuery = ['id', 'name'];

    const queryMiddleware = ensureParams()
        .onQuery(requiredQuery)
        .shouldNumber(['id'])
        .build();

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("필수 필드가 없을 경우 400", () => {
        queryMiddleware({query: {id: 1}}, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 400, `필수 쿼리가 누락되었습니다. (${'name'})`));
    }); 

    test("쿼리의 형식이 잘못되었을 경우 400", () => {
        queryMiddleware({query: {id: 'wrong', name: 'test'}}, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 400, `쿼리 형식이 잘못되었습니다. (${'id'})`));
    }); 

    test("쿼리 모두 정상 next", () => {
        queryMiddleware({query: {id: 1, name: 'test'}}, res, next);

        expect(res.json).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
