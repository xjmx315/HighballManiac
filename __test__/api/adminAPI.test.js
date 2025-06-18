//adminAPI.test.js

//mocking
//import { afterAll, expect, jest } from '@jest/globals';

/*
jest.mock('../../src/services/usersService.js', () => ({
    __esModule: true,
    default: {
        login: jest.fn()
    }
}));
*/

jest.mock('../../src/services/usersService.js');

//import after mocking
import request from 'supertest';
import app from '../../src/app.js';
import db from '../../src/models/db.js';
import usersService from '../../src/services/usersService.js';

describe('/api/admin/db/init', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //get 요청만 허용하며 body adminPassword 필드에 담긴 비밀번호로 인증을 진행한다. 
    test('get 올바른 admin 비밀번호를 입력했을때', async () => {
        usersService.login.mockResolvedValue(1);

        const response = await request(app)
            .get('/api/admin/db/init')
            .send({ adminPassword: 'correctPassword' });

        // 모킹 확인을 위한 로그 추가
        console.log('mockLogin 호출 횟수:', usersService.login.mock.calls.length);
        console.log('mockLogin 호출 인자:', usersService.login.mock.calls[0]);
        console.log('mockLogin 반환값:', await usersService.login.mock.results[0].value);
        console.log('response body:', response.body);
    
        //상태 코드
        expect(response.status).toBe(200);

        //body
        expect(response.body).toEqual({
            ok: true,
            code: 200,
            message: 'succeed', 
            data: {}
        });
    });

    test('get 올바르지 않은은 admin 비밀번호를 입력했을때', async () => {
        //mockLogin.mockResolvedValue(false);
        usersService.login.mockResolvedValue(false);

        const response = await request(app)
            .get('/api/admin/db/init')
            .send({ adminPassword: 'wrrongPassword' });
        console.log(response.body);
    });

    test('비밀번호를 포함하지 않았을때', async () => {
        const response = await request(app).get('/api/admin/db/init').send();
        console.log(response.body);
    });

    afterAll(async () => {
        await db.end();
    })
});