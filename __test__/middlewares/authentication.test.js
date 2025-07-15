//authentication.test.js

//의존성
import CommonResponse from '../../src/prototype/commonResponse.js';
jest.mock('../../src/services/usersService.js');
import usersService from '../../src/services/usersService.js';

//테스트 대상
import authentication from '../../src/middlewares/authentication.js';

describe('authentication middleware test', () => {
    beforeAll(() => {
        usersService.authUser.mockImplementation((token) => {
            return new Promise((resolve, reject) => {
                if (token === "올바른토큰"){
                    resolve({ data: "this is sample user data" });
                }
                else{
                    resolve(false);
                }
            })
        })
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('authentication header가 없을 때 401 에러', async () => {
        const req = {
            headers: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await authentication(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 401, "인증 토큰이 필요합니다. (authorization 헤더를 포함해야 합니다.)"));
    });

    test('올바르지 않은 토큰을 포함했을 때 401 에러', async () => {
        const req = {
            headers: { authorization: 'Bearer 올바르지않은토큰' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await authentication(req, res, next);

        expect(usersService.authUser).toHaveBeenCalledWith('올바르지않은토큰');

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 401, "인증 토큰이 유효하지 않습니다. "));
    });

    test('올바른 토큰을 포함했을 때 req에 userInfo를 추가하고 next 호출', async () => {
        const req = {
            headers: { authorization: 'Bearer 올바른토큰' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await authentication(req, res, next);

        expect(usersService.authUser).toHaveBeenCalledWith('올바른토큰');

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(req).toHaveProperty('userInfo');
    });
});