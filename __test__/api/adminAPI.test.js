//adminAPI.test.js
import request from 'supertest';
import app from '../../src/app.js';


//mocking
import usersService from '../../src/services/usersService.js';
jest.mock('../../src/services/usersService.js');

describe('/api/admin/db/init', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //get 요청만 허용하며 body adminPassword 필드에 담긴 비밀번호로 인증을 진행한다. 
    Test('get 올바른 admin 비밀번호를 입력했을때', async () => {
        usersService.login.mockResolvedValue(1);

        const response = await request(app).send().get('/api/admin/db/init');
        console.log(response);
    });

    Test('get 올바르지 않은은 admin 비밀번호를 입력했을때', async () => {
        usersService.login.mockResolvedValue(false);

        const response = await request(app).send().get('/api/admin/db/init');
        console.log(response);
    })
});