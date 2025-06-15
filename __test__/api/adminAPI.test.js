//adminAPI.test.js
import request from 'supertest';
import app from '../../src/app.js';

//mocking
import { jest } from '@jest/globals';
import usersService from '../../src/services/usersService.js';

const mockLogin = jest.fn();
jest.mock('../../src/services/usersService.js', () => ({
    __esModule: true,
    default: {
        login: mockLogin
    }
}));

describe('/api/admin/db/init', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //get 요청만 허용하며 body adminPassword 필드에 담긴 비밀번호로 인증을 진행한다. 
    test('get 올바른 admin 비밀번호를 입력했을때', async () => {
        mockLogin.mockResolvedValue(1);

        const response = await request(app).get('/api/admin/db/init').send();
        console.log(response);
    });

    test('get 올바르지 않은은 admin 비밀번호를 입력했을때', async () => {
        mockLogin.mockResolvedValue(false);

        const response = await request(app).get('/api/admin/db/init').send();
        console.log(response);
    })
});