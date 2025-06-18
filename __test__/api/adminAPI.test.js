//adminAPI.test.js

jest.mock('../../src/services/usersService.js');

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
        usersService.login.mockResolvedValue(false);

        const response = await request(app)
            .get('/api/admin/db/init')
            .send({ adminPassword: 'wrrongPassword' });
        console.log(response.body);

        //상태 코드
        expect(response.status).toBe(401);

        //body
        expect(response.body).toEqual({
            ok: false,
            code: 401,
            message: '비밀번호가 올바르지 않습니다. ', 
            data: {}
        });
    });

    test('비밀번호를 포함하지 않았을때', async () => {
        const response = await request(app).get('/api/admin/db/init').send();
        
        //상태 코드
        expect(response.status).toBe(401);

        //body
        expect(response.body).toEqual({
            ok: false,
            code: 401,
            message: '관리자 비밀번호를 포함해야 합니다. ', 
            data: {}
        });
    });

    afterAll(async () => {
        await db.end();
    })
});