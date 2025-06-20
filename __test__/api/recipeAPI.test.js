//recipeAPI.test.js

import app from '../../src/app.js';
import request from 'supertest';

describe('/api/admin/db/init', () => {
    Test('새로운 레시피 작성 - 정상 작성', async () => {
        const response = await request(app)
            .set({ 'authorization': 'Bearer *****'})
            .post('/api/recipe')
            .send({ 'name':  '진 피즈',
                'discription': '탄산수, 레몬주스, 설탕이 들어간 유명한 칵테일. ',
                'recipe': '1. 셰이커에 탄산수를 제외한 주재료를 얼음과 함께 넣고 잘 흔들어준다.\n2. 얼음을 걸러내 텀블러 글라스에 따라준다. 이때 텀블러 글라스에 얼음은 넣지 않는다.\n3. 약간의 탄산수를 부어서 채워준다.\n4. 레몬 슬라이스와 원한다면 레몬 제스트로 가니쉬해준다.',
                'image': '',
                'alcohol': 13,
                'tags': [],
                'items': [],
                'ingredients': [],
            });

        expect(response.status).toBe(201);
    });
});